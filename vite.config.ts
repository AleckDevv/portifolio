import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// O endereço público do site fica em src/content/site.ts (PRODUCTION_URL).
// Para sobrescrever num build específico, defina VITE_SITE_URL.

// BASE_PATH permite publicar em um subcaminho (ex.: GitHub Pages de projeto: "/portifolio/").
// Para domínio próprio, Vercel, Netlify ou o repositório AleckDevv.github.io, deixe "/".
export default defineConfig({
  base: process.env.BASE_PATH ?? "/",
  plugins: [react(), tailwindcss()],
  build: {
    target: "es2022",
  },
});
