import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// Na Vercel, a URL pública (canonical, sitemap e Open Graph) vem do domínio de
// produção do projeto, informado pela própria Vercel durante o build.
// VITE_SITE_URL definida manualmente sempre tem prioridade.
if (!process.env.VITE_SITE_URL && process.env.VERCEL_PROJECT_PRODUCTION_URL) {
  process.env.VITE_SITE_URL = `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
}

// BASE_PATH permite publicar em um subcaminho (ex.: GitHub Pages de projeto: "/portfolio/").
// Para domínio próprio, Vercel, Netlify ou o repositório AleckDevv.github.io, deixe "/".
export default defineConfig({
  base: process.env.BASE_PATH ?? "/",
  plugins: [react(), tailwindcss()],
  build: {
    target: "es2022",
  },
});
