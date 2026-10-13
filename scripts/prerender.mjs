// Gera o HTML estático de cada rota a partir do build SSR (dist-ssr/).
//
// Executado automaticamente por "npm run build". Resultado em dist/:
//   index.html, projetos/<slug>/index.html, 404.html, sitemap.xml, robots.txt
// Cada página já sai com título, descrição, canonical, Open Graph e JSON-LD,
// e funciona em qualquer hospedagem estática (Vercel, Netlify, GitHub Pages).

import { mkdir, readdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DIST = path.join(ROOT, "dist");
const SSR_DIR = path.join(ROOT, "dist-ssr");
const BASE = (process.env.BASE_PATH ?? "/").replace(/\/?$/, "/");

const template = await readFile(path.join(DIST, "index.html"), "utf8");
const server = await import(pathToFileURL(path.join(SSR_DIR, "entry-server.js")).href);

// Pré-carrega a fonte principal (subconjunto latino da Mona Sans com eixo de largura).
const assets = await readdir(path.join(DIST, "assets"));
const font = assets.find((file) => /^mona-sans-latin-wdth-normal-.*\.woff2$/.test(file));
const preload = font ? `<link rel="preload" href="${BASE}assets/${font}" as="font" type="font/woff2" crossorigin />` : "";
if (!font) console.warn("! Fonte principal não encontrada em dist/assets (sem preload).");

if (!template.includes("<!--app-html-->") || !/<!--app-head-->[\s\S]*?<!--\/app-head-->/.test(template)) {
  throw new Error("Marcadores <!--app-head--> / <!--app-html--> não encontrados em dist/index.html.");
}

const routes = [...server.staticRoutes(), "/404"];
for (const route of routes) {
  const { html, head } = server.render(route);
  const page = template
    .replace(/<!--app-head-->[\s\S]*?<!--\/app-head-->/, `${head}\n    ${preload}`)
    .replace("<!--app-html-->", html);
  const file =
    route === "/" ? "index.html" : route === "/404" ? "404.html" : path.join(...route.slice(1).split("/"), "index.html");
  const target = path.join(DIST, file);
  await mkdir(path.dirname(target), { recursive: true });
  await writeFile(target, page);
  console.log(`  ✓ ${route.padEnd(24)} → dist/${file.replaceAll("\\", "/")} (${(page.length / 1024).toFixed(0)} KB)`);
}

// sitemap.xml e robots.txt
const today = new Date().toISOString().slice(0, 10);
const urls = server
  .staticRoutes()
  .map((route) => server.absoluteUrl(route === "/" ? "/" : `${route}/`))
  .map((loc) => `  <url><loc>${loc}</loc><lastmod>${today}</lastmod></url>`)
  .join("\n");
await writeFile(
  path.join(DIST, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
);
await writeFile(path.join(DIST, "robots.txt"), `User-agent: *\nAllow: /\n\nSitemap: ${server.absoluteUrl("/sitemap.xml")}\n`);
console.log(`  ✓ sitemap.xml e robots.txt (site: ${server.site.url})`);
if (!process.env.VITE_SITE_URL && !process.env.VERCEL_PROJECT_PRODUCTION_URL) {
  console.warn(`! VITE_SITE_URL não definida: usando ${server.site.url} nas URLs absolutas. Veja o README.`);
}

await rm(SSR_DIR, { recursive: true, force: true });
