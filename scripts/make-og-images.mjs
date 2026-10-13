// Gera ícones (PNG + manifest) e imagens Open Graph (1200×630) do portfólio.
//
// Uso: npm run og
//
// As imagens OG usam as mesmas fontes do site e a capa real de cada projeto.
// Saída: public/og/home.png, public/og/<slug>.png, public/favicon-32.png,
//        public/apple-touch-icon.png, public/icon-192.png, public/icon-512.png,
//        public/site.webmanifest

import { chromium } from "@playwright/test";
import sharp from "sharp";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { profile } from "../src/content/profile.ts";
import { projects } from "../src/content/projects.ts";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const PUBLIC = path.join(ROOT, "public");
const OG_DIR = path.join(PUBLIC, "og");

// ---------------------------------------------------------------- ícones
const svg = await readFile(path.join(PUBLIC, "favicon.svg"));
for (const [file, size] of [
  ["favicon-32.png", 32],
  ["apple-touch-icon.png", 180],
  ["icon-192.png", 192],
  ["icon-512.png", 512],
]) {
  await sharp(svg, { density: 384 }).resize(size, size).png().toFile(path.join(PUBLIC, file));
}
await writeFile(
  path.join(PUBLIC, "site.webmanifest"),
  JSON.stringify(
    {
      name: `${profile.handle} — ${profile.name}`,
      short_name: profile.handle,
      description: "Portfólio de desenvolvedor full stack.",
      lang: "pt-BR",
      start_url: ".",
      display: "standalone",
      background_color: "#f3f2ed",
      theme_color: "#1e3dff",
      icons: [
        { src: "icon-192.png", sizes: "192x192", type: "image/png" },
        { src: "icon-512.png", sizes: "512x512", type: "image/png" },
      ],
    },
    null,
    2,
  ) + "\n",
);
console.log("✓ ícones e site.webmanifest");

// ---------------------------------------------------------------- OG
const fontDir = path.join(ROOT, "node_modules", "@fontsource-variable");
const toData = async (file, type) => `data:${type};base64,${(await readFile(file)).toString("base64")}`;
const mona = await toData(path.join(fontDir, "mona-sans", "files", "mona-sans-latin-wdth-normal.woff2"), "font/woff2");
const martian = await toData(path.join(fontDir, "martian-mono", "files", "martian-mono-latin-wdth-normal.woff2"), "font/woff2");

const base = `
  @font-face { font-family: Mona; src: url(${mona}) format("woff2"); font-weight: 200 900; font-stretch: 75% 125%; }
  @font-face { font-family: Martian; src: url(${martian}) format("woff2"); font-weight: 100 800; font-stretch: 75% 112.5%; }
  * { box-sizing: border-box; margin: 0; }
  body { width: 1200px; height: 630px; overflow: hidden; font-family: Mona, sans-serif; position: relative; }
  .label { font-family: Martian, monospace; font-size: 17px; letter-spacing: .04em; text-transform: uppercase; font-stretch: 87.5%; }
`;

function homeHtml() {
  return `<!doctype html><html><head><style>${base}
    body { background: #1e3dff; color: #fff; padding: 56px 64px; }
    .title { margin-top: 36px; font-size: 112px; line-height: .86; font-weight: 850; font-stretch: 125%; text-transform: uppercase; }
    .title span { display: block; }
    .strike { position: relative; display: inline-block !important; }
    .strike::after { content: ""; position: absolute; left: -4px; right: -4px; top: 46%; height: 10px; background: #ff5b14; }
    .outline { -webkit-text-fill-color: #1e3dff; -webkit-text-stroke: 6px #fff; paint-order: stroke fill; text-align: right; }
    .acid { color: #e3ff3b; }
    .right { text-align: right; }
    .foot { position: absolute; left: 64px; bottom: 50px; display: flex; gap: 18px; align-items: center; }
    .dot { width: 54px; height: 54px; border-radius: 50%; background: #ff5b14; }
    .sq { width: 18px; height: 18px; background: #e3ff3b; }
  </style></head><body>
    <div class="label">${profile.name} / ${profile.handle} · ${profile.role} · ${profile.location}</div>
    <div class="title">
      <span><span class="strike">Problemas</span></span>
      <span class="outline">entram.</span>
      <span class="acid">Software</span>
      <span class="right">sai.</span>
    </div>
    <div class="foot"><div class="dot"></div><div class="sq"></div><div class="label">${projects.length} projetos · Java · Spring Boot · React · SQL</div></div>
  </body></html>`;
}

async function projectHtml(project) {
  const cover = project.shots[0].image;
  const image = await toData(path.join(PUBLIC, "images", `${cover}-1280.webp`), "image/webp");
  const { surface, onSurface, color, ink } = project.accent;
  // Tamanho pela palavra mais longa, para o título nunca invadir a captura.
  const longest = Math.max(...project.name.split(/s+/).map((word) => word.length));
  const titleSize = Math.min(84, Math.floor(520 / (longest * 0.74)));
  return `<!doctype html><html><head><style>${base}
    body { background: ${surface}; color: ${onSurface}; padding: 56px 64px; }
    .num { display: inline-block; padding: 4px 12px; border-radius: 99px; background: ${color}; color: ${ink}; font-weight: 700; }
    .title { margin-top: 26px; width: 560px; font-size: ${titleSize}px; line-height: .92; font-weight: 850; font-stretch: 112.5%; text-transform: uppercase; }
    .cat { margin-top: 22px; width: 520px; opacity: .85; line-height: 1.5; }
    .sign { position: absolute; left: 64px; bottom: 50px; display: flex; gap: 14px; align-items: center; font-weight: 800; font-size: 26px; font-stretch: 112.5%; }
    .sign i { width: 18px; height: 18px; background: #ff5b14; display: block; }
    .shot { position: absolute; right: -150px; top: 80px; width: 640px; border: 3px solid #0b1026; border-radius: 16px; overflow: hidden; transform: rotate(-4deg); background: #fff; }
    .bar { height: 30px; background: #f3f2ed; border-bottom: 3px solid #0b1026; display: flex; gap: 8px; align-items: center; padding: 0 12px; }
    .bar b { width: 11px; height: 11px; border-radius: 50%; border: 2px solid #0b1026; display: block; }
    .shot img { display: block; width: 100%; }
  </style></head><body>
    <div class="label"><span class="num">${project.number}</span>&nbsp; Projeto ${project.number} / ${String(projects.length).padStart(2, "0")}</div>
    <div class="title">${project.name}</div>
    <div class="label cat">${project.category}</div>
    <div class="sign"><i></i>${profile.handle}</div>
    <div class="shot"><div class="bar"><b></b><b></b><b></b></div><img src="${image}" /></div>
  </body></html>`;
}

await mkdir(OG_DIR, { recursive: true });
const browser = await chromium.launch({ channel: "chrome" });
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
const render = async (html, file) => {
  await page.setContent(html, { waitUntil: "load" });
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: path.join(OG_DIR, file) });
  console.log(`✓ og/${file}`);
};
await render(homeHtml(), "home.png");
for (const project of projects) await render(await projectHtml(project), `${project.slug}.png`);
await browser.close();
