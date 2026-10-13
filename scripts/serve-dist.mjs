// Servidor estático sem dependências para testar o build (dist/) como em produção.
//
// Reproduz o comportamento da Vercel descrito em vercel.json:
//   • cabeçalhos (CSP, segurança e cache) por padrão de caminho;
//   • trailingSlash: /rota → 308 → /rota/ (exceto arquivos);
//   • /rota/ → /rota/index.html e rotas inexistentes → 404.html (status 404).
//
// Uso: npm run preview            (http://localhost:4173)
//      npm run preview -- 5000    (outra porta)

import { createReadStream, readFileSync } from "node:fs";
import { stat } from "node:fs/promises";
import { createServer } from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DIST = path.join(ROOT_DIR, "dist");
const PORT = Number(process.argv[2] ?? process.env.PORT ?? 4173);
const BASE = (process.env.BASE_PATH ?? "/").replace(/\/?$/, "/");

const vercel = JSON.parse(readFileSync(path.join(ROOT_DIR, "vercel.json"), "utf8"));
// Converte os padrões da Vercel ("/assets/(.*)") em expressões regulares.
const escapeRegex = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const headerRules = (vercel.headers ?? []).map((rule) => ({
  test: new RegExp(`^${rule.source.split("(.*)").map(escapeRegex).join("(.*)")}$`),
  headers: rule.headers,
}));

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".webmanifest": "application/manifest+json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".woff2": "font/woff2",
  ".xml": "application/xml; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
};

async function resolveFile(urlPath) {
  const clean = path.normalize(decodeURIComponent(urlPath)).replace(/^([/\\])+/, "");
  const candidate = path.join(DIST, clean);
  if (!candidate.startsWith(DIST)) return null;
  for (const option of [candidate, path.join(candidate, "index.html")]) {
    try {
      if ((await stat(option)).isFile()) return option;
    } catch {
      // tenta a próxima opção
    }
  }
  return null;
}

createServer(async (req, res) => {
  const url = new URL(req.url ?? "/", "http://localhost");
  if (!url.pathname.startsWith(BASE) && url.pathname !== BASE.slice(0, -1)) {
    res.writeHead(404).end("Fora do caminho base");
    return;
  }
  const pathname = url.pathname.slice(BASE.length - 1);

  // trailingSlash da Vercel: caminhos sem extensão ganham barra final.
  if (vercel.trailingSlash && !pathname.endsWith("/") && !path.extname(pathname)) {
    res.writeHead(308, { Location: `${url.pathname}/${url.search}` }).end();
    return;
  }

  const file = await resolveFile(pathname);
  const target = file ?? path.join(DIST, "404.html");
  const headers = { "Content-Type": TYPES[path.extname(target)] ?? "application/octet-stream" };
  for (const rule of headerRules) {
    if (rule.test.test(pathname)) for (const { key, value } of rule.headers) headers[key] = value;
  }
  res.writeHead(file ? 200 : 404, headers);
  createReadStream(target).pipe(res);
}).listen(PORT, "127.0.0.1", () => {
  console.log(`Servindo dist/ em http://localhost:${PORT}${BASE} (cabeçalhos de vercel.json aplicados)`);
});
