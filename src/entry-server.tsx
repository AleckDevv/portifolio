// Entrada usada só no build (scripts/prerender.mjs) para gerar o HTML estático
// de cada rota, com os metadados de SEO/Open Graph já no <head>.
import { StrictMode } from "react";
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router";
import { App } from "./App";
import { absoluteUrl, basePath, site } from "./content/site";
import { renderHead, seoForPath, staticRoutes } from "./lib/seo";

export function render(path: string): { html: string; head: string } {
  const html = renderToString(
    <StrictMode>
      <StaticRouter location={`${basePath}${path}`} basename={basePath || "/"}>
        <App />
      </StaticRouter>
    </StrictMode>,
  );
  return { html, head: renderHead(seoForPath(path)) };
}

export { absoluteUrl, site, staticRoutes };
