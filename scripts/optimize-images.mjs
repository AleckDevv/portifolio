// Converte as imagens brutas (assets-src/) em AVIF + WebP responsivos.
//
// Uso: npm run images
//
// Entrada:  assets-src/captures/<slug>/*.png  (capturas das demos publicadas)
//           assets-src/repo/<slug>/*.png      (capturas que já existem nos repositórios)
// Saída:    public/images/<slug>/<nome>-<largura>.{avif,webp}
//           src/content/images.generated.json (dimensões, cor média e srcsets)
//
// Só são publicadas as imagens referenciadas em src/content/projects.ts (as
// demais capturas brutas ficam guardadas em assets-src/). O processamento é
// incremental: arquivos já gerados e mais novos que a origem são reaproveitados.

import sharp from "sharp";
import { mkdir, readdir, rm, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { projects } from "../src/content/projects.ts";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SOURCES = [
  { dir: path.join(ROOT, "assets-src", "captures"), origin: "demo" },
  { dir: path.join(ROOT, "assets-src", "repo"), origin: "repo" },
];
const OUT_DIR = path.join(ROOT, "public", "images");
const MANIFEST = path.join(ROOT, "src", "content", "images.generated.json");

/** Ajustes específicos por imagem (id = "<slug>/<nome>"). */
const OVERRIDES = {
  // Capturas do autor feitas no navegador: remove a barra do navegador e a borda da janela.
  "agencia/autor-inicio": { crop: { left: 3, top: 112, right: 17, bottom: 3 } },
  "agencia/autor-servicos": { crop: { left: 3, top: 112, right: 17, bottom: 3 } },
  "agencia/autor-final": { crop: { left: 3, top: 112, right: 17, bottom: 3 } },
};

function plan(id, meta) {
  const name = id.split("/")[1];
  const isFull = name.endsWith("-full");
  const isMobile = name.includes("mobile");
  if (isFull && isMobile) return { widths: [360, 720], maxRatio: 8 };
  if (isFull) return { widths: [800, 1440], maxRatio: 5 };
  if (isMobile || meta.width <= 600) return { widths: [Math.min(400, meta.width), Math.min(800, meta.width)] };
  return { widths: [720, 1280, 1920] };
}

const QUALITY = { avif: { quality: 58, effort: 4 }, webp: { quality: 80, effort: 5 } };

async function isFresh(target, sourceMtime) {
  try {
    return (await stat(target)).mtimeMs >= sourceMtime;
  } catch {
    return false;
  }
}

function toHex({ r, g, b }) {
  return "#" + [r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("");
}

async function processImage(file, slug, origin) {
  const name = path.basename(file, path.extname(file));
  const id = `${slug}/${name}`;
  const sourceMtime = (await stat(file)).mtimeMs;
  const meta = await sharp(file).metadata();
  const override = OVERRIDES[id] ?? {};

  let region = { left: 0, top: 0, width: meta.width, height: meta.height };
  if (override.crop) {
    const c = override.crop;
    region = { left: c.left, top: c.top, width: meta.width - c.left - c.right, height: meta.height - c.top - c.bottom };
  }
  const p = plan(id, region);
  if (p.maxRatio && region.height > region.width * p.maxRatio) {
    region.height = Math.round(region.width * p.maxRatio);
  }

  const widths = [...new Set(p.widths.filter((w) => w <= region.width))].sort((a, b) => a - b);
  if (!widths.length) widths.push(region.width);

  await mkdir(path.join(OUT_DIR, slug), { recursive: true });
  // Formato compacto: w/h = dimensões, o = origem, c = cor dominante, s = larguras geradas.
  // Os caminhos seguem a convenção images/<slug>/<nome>-<largura>.<formato>.
  const entry = { w: region.width, h: region.height, o: origin, c: "#dddddd", s: widths };

  const base = () => sharp(file).extract(region);
  const { dominant } = await base().stats();
  entry.c = toHex(dominant);

  for (const w of widths) {
    for (const format of ["avif", "webp"]) {
      const rel = `images/${slug}/${name}-${w}.${format}`;
      const target = path.join(ROOT, "public", rel);
      if (!(await isFresh(target, sourceMtime))) {
        await base().resize({ width: w, withoutEnlargement: true })[format](QUALITY[format]).toFile(target);
      }
    }
  }
  return [id, entry];
}

async function pool(items, size, fn) {
  const results = [];
  let i = 0;
  const workers = Array.from({ length: size }, async () => {
    while (i < items.length) {
      const item = items[i++];
      results.push(await fn(item));
    }
  });
  await Promise.all(workers);
  return results;
}

// Imagens usadas pelo site (galerias e módulos).
const referenced = new Set(
  projects.flatMap((p) => [...p.shots.map((s) => s.image), ...(p.modules ?? []).map((m) => m.shot.image)]),
);

const jobs = [];
for (const { dir, origin } of SOURCES) {
  let slugs = [];
  try {
    slugs = await readdir(dir);
  } catch {
    continue;
  }
  for (const slug of slugs) {
    for (const f of await readdir(path.join(dir, slug))) {
      const id = `${slug}/${path.basename(f, path.extname(f))}`;
      if (/\.(png|jpe?g)$/i.test(f) && referenced.has(id)) jobs.push({ file: path.join(dir, slug, f), slug, origin });
    }
  }
}

console.log(`Otimizando ${jobs.length} imagens…`);
const started = Date.now();
const entries = await pool(jobs, 4, async (job) => {
  const result = await processImage(job.file, job.slug, job.origin);
  process.stdout.write(".");
  return result;
});
const manifest = Object.fromEntries(entries.sort(([a], [b]) => a.localeCompare(b)));

const missing = [...referenced].filter((id) => !(id in manifest));
if (missing.length) throw new Error(`Imagens referenciadas sem arquivo bruto em assets-src/: ${missing.join(", ")}`);

// Remove versões antigas que não pertencem mais ao manifesto.
let removed = 0;
for (const slug of await readdir(OUT_DIR)) {
  for (const file of await readdir(path.join(OUT_DIR, slug))) {
    const match = file.match(/^(.+)-(\d+)\.(avif|webp)$/);
    const id = `${slug}/${match?.[1] ?? file}`;
    const width = Number(match?.[2]);
    if (!manifest[id] || !manifest[id].s.includes(width)) {
      await rm(path.join(OUT_DIR, slug, file));
      removed++;
    }
  }
}
if (removed) console.log(`Removidos ${removed} arquivos não utilizados de public/images.`);
await writeFile(MANIFEST, JSON.stringify(manifest) + "\n");
console.log(`\n✓ ${entries.length} imagens em ${((Date.now() - started) / 1000).toFixed(1)}s → ${path.relative(ROOT, MANIFEST)}`);
