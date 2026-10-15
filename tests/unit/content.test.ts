import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { getImage } from "../../src/content/images";
import { profile } from "../../src/content/profile";
import { projects, projectsUsing } from "../../src/content/projects";
import { technologies, type TechId } from "../../src/content/technologies";

const ROOT = path.resolve(__dirname, "../..");

// Os 9 repositórios públicos exigidos no briefing — nenhum pode faltar.
// O Sistema Pilates, adicionado depois, tem repositório privado (sem link).
const PRIVATE_REPO_PROJECTS = ["pilates"];
const REQUIRED_REPOS = [
  "https://github.com/AleckDevv/sistema_prototipo_vieira",
  "https://github.com/AleckDevv/convenienciaTHR",
  "https://github.com/AleckDevv/Fotos",
  "https://github.com/AleckDevv/IaWorkout",
  "https://github.com/AleckDevv/projeto-CyborgGames",
  "https://github.com/AleckDevv/AleckDevv-projeto-starbucks.github.io",
  "https://github.com/AleckDevv/AleckDevv-projeto-b7-burger.github.io",
  "https://github.com/AleckDevv/AleckDevv-projeto-agencia.github.io",
  "https://github.com/AleckDevv/AleckDevv-projeto-medcenter.github.io",
];

// Demonstrações verificadas (HTTP 200 e registros de deploy do GitHub) em 13/10/2026.
const VERIFIED_DEMOS: Record<string, string | undefined> = {
  vieira: "https://sistemaprototipovieira.vercel.app/",
  conveniencia: "https://conveniencia-zeta.vercel.app/",
  pilates: undefined,
  fotos: "https://fotosrestaurar.vercel.app/",
  iaworkout: undefined,
  cyborg: "https://aleckdevv.github.io/projeto-CyborgGames/",
  starbucks: "https://aleckdevv.github.io/AleckDevv-projeto-starbucks.github.io/",
  b7burger: "https://aleckdevv.github.io/AleckDevv-projeto-b7-burger.github.io/",
  agencia: "https://aleckdevv.github.io/AleckDevv-projeto-agencia.github.io/",
  medcenter: "https://aleckdevv.github.io/AleckDevv-projeto-medcenter.github.io/",
};

/** Contraste WCAG entre duas cores hexadecimais. */
function contrast(a: string, b: string): number {
  const luminance = (hex: string) => {
    const [r, g, bl] = [1, 3, 5].map((i) => {
      const c = parseInt(hex.slice(i, i + 2), 16) / 255;
      return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
    }) as [number, number, number];
    return 0.2126 * r + 0.7152 * g + 0.0722 * bl;
  };
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x) as [number, number];
  return (hi + 0.05) / (lo + 0.05);
}

