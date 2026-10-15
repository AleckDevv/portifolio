import { getProject, type ProjectSlug } from "../../content/projects";
import { shortDate } from "../../lib/format";
import { TransitionLink } from "../../lib/transition";
import { Reveal } from "../ui/Reveal";
import { SectionHeading } from "../ui/SectionHeading";

// Linha do tempo pelas datas de criação dos repositórios (API do GitHub; no
// repositório privado do Sistema Pilates, a data do primeiro commit).
const YEARS: Array<{ year: string; title: string; text: string; projects: ProjectSlug[] }> = [
  {
    year: "2024",
    title: "Fundamentos",
    text: "HTML e CSS na prática: landing pages e estudos de layout a partir de referências, publicados no GitHub Pages.",
    projects: ["agencia", "medcenter", "b7burger", "starbucks"],
  },
  {
    year: "2025",
    title: "Responsividade e back-end",
    text: "Media queries e JavaScript no CyborgGames. Depois, o primeiro sistema full stack: API em Java com Spring Boot, MySQL, React, Docker e integração com IA.",
    projects: ["cyborg", "iaworkout"],
  },
  {
    year: "2026",
    title: "Sistemas completos",
    text: "React com Tailwind e Framer Motion; um sistema para estúdio de Pilates em TypeScript, com API em Fastify, Prisma e PIX; controle de estoque com exportação e backup; e um sistema de gestão de frota com 10 módulos integrados.",
    projects: ["fotos", "pilates", "conveniencia", "vieira"],
  },
];

export function Evolution() {
  return (
    <section
      id="evolucao"
      aria-labelledby="evolucao-titulo"
      data-section="<section#evolucao>"
      data-header="dark"
      className="theme-ink px-4 py-24 sm:px-8 lg:px-14 lg:py-32"
    >
      <SectionHeading id="evolucao-titulo" label="// 02 — linha do tempo" title="Evolução">
        <p className="text-lead text-paper/85 lg:col-span-6 lg:col-start-7">
          Dois anos de commits: das primeiras páginas estáticas a sistemas com regras de negócio, banco de dados e integrações.
        </p>
      </SectionHeading>

      <ol className="mt-16 grid gap-12 md:grid-cols-3 md:gap-8">
        {YEARS.map((item, index) => (
          <Reveal as="li" key={item.year} delay={index * 140} className="border-t-2 border-paper/30 pt-6">
            <p aria-hidden="true" className="wide text-outline text-[clamp(4rem,9vw,8.5rem)] leading-none font-[850] text-acid [--outline-fill:var(--color-ink)]">
              {item.year}
            </p>
            <h3 className="semiwide mt-4 text-2xl font-[750]">
              <span className="sr-only">{item.year}: </span>
              {item.title}
            </h3>
            <p className="mt-3 text-paper/85">{item.text}</p>
            <ul className="mt-6 space-y-2">
              {item.projects.map((slug) => {
                const project = getProject(slug)!;
                return (
                  <li key={slug}>
                    <TransitionLink
                      to={`/projetos/${slug}/`}
                      label={project.name}
                      className="group flex items-baseline gap-3 rounded-lg border border-paper/20 px-3 py-2 no-underline transition-colors hover:border-acid hover:bg-acid hover:text-ink"
                    >
                      <span className="label text-cyan group-hover:text-ink">{project.number}</span>
                      <span className="font-semibold">{project.name}</span>
                      <span className="label ml-auto text-paper/70 group-hover:text-ink">{shortDate(project.createdAt)}</span>
                    </TransitionLink>
                  </li>
                );
              })}
            </ul>
          </Reveal>
        ))}
      </ol>
    </section>
  );
}
