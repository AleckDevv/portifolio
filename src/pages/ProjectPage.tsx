import type { CSSProperties } from "react";
import { useParams } from "react-router";
import { BrowserFrame, PhoneFrame, ShotView } from "../components/media/Frames";
import { ScrollShot } from "../components/media/ScrollShot";
import { ModuleTabs } from "../components/projects/ModuleTabs";
import { Pipeline } from "../components/projects/Pipeline";
import { FeatureList, ProjectLinks, ProjectMeta, ProjectTitle, TechSheetFull } from "../components/projects/ProjectParts";
import { accentVars, kindLabel, shotAddress } from "../components/projects/project-utils";
import { useTechDialog } from "../components/stack/tech-dialog-context";
import { Icon } from "../components/ui/Icon";
import { Reveal } from "../components/ui/Reveal";
import { getAdjacentProjects, getProject, type Project, type Shot } from "../content/projects";
import { getTech } from "../content/technologies";
import { monthYearLong } from "../lib/format";
import { TransitionLink } from "../lib/transition";
import { useSeo } from "../lib/useSeo";
import { NotFoundPage } from "./NotFoundPage";

/** Luminância relativa (WCAG) para decidir o tom do cabeçalho. */
function isDark(hex: string): boolean {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  }) as [number, number, number];
  return 0.2126 * r + 0.7152 * g + 0.0722 * b < 0.2;
}

function GalleryItem({ project, shot, index }: { project: Project; shot: Shot; index: number }) {
  if (shot.device === "page") {
    const mobile = shot.image.includes("mobile");
    const scroller = (
      <ScrollShot
        id={shot.image}
        alt={shot.alt}
        label={shot.caption}
        aspect={mobile ? "9 / 19" : "4 / 5"}
        sizes={mobile ? "(min-width: 1024px) 22vw, 70vw" : "(min-width: 1024px) 44vw, 100vw"}
      />
    );
    return (
      <figure className={mobile ? "col-span-2 mx-auto w-full max-w-[19rem] lg:col-span-2" : "col-span-2 lg:col-span-3"}>
        {mobile ? <PhoneFrame>{scroller}</PhoneFrame> : <BrowserFrame address={shotAddress(project, shot)}>{scroller}</BrowserFrame>}
        <figcaption className="label mt-3 text-ink-soft">{shot.caption}</figcaption>
      </figure>
    );
  }
  if (shot.device === "mobile") {
    return <ShotView shot={shot} address="" sizes="(min-width: 1024px) 26vw, 46vw" className="col-span-1 lg:col-span-2" />;
  }
  const full = index === 0;
  return (
    <ShotView
      shot={shot}
      address={shotAddress(project, shot)}
      sizes={full ? "(min-width: 1024px) 88vw, 100vw" : "(min-width: 1024px) 44vw, 100vw"}
      priority={full}
      className={full ? "col-span-2 lg:col-span-6" : "col-span-2 lg:col-span-3"}
    />
  );
}

function StackList({ project }: { project: Project }) {
  const { openTech } = useTechDialog();
  return (
    <ul className="grid gap-x-8 sm:grid-cols-2 lg:grid-cols-3">
      {project.stack.map((item) => (
        <li key={item.id} className="border-b border-ink/15">
          <button
            type="button"
            aria-haspopup="dialog"
            onClick={(event) => openTech(item.id, event.currentTarget)}
            className="group flex w-full items-start justify-between gap-4 py-4 text-left"
          >
            <span>
              <span className="semiwide block font-[750] group-hover:underline">{getTech(item.id).name}</span>
              {item.note && <span className="mt-1 block text-sm text-ink-soft">{item.note}</span>}
            </span>
            <Icon name="arrow" className="mt-1 shrink-0 transition-transform group-hover:translate-x-1" />
          </button>
        </li>
      ))}
    </ul>
  );
}