describe("projetos", () => {
  it("contém os 9 repositórios públicos exigidos e o projeto de repositório privado, sem duplicatas", () => {
    expect(projects).toHaveLength(10);
    expect(projects.flatMap((p) => (p.links.repo ? [p.links.repo] : [])).sort()).toEqual([...REQUIRED_REPOS].sort());
    expect(projects.filter((p) => !p.links.repo).map((p) => p.slug)).toEqual(PRIVATE_REPO_PROJECTS);
    expect(new Set(projects.map((p) => p.slug)).size).toBe(10);
  });

  it("numera os projetos de 01 a 10, do mais recente ao mais antigo", () => {
    expect(projects.map((p) => p.number)).toEqual(["01", "02", "03", "04", "05", "06", "07", "08", "09", "10"]);
    const dates = projects.map((p) => p.createdAt);
    expect(dates).toEqual([...dates].sort().reverse());
  });

  it("usa somente as demonstrações verificadas (sem URLs inventadas)", () => {
    for (const project of projects) {
      expect(project.links.demo?.url, project.slug).toBe(VERIFIED_DEMOS[project.slug]);
    }
  });

  it("tem conteúdo completo em cada projeto", () => {
    for (const project of projects) {
      if (project.links.repo) expect(project.repoName, project.slug).toBe(project.links.repo.split("/").pop());
      else expect(project.links.privateRepo?.length, project.slug).toBeGreaterThan(10);
      expect(project.summary.length, project.slug).toBeGreaterThan(0);
      expect(project.features.length, project.slug).toBeGreaterThanOrEqual(4);
      expect(project.stack.length, project.slug).toBeGreaterThanOrEqual(3);
      expect(project.shots.length, project.slug).toBeGreaterThan(0);
      expect(project.imageSource.length, project.slug).toBeGreaterThan(10);
      expect(project.createdAt, project.slug).toMatch(/^20\d\d-\d\d-\d\d$/);
    }
  });

  it("referencia imagens que existem em disco (AVIF e WebP) com texto alternativo", () => {
    for (const project of projects) {
      const shots = [...project.shots, ...(project.modules ?? []).map((m) => m.shot)];
      for (const shot of shots) {
        expect(shot.alt.length, shot.image).toBeGreaterThan(15);
        expect(shot.caption.length, shot.image).toBeGreaterThan(3);
        const image = getImage(shot.image);
        for (const [, file] of [...image.avif, ...image.webp]) {
          const full = path.join(ROOT, "public", file);
          expect(existsSync(full), file).toBe(true);
          expect(statSync(full).size, file).toBeGreaterThan(1000);
        }
        // Planta usada na animação de renderização (páginas inteiras rolam e não usam o efeito).
        if (!shot.image.endsWith("-full")) {
          expect(image.edges, shot.image).not.toBeNull();
          const edges = path.join(ROOT, "public", image.edges!);
          expect(existsSync(edges), shot.image).toBe(true);
          // Uma planta vazia (só transparência) tem ~1,5 KB; com contornos, bem mais.
          expect(statSync(edges).size, `${shot.image}: planta vazia`).toBeGreaterThan(4000);
        }
      }
    }
    // As capas também têm a planta pequena, usada nas cartas da abertura.
    for (const project of projects) {
      const cover = getImage(project.shots[0]!.image);
      expect(cover.edgesSmall, project.slug).not.toBeNull();
      expect(statSync(path.join(ROOT, "public", cover.edgesSmall!)).size, project.slug).toBeGreaterThan(2500);
    }
  });

  it("usa cores de identidade com contraste mínimo de 4,5:1 para texto", () => {
    for (const { slug, accent } of projects) {
      expect(contrast(accent.ink, accent.color), `${slug}: ink sobre color`).toBeGreaterThanOrEqual(4.5);
      expect(contrast(accent.onSurface, accent.surface), `${slug}: texto sobre surface`).toBeGreaterThanOrEqual(4.5);
      expect(contrast(accent.text, "#f3f2ed"), `${slug}: destaque sobre papel`).toBeGreaterThanOrEqual(4.5);
    }
  });

  it("não atribui recursos inexistentes aos projetos estáticos", () => {
    const b7 = projects.find((p) => p.slug === "b7burger")!;
    const med = projects.find((p) => p.slug === "medcenter")!;
    const text = (p: typeof b7) => [p.tagline, ...p.summary, ...p.features].join(" ").toLowerCase();
    expect(text(b7)).toContain("não há sistema de pedidos");
    expect(text(med)).toContain("não há agendamento");
    expect(text(med)).not.toMatch(/responsiv/);
  });

  it("deixa claro que as capturas do projeto privado usam dados fictícios e execução local", () => {
    for (const project of projects.filter((p) => !p.links.repo)) {
      expect(project.links.demo, project.slug).toBeUndefined();
      expect(project.imageSource, project.slug).toMatch(/dados fictícios/);
      expect(project.captureAddress, project.slug).toMatch(/execução local/);
    }
  });
});

describe("tecnologias", () => {
  it("não usa níveis, porcentagens ou medidores", () => {
    for (const [id, tech] of Object.entries(technologies)) {
      expect(Object.keys(tech).sort(), id).toEqual(["category", "description", "name", "status", "symbol"]);
      expect(tech.description, id).not.toMatch(/\d+\s*%/);
    }
  });

  it("marca como prática só o que aparece em projetos e como estudo o que não aparece", () => {
    for (const [id, tech] of Object.entries(technologies)) {
      const used = projectsUsing(id as TechId).length;
      if (tech.status === "pratica") expect(used, id).toBeGreaterThan(0);
      else expect(used, id).toBe(0);
    }
  });

  it("todos os projetos usam tecnologias cadastradas", () => {
    for (const project of projects) {
      for (const item of project.stack) expect(item.id in technologies, `${project.slug}: ${item.id}`).toBe(true);
    }
  });
});

describe("perfil", () => {
  it("tem contatos válidos", () => {
    expect(profile.contact.email).toMatch(/^[^@\s]+@[^@\s]+\.[a-z]{2,}$/);
    expect(profile.contact.github).toBe("https://github.com/AleckDevv");
    expect(profile.contact.linkedin).toMatch(/^https:\/\/www\.linkedin\.com\/in\//);
    expect(profile.headline.map((l) => l.text).join(" ")).toBe("Problemas entram. Software sai.");
  });
});

describe("código-fonte", () => {
  const files: string[] = [];
  const walk = (dir: string) => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (/\.(tsx?|css)$/.test(entry.name)) files.push(full);
    }
  };
  walk(path.join(ROOT, "src"));

  it("não contém barras de progresso nem medidores", () => {
    for (const file of files) {
      const source = readFileSync(file, "utf8");
      expect(source, file).not.toMatch(/<progress|<meter|role=["']progressbar|aria-valuenow|aria-valuemax/);
      expect(source, file).not.toMatch(/(skill|nivel|level)[\w-]*\s*[:=]\s*\d/i);
    }
  });
});
