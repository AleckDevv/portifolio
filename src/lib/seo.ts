import { profile } from "../content/profile";
import { getProject, projects } from "../content/projects";
import { absoluteUrl, site } from "../content/site";
import { technologies } from "../content/technologies";

export interface Seo {
  title: string;
  description: string;
  /** Caminho da rota (sem o caminho base). */
  path: string;
  /** Caminho da imagem Open Graph dentro de public/. */
  image: string;
  imageAlt: string;
  type: "website" | "article";
  noindex?: boolean;
  jsonLd?: Record<string, unknown>;
}

const person = {
  "@type": "Person",
  name: profile.name,
  alternateName: profile.handle,
  jobTitle: profile.role,
  address: { "@type": "PostalAddress", addressLocality: "Teresina", addressRegion: "PI", addressCountry: "BR" },
  sameAs: [profile.contact.github, profile.contact.linkedin],
};

export function seoForPath(pathname: string): Seo {
  const path = pathname.replace(/\/+$/, "") || "/";

  if (path === "/") {
    return {
      title: site.title,
      description: site.description,
      path: "/",
      image: "og/home.png",
      imageAlt: "AleckDevv — Problemas entram. Software sai.",
      type: "website",
      jsonLd: {
        "@context": "https://schema.org",
        ...person,
        url: absoluteUrl("/"),
        knowsAbout: Object.values(technologies)
          .filter((t) => t.status === "pratica")
          .map((t) => t.name),
      },
    };
  }

  const match = /^\/projetos\/([a-z0-9-]+)$/.exec(path);
  const project = match ? getProject(match[1]!) : undefined;
  if (project) {
    return {
      title: `${project.name} — ${project.category} | AleckDevv`,
      description: project.tagline,
      // Barra final: é o endereço servido pelos hosts estáticos (pasta/index.html).
      path: `/projetos/${project.slug}/`,
      image: `og/${project.slug}.png`,
      imageAlt: `${project.number} — ${project.name}`,
      type: "article",
      jsonLd: {
        "@context": "https://schema.org",
        "@type": "SoftwareSourceCode",
        name: project.name,
        description: project.tagline,
        url: absoluteUrl(`/projetos/${project.slug}/`),
        codeRepository: project.links.repo,
        programmingLanguage: project.sheet.languages,
        dateCreated: project.createdAt,
        author: { ...person, url: absoluteUrl("/") },
      },
    };
  }

  return {
    title: "Página não encontrada | AleckDevv",
    description: "Esta rota não existe. Volte ao início ou veja os projetos de Alex Soares Lopes.",
    path,
    image: "og/home.png",
    imageAlt: "AleckDevv",
    type: "website",
    noindex: true,
  };
}

/** Rotas pré-renderizadas no build. */
export function staticRoutes(): string[] {
  return ["/", ...projects.map((p) => `/projetos/${p.slug}`)];
}

function escapeHtml(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

/** Tags do <head> para a pré-renderização. */
export function renderHead(seo: Seo): string {
  const url = absoluteUrl(seo.path);
  const image = absoluteUrl(`/${seo.image}`);
  const tags = [
    `<title>${escapeHtml(seo.title)}</title>`,
    `<meta name="description" content="${escapeHtml(seo.description)}" />`,
    seo.noindex ? `<meta name="robots" content="noindex" />` : `<link rel="canonical" href="${url}" />`,
    `<meta property="og:type" content="${seo.type}" />`,
    `<meta property="og:site_name" content="${escapeHtml(site.shortTitle)}" />`,
    `<meta property="og:locale" content="${site.locale}" />`,
    `<meta property="og:title" content="${escapeHtml(seo.title)}" />`,
    `<meta property="og:description" content="${escapeHtml(seo.description)}" />`,
    `<meta property="og:url" content="${url}" />`,
    `<meta property="og:image" content="${image}" />`,
    `<meta property="og:image:width" content="1200" />`,
    `<meta property="og:image:height" content="630" />`,
    `<meta property="og:image:alt" content="${escapeHtml(seo.imageAlt)}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${escapeHtml(seo.title)}" />`,
    `<meta name="twitter:description" content="${escapeHtml(seo.description)}" />`,
    `<meta name="twitter:image" content="${image}" />`,
  ];
  if (seo.jsonLd) {
    const json = JSON.stringify(seo.jsonLd).replace(/</g, "\\u003c");
    tags.push(`<script type="application/ld+json">${json}</script>`);
  }
  return tags.join("\n    ");
}

/** Atualiza o <head> no navegador ao trocar de rota. */
export function applySeo(seo: Seo) {
  document.title = seo.title;
  const set = (selector: string, attr: string, value: string) => {
    const element = document.head.querySelector(selector);
    if (element) element.setAttribute(attr, value);
  };
  const url = absoluteUrl(seo.path);
  set('meta[name="description"]', "content", seo.description);
  set('link[rel="canonical"]', "href", url);
  set('meta[property="og:title"]', "content", seo.title);
  set('meta[property="og:description"]', "content", seo.description);
  set('meta[property="og:url"]', "content", url);
  set('meta[property="og:image"]', "content", absoluteUrl(`/${seo.image}`));
  set('meta[name="twitter:title"]', "content", seo.title);
  set('meta[name="twitter:description"]', "content", seo.description);
}