export function ProjectPage() {
  const { slug } = useParams();
  const project = slug ? getProject(slug) : undefined;
  useSeo(project ? `/projetos/${project.slug}` : "/404");
  if (!project) return <NotFoundPage />;

  const { prev, next } = getAdjacentProjects(project.slug);
  const dark = isDark(project.accent.surface);
  const headerStyle = {
    ...accentVars(project),
    "--focus": dark ? "var(--color-acid)" : "var(--color-ink)",
    "--accent-text": project.accent.onSurface,
  } as CSSProperties;

  return (
    <article aria-labelledby={`${project.slug}-title`} style={accentVars(project)}>
      <header
        data-header={dark ? "dark" : "light"}
        data-section="<header#estudo-de-caso>"
        style={headerStyle}
        className="theme-project px-4 pt-28 pb-16 sm:px-8 lg:px-14 lg:pt-36 lg:pb-24"
      >
        <nav aria-label="Trilha de navegação" className="label mb-10 flex flex-wrap items-center gap-2 opacity-90">
          <TransitionLink to="/" label="Início" className="underline-offset-4 hover:underline">
            Início
          </TransitionLink>
          <span aria-hidden="true">/</span>
          <TransitionLink to="/#projetos" label="Projetos" className="underline-offset-4 hover:underline">
            Projetos
          </TransitionLink>
          <span aria-hidden="true">/</span>
          <span aria-current="page">{project.name}</span>
        </nav>
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8">
            <ProjectMeta project={project} />
            <ProjectTitle project={project} as="h1" className="mt-5" />
            <p className="text-lead mt-6 max-w-3xl">{project.tagline}</p>
          </div>
          <dl className="grid grid-cols-2 gap-6 border-t border-current/30 pt-6 lg:col-span-4">
            <div>
              <dt className="label opacity-80">Tipo</dt>
              <dd className="mt-1 font-semibold">{kindLabel(project)}</dd>
            </div>
            <div>
              <dt className="label opacity-80">{project.links.repo ? "Repositório criado" : "Primeiro commit"}</dt>
              <dd className="mt-1 font-semibold">{monthYearLong(project.createdAt)}</dd>
            </div>
            <div className="col-span-2">
              <dt className="label opacity-80">Categoria</dt>
              <dd className="mt-1 font-semibold">{project.category}</dd>
            </div>
          </dl>
        </div>
        <ProjectLinks project={project} showCaseStudy={false} tone={dark ? "dark" : "light"} className="mt-10" />
      </header>

      <section aria-labelledby="visao-geral" data-header="light" data-section="<section#visao-geral>" className="theme-paper px-4 py-20 sm:px-8 lg:px-14 lg:py-28">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <h2 id="visao-geral" className="text-title font-[850] uppercase md:wide">
              Visão geral
            </h2>
            <div className="mt-6 space-y-4 text-lg">
              {project.summary.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
            {project.notes && (
              <aside aria-label="Observações" className="mt-8 space-y-3 border-l-4 border-(--accent) pl-5">
                {project.notes.map((note) => (
                  <p key={note} className="text-sm">
                    {note}
                  </p>
                ))}
              </aside>
            )}
          </div>
          <div className="lg:col-span-6 lg:col-start-7">
            <h2 className="text-title font-[850] uppercase md:wide">Funcionalidades</h2>
            <p className="label mt-2 text-ink-soft">
              {project.links.demo ? "Confirmadas no código e na demonstração" : project.captureAddress ? "Confirmadas no código e na execução local" : "Confirmadas no código-fonte"}
            </p>
            <FeatureList project={project} className="mt-6" />
          </div>
        </div>
      </section>

      {project.modules && (
        <section aria-labelledby="modulos" data-header="light" data-section="<section#modulos>" className="theme-paper border-t border-ink/15 px-4 py-20 sm:px-8 lg:px-14">
          <h2 id="modulos" className="text-title font-[850] uppercase md:wide">
            Os {project.modules.length} módulos
          </h2>
          <p className="mt-3 mb-10 max-w-2xl text-ink-soft">Use as abas (ou as setas do teclado) para ver a tela real de cada módulo.</p>
          <ModuleTabs project={project} idPrefix="page" sizes="(min-width: 1024px) 66vw, 100vw" />
        </section>
      )}

      {project.pipeline && (
        <section
          aria-labelledby="fluxo-ia"
          data-header="dark"
          data-section="<section#fluxo-ia>"
          className="bg-(--accent-surface) px-4 py-20 text-(--accent-on) [--accent-text:#60a5fa] [--focus:var(--color-acid)] sm:px-8 lg:px-14"
        >
          <h2 id="fluxo-ia" className="mb-10 text-title font-[850] uppercase md:wide">
            Onde entra a IA
          </h2>
          <Pipeline steps={project.pipeline} title="Fluxo de geração da ficha de treino, conferido em IaWorkoutService e FichaController" />
        </section>
      )}

      <section aria-labelledby="telas" data-header="light" data-section="<section#telas>" className="theme-paper border-t border-ink/15 px-4 py-20 sm:px-8 lg:px-14 lg:py-28">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <h2 id="telas" className="text-title font-[850] uppercase md:wide">
            Telas
          </h2>
          <p className="label max-w-xl text-ink-soft">{project.imageSource}</p>
        </div>
        <div className="grid grid-cols-2 gap-x-5 gap-y-10 lg:grid-cols-6">
          {project.shots.map((shot, index) => (
            <GalleryItem key={shot.image} project={project} shot={shot} index={index} />
          ))}
        </div>
      </section>

      <section aria-labelledby="tecnologias" data-header="light" data-section="<section#tecnologias>" className="theme-paper border-t border-ink/15 px-4 py-20 sm:px-8 lg:px-14">
        <h2 id="tecnologias" className="text-title font-[850] uppercase md:wide">
          Tecnologias
        </h2>
        <p className="mt-3 mb-8 max-w-2xl text-ink-soft">Abra uma tecnologia para ver a explicação e os outros projetos em que ela aparece.</p>
        <StackList project={project} />
      </section>

      <section aria-labelledby="ficha" data-header="light" data-section="<section#ficha-tecnica>" className="theme-paper border-t border-ink/15 px-4 py-20 sm:px-8 lg:px-14">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <h2 id="ficha" className="text-title font-[850] uppercase md:wide">
              Ficha técnica
            </h2>
            <p className="mt-3 text-ink-soft">Ligue o modo técnico (no topo da página) para ver também como cada informação foi verificada.</p>
          </div>
          <div className="lg:col-span-8">
            <TechSheetFull project={project} />
            <div className="tech-only mt-10 rounded-xl border border-dashed border-cyan bg-ink p-5 text-paper">
              <h3 className="label mb-3 text-cyan">Como foi verificado</h3>
              <ul className="list-disc space-y-1.5 pl-5">
                {project.sheet.verification.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <nav aria-label="Outros projetos" data-header="dark" className="theme-ink grid sm:grid-cols-2">
        {[
          { item: prev, dir: "Anterior", icon: "arrow-left" as const },
          { item: next, dir: "Próximo", icon: "arrow" as const },
        ].map(({ item, dir, icon }) => (
          <Reveal key={dir}>
            <TransitionLink
              to={`/projetos/${item.slug}/`}
              label={item.name}
              className={`group flex h-full flex-col gap-4 px-4 py-14 no-underline transition-colors hover:bg-volt sm:px-8 lg:px-14 ${
                dir === "Próximo" ? "sm:items-end sm:text-right" : "sm:border-r sm:border-paper/20"
              }`}
            >
              <span className="label flex items-center gap-2 text-paper/80">
                {dir === "Anterior" && <Icon name={icon} />}
                {dir} · {item.number}
                {dir === "Próximo" && <Icon name={icon} />}
              </span>
              <span className="wide text-[clamp(1.8rem,4vw,3.6rem)] leading-[0.95] font-[850] uppercase">{item.name}</span>
            </TransitionLink>
          </Reveal>
        ))}
      </nav>
    </article>
  );
}
