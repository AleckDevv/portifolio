// Configuração geral do site (SEO, URLs absolutas e Open Graph).
//
// VITE_SITE_URL define o endereço público usado em links canônicos, sitemap e
// Open Graph. Exemplo: VITE_SITE_URL=https://aleckdevv.github.io npm run build

const fallbackUrl = "https://aleckdevv.github.io";

export const site = {
  url: (import.meta.env.VITE_SITE_URL || fallbackUrl).replace(/\/+$/, ""),
  title: "AleckDevv — Alex Soares Lopes, desenvolvedor full stack",
  shortTitle: "AleckDevv",
  description:
    "Portfólio de Alex Soares Lopes (AleckDevv), desenvolvedor full stack em Teresina–PI. Sistemas de gestão, interfaces web e APIs com Java, Spring Boot, React e SQL.",
  language: "pt-BR",
  locale: "pt_BR",
  themeColor: "#1e3dff",
} as const;

/** Caminho base da aplicação (ex.: "/" ou "/portfolio"), sem barra final. */
export const basePath = import.meta.env.BASE_URL.replace(/\/+$/, "");

/** Monta a URL de um arquivo de public/ respeitando o caminho base. */
export function asset(path: string): string {
  return `${basePath}/${path.replace(/^\/+/, "")}`;
}

/** URL absoluta (para canonical, Open Graph e sitemap). */
export function absoluteUrl(path: string): string {
  return `${site.url}${basePath}${path === "/" ? "/" : path}`;
}
