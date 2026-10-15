import { describe, expect, it } from "vitest";
import { projects } from "../../src/content/projects";
import { renderHead, seoForPath, staticRoutes } from "../../src/lib/seo";

describe("SEO", () => {
  it("gera rotas estáticas para a home e todos os projetos", () => {
    expect(staticRoutes()).toEqual(["/", ...projects.map((p) => `/projetos/${p.slug}`)]);
  });

  it("descreve a home com JSON-LD de pessoa", () => {
    const seo = seoForPath("/");
    expect(seo.title).toContain("Alex Soares Lopes");
    expect(seo.jsonLd?.["@type"]).toBe("Person");
    expect(seo.image).toBe("og/home.png");
  });

  it("descreve cada projeto com canonical, imagem OG e código-fonte (quando público)", () => {
    for (const project of projects) {
      const seo = seoForPath(`/projetos/${project.slug}/`);
      expect(seo.title).toContain(project.name);
      expect(seo.path).toBe(`/projetos/${project.slug}/`);
      expect(seo.image).toBe(`og/${project.slug}.png`);
      if (project.links.repo) expect(seo.jsonLd?.codeRepository).toBe(project.links.repo);
      else expect(seo.jsonLd).not.toHaveProperty("codeRepository");
    }
  });

  it("marca rotas inexistentes como noindex", () => {
    const seo = seoForPath("/qualquer-coisa");
    expect(seo.noindex).toBe(true);
    expect(renderHead(seo)).toContain('name="robots" content="noindex"');
  });

  it("escapa aspas e sinais nos metadados", () => {
    const head = renderHead({ ...seoForPath("/"), title: 'A "B" <C>' });
    expect(head).toContain("<title>A &quot;B&quot; &lt;C&gt;</title>");
  });
});
