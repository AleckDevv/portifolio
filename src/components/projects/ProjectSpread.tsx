import { useRef, type CSSProperties, type ReactNode } from "react";
import type { ImageId } from "../../content/images";
import type { Project, Shot } from "../../content/projects";
import { usePrefs } from "../../lib/prefs-store";
import { useParallax } from "../../lib/useParallax";
import { BrowserFrame, HudFrame, PhoneFrame, ShotView } from "../media/Frames";
import { RenderShot } from "../media/RenderShot";
import { ScrollShot } from "../media/ScrollShot";
import { Icon } from "../ui/Icon";
import { Reveal } from "../ui/Reveal";
import { ModuleTabs } from "./ModuleTabs";
import { Pipeline } from "./Pipeline";
import { FeatureList, ProjectLinks, ProjectMeta, ProjectTitle, TechChips, TechSheetCompact } from "./ProjectParts";
import { accentVars, shotAddress } from "./project-utils";

// Cada projeto tem uma composição própria (definida em projects.ts → layout),
// mas todas compartilham a mesma tipografia, grade e peças de informação.

function shot(project: Project, image: ImageId): Shot {
  const found = project.shots.find((s) => s.image === image);
  if (!found) throw new Error(`Imagem ${image} não está na galeria de ${project.slug}.`);
  return found;
}

interface ShellProps {
  project: Project;
  children: ReactNode;
  /** Fundo da seção: papel (padrão) ou a superfície do projeto. */
  surface?: boolean;
  dark?: boolean;
}

function Shell({ project, children, surface = false, dark = false }: ShellProps) {
  const style = {
    ...accentVars(project),
    ...(surface ? { "--focus": dark ? "var(--color-acid)" : "var(--color-ink)" } : {}),
    // Em superfícies escuras, a cor-assinatura original já é legível como texto.
    ...(surface && dark ? { "--accent-text": "var(--accent)" } : {}),
  } as CSSProperties;
  return (
    <article
      id={project.slug}
      aria-labelledby={`${project.slug}-title`}
      data-section={`<article#${project.slug}>`}
      data-header={dark ? "dark" : "light"}
      style={style}
      className={`relative overflow-hidden px-4 py-20 sm:px-8 lg:px-14 lg:py-28 ${
        surface ? "theme-project" : "theme-paper border-t border-ink/15"
      }`}
    >
      {children}
    </article>
  );
}

function Heading({ project, className, size }: { project: Project; className?: string; size?: "xl" | "md" }) {
  return (
    <div className={className}>
      <ProjectMeta project={project} />
      <ProjectTitle project={project} size={size} className="mt-4" />
    </div>
  );
}

function Facts({ project, features = 4, tone = "light" }: { project: Project; features?: number; tone?: "light" | "dark" }) {
  return (
    <div className="mt-14 grid grid-cols-1 gap-10 lg:grid-cols-12">
      <div className="space-y-4 lg:col-span-5">
        {project.summary.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
      <FeatureList project={project} max={features} className="lg:col-span-4" />
      <div className="space-y-8 lg:col-span-3">
        <TechChips project={project} />
        <ProjectLinks project={project} tone={tone} />
      </div>
      <TechSheetCompact project={project} className="lg:col-span-12" />
    </div>
  );
}

// 01 — Vieira: abas com as telas reais dos 10 módulos -------------------------
function ModulesSpread({ project }: { project: Project }) {
  const phone = shot(project, "vieira/dashboard-mobile");
  return (
    <Shell project={project}>
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-end">
        <Heading project={project} className="lg:col-span-8" />
        <p className="text-lead lg:col-span-4">{project.tagline}</p>
      </div>
      <Reveal className="relative mt-12 lg:mt-16">
        <ModuleTabs project={project} idPrefix="home-vieira" sizes="(min-width: 1024px) 66vw, 100vw" />
        <div aria-hidden="true" className="pointer-events-none absolute -right-3 -bottom-14 hidden w-[15%] rotate-[3deg] xl:block">
          <PhoneFrame>
            <RenderShot id={phone.image} alt="" sizes="15vw" xray={false} />
          </PhoneFrame>
        </div>
      </Reveal>
      <Facts project={project} />
    </Shell>
  );
}

// 02 — Conveniência THR: telas sobrepostas sobre a placa verde ----------------
function StackSpread({ project }: { project: Project }) {
  const ref = useRef<HTMLDivElement>(null);
  const backRef = useRef<HTMLDivElement>(null);
  const frontRef = useRef<HTMLDivElement>(null);
  useParallax(ref, [
    [backRef, 24],
    [frontRef, -36],
  ]);
  const back = shot(project, "conveniencia/dashboard");
  const front = shot(project, "conveniencia/modal-saida-bloqueada");
  return (
    <Shell project={project}>
      <div ref={ref} className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="relative pb-20 sm:pb-28 lg:col-span-7">
          <div aria-hidden="true" className="absolute inset-x-[6%] top-[12%] bottom-0 rounded-[2rem] bg-(--accent-surface)" />
          <div ref={backRef} className="relative w-[90%] will-change-transform">
            <ShotView shot={back} address={shotAddress(project, back)} sizes="(min-width: 1024px) 52vw, 90vw" showCaption={false} />
          </div>
          <div ref={frontRef} className="absolute right-0 bottom-0 w-[60%] will-change-transform">
            <figure className="rotate-[2deg]">
            <BrowserFrame address={shotAddress(project, front)}>
              <RenderShot id={front.image} alt={front.alt} sizes="(min-width: 1024px) 34vw, 60vw" />
            </BrowserFrame>
              <figcaption className="label mt-3 inline-block -rotate-[2deg] rounded-full bg-ink px-3 py-1 text-paper">
                {front.caption}
              </figcaption>
            </figure>
          </div>
        </div>
        <div className="lg:col-span-5">
          <Heading project={project} size="md" />
          <p className="text-lead mt-6">{project.tagline}</p>
          <p className="mt-5">{project.summary[1]}</p>
          <FeatureList project={project} max={5} className="mt-8" />
          <TechChips project={project} className="mt-8" />
          <ProjectLinks project={project} className="mt-8" />
        </div>
        <TechSheetCompact project={project} className="lg:col-span-12" />
      </div>
    </Shell>
  );
}

// 03 — Sistema Pilates: um sistema, dois lados (equipe e aluno) ---------------
const PILATES_ROLES = ["Administração", "Professor", "Recepção", "Financeiro"];

function PortalsSpread({ project }: { project: Project }) {
  const agenda = shot(project, "pilates/agenda");
  const details = [shot(project, "pilates/presenca"), shot(project, "pilates/acompanhamento")];
  const phones = [shot(project, "pilates/aluno-dashboard-mobile"), shot(project, "pilates/aluno-presenca-mobile")];
  // Moldura escura para o painel: barra de endereço legível sobre a superfície do projeto.
  const frame = "[--frame-line:#6b6764] [--frame-bar:#2b2a29]";
  return (
    <Shell project={project}>
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-end">
        <Heading project={project} className="lg:col-span-7" />
        <p className="text-lead lg:col-span-5">{project.tagline}</p>
      </div>

      <Reveal className="mt-12 grid grid-cols-1 gap-12 rounded-[1.75rem] bg-(--accent-surface) p-5 text-(--accent-on) [--accent-text:#ff8fa8] [--focus:var(--color-acid)] sm:p-8 lg:grid-cols-12 lg:gap-10 lg:p-10">
        <section aria-labelledby="pilates-equipe" className="min-w-0 lg:col-span-8">
          <p className="label text-(--accent-text)">Lado 1 · /admin</p>
          <h4 id="pilates-equipe" className="mt-2 text-title leading-none font-extrabold uppercase">
            Painel da equipe
          </h4>
          <ul aria-label="Perfis de acesso da equipe" className="mt-4 flex flex-wrap gap-2">
            {PILATES_ROLES.map((role) => (
              <li key={role} className="chip">
                {role}
              </li>
            ))}
          </ul>
          <ShotView
            shot={agenda}
            address={shotAddress(project, agenda)}
            sizes="(min-width: 1024px) 56vw, 100vw"
            className="mt-8"
            frameClassName={frame}
          />
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
            {details.map((item) => (
              <ShotView
                key={item.image}
                shot={item}
                address={shotAddress(project, item)}
                sizes="(min-width: 1024px) 28vw, (min-width: 640px) 45vw, 100vw"
                frameClassName={frame}
              />
            ))}
          </div>
        </section>

        <section aria-labelledby="pilates-aluno" className="min-w-0 lg:col-span-4 lg:border-l lg:border-white/15 lg:pl-10">
          <p className="label text-(--accent-text)">Lado 2 · /aluno</p>
          <h4 id="pilates-aluno" className="mt-2 text-title leading-none font-extrabold uppercase">
            Portal do aluno
          </h4>
          <p className="mt-4">Aulas, frequência, financeiro com PIX, avaliações e notificações — no celular ou no computador.</p>
          <div className="mt-8 grid max-w-md grid-cols-2 items-start gap-4">
            {phones.map((item, index) => (
              <figure key={item.image} className={index === 1 ? "mt-16" : ""}>
                <PhoneFrame>
                  <RenderShot id={item.image} alt={item.alt} sizes="(min-width: 1024px) 12vw, 42vw" />
                </PhoneFrame>
                <figcaption className="label mt-3 opacity-80">{item.caption}</figcaption>
              </figure>
            ))}
          </div>
        </section>

        <div className="space-y-2 lg:col-span-12">
          {project.notes?.map((note) => (
            <p key={note} className="text-sm">
              {note}
            </p>
          ))}
          <p className="label opacity-80">{project.imageSource}</p>
        </div>
      </Reveal>
      <Facts project={project} features={6} />
    </Shell>
  );
}

// 04 — RestaurArt: película com as seções reais da página --------------------
function FilmstripSpread({ project }: { project: Project }) {
  const rail = useRef<HTMLDivElement>(null);
  const { reduceMotion } = usePrefs();
  const frames = project.shots.filter((s) => s.device === "desktop");
  const move = (direction: 1 | -1) => {
    const element = rail.current;
    if (!element) return;
    element.scrollBy({ left: direction * element.clientWidth * 0.8, behavior: reduceMotion ? "auto" : "smooth" });
  };
  return (
    <Shell project={project} surface dark>
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-end">
        <Heading project={project} className="lg:col-span-7" />
        <p className="text-lead lg:col-span-5">{project.tagline}</p>
      </div>

      <div className="mt-12">
        <div className="mb-4 flex items-center justify-between gap-4">
          <p className="label opacity-80">As {frames.length} seções da página publicada</p>
          <div className="flex gap-2">
            <button type="button" onClick={() => move(-1)} className="grid h-11 w-11 place-items-center rounded-full border-2 border-current hover:bg-(--accent) hover:text-(--accent-ink) hover:border-(--accent)">
              <Icon name="arrow-left" />
              <span className="sr-only">Seções anteriores</span>
            </button>
            <button type="button" onClick={() => move(1)} className="grid h-11 w-11 place-items-center rounded-full border-2 border-current hover:bg-(--accent) hover:text-(--accent-ink) hover:border-(--accent)">
              <Icon name="arrow" />
              <span className="sr-only">Próximas seções</span>
            </button>
          </div>
        </div>
        <div
          ref={rail}
          role="region"
          aria-label={`Seções da landing page ${project.name}`}
          tabIndex={0}
          className="rail -mx-4 px-4 [grid-auto-columns:min(80vw,34rem)] sm:-mx-8 sm:px-8 lg:-mx-14 lg:px-14"
        >
          {frames.map((frame, index) => (
            <figure key={frame.image}>
              <div className="aspect-[3/2] overflow-hidden rounded-lg border border-white/15">
                <RenderShot
                  id={frame.image}
                  alt={frame.alt}
                  sizes="(min-width: 640px) 34rem, 80vw"
                  className="h-full"
                  imgClassName="h-full w-full object-cover object-top"
                  fit="cover-top"
                />
              </div>
              <figcaption className="label mt-3">
                <span className="text-(--accent-text)">{String(index + 1).padStart(2, "0")}</span> {frame.caption}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
      <Facts project={project} features={4} tone="dark" />
    </Shell>
  );
}

// 05 — IaWorkout: fluxo da IA + painel de telas -----------------------------
function PipelineSpread({ project }: { project: Project }) {
  const wide = [shot(project, "iaworkout/dashboard-indicadores"), shot(project, "iaworkout/fichas-ia")];
  const phones = [shot(project, "iaworkout/treino-mobile"), shot(project, "iaworkout/portal-aluno-mobile"), shot(project, "iaworkout/assistente-mobile")];
  const students = shot(project, "iaworkout/alunos");
  return (
    <Shell project={project}>
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-end">
        <Heading project={project} className="lg:col-span-8" />
        <p className="text-lead lg:col-span-4">{project.tagline}</p>
      </div>

      <Reveal
        className="mt-12 rounded-[1.75rem] bg-(--accent-surface) p-5 text-(--accent-on) [--accent-text:#60a5fa] [--focus:var(--color-acid)] sm:p-8 lg:p-10"
      >
        {project.pipeline && <Pipeline steps={project.pipeline} title="Como a ficha de treino é gerada — fluxo conferido no código" />}
        <div className="mt-10 grid grid-cols-1 gap-5 lg:grid-cols-12">
          {wide.map((item, index) => (
            <figure key={item.image} className={index === 0 ? "lg:col-span-7" : "lg:col-span-5 lg:mt-20"}>
              <div className="overflow-hidden rounded-xl border border-white/15">
                <RenderShot id={item.image} alt={item.alt} sizes="(min-width: 1024px) 45vw, 100vw" />
              </div>
              <figcaption className="label mt-3 opacity-80">{item.caption}</figcaption>
            </figure>
          ))}
          <div className="grid grid-cols-3 items-start gap-3 lg:col-span-5">
            {phones.map((item) => (
              <figure key={item.image}>
                <div className="overflow-hidden rounded-xl border border-white/15">
                  <RenderShot id={item.image} alt={item.alt} sizes="(min-width: 1024px) 13vw, 30vw" />
                </div>
                <figcaption className="label mt-2 opacity-80">{item.caption}</figcaption>
              </figure>
            ))}
          </div>
          <figure className="lg:col-span-7">
            <div className="overflow-hidden rounded-xl border border-white/15">
              <RenderShot id={students.image} alt={students.alt} sizes="(min-width: 1024px) 45vw, 100vw" />
            </div>
            <figcaption className="label mt-3 opacity-80">{students.caption}</figcaption>
          </figure>
        </div>
        <p className="label mt-8 opacity-80">{project.imageSource}</p>
      </Reveal>
      <Facts project={project} features={6} />
    </Shell>
  );
}

// 06 — CyborgGames: moldura de HUD de jogo ------------------------------------
function HudSpread({ project }: { project: Project }) {
  const desktop = shot(project, "cyborg/desktop");
  const menu = shot(project, "cyborg/mobile-menu");
  const mobile = shot(project, "cyborg/mobile");
  return (
    <Shell project={project} surface dark>
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
        <div className="self-start lg:sticky lg:top-24 lg:col-span-4">
          <p className="label mb-3 text-(--accent-text)">stage {project.number} · press start</p>
          <Heading project={project} size="md" />
          <p className="text-lead mt-6">{project.tagline}</p>
          <p className="mt-5 opacity-90">{project.summary[0]}</p>
          <FeatureList project={project} max={5} className="mt-8" />
          <TechChips project={project} className="mt-8" />
          <ProjectLinks project={project} tone="dark" className="mt-8" />
          {project.notes?.map((note) => (
            <p key={note} className="label mt-6 opacity-80">
              {note}
            </p>
          ))}
        </div>
        <div className="lg:col-span-8">
          <figure className="group relative">
            <HudFrame labels={["rec · demo publicada", "1440 × 900"]}>
              <div className="relative overflow-hidden rounded-md">
                <RenderShot id={desktop.image} alt={desktop.alt} sizes="(min-width: 1024px) 60vw, 100vw" />
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 bg-[repeating-linear-gradient(0deg,rgb(0_0_0/0.18)_0_1px,transparent_1px_4px)] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                />
              </div>
            </HudFrame>
            <figcaption className="label mt-2 opacity-80">{desktop.caption}</figcaption>
          </figure>
          <div className="mt-10 grid grid-cols-2 gap-6 sm:ml-auto sm:w-[72%]">
            <ShotView shot={menu} address="" sizes="(min-width: 1024px) 22vw, 45vw" />
            <ShotView shot={mobile} address="" sizes="(min-width: 1024px) 22vw, 45vw" className="mt-12" />
          </div>
          <TechSheetCompact project={project} className="mt-10" />
        </div>
      </div>
    </Shell>
  );
}

// 07 — Starbucks: composição de revista, com selo de projeto educacional -----
function MagazineSpread({ project }: { project: Project }) {
  const desktop = shot(project, "starbucks/desktop");
  return (
    <Shell project={project}>
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
        <div className="order-2 lg:order-1 lg:col-span-4">
          <div className="rounded-[1.75rem] bg-(--accent-surface) p-5 sm:p-7">
            <PhoneFrame className="mx-auto max-w-[19rem]">
              <ScrollShot
                id="starbucks/mobile-full"
                alt="Página inteira do estudo de interface no celular, com as seções empilhadas."
                label="Estudo de interface no celular"
                aspect="9 / 19"
                sizes="19rem"
              />
            </PhoneFrame>
            <p className="label mt-4 text-center">Passe o mouse ou role: página inteira no celular</p>
          </div>
        </div>
        <div className="order-1 lg:order-2 lg:col-span-8">
          <div className="flex flex-wrap items-start justify-between gap-6">
            <div>
              <ProjectMeta project={project} />
              <h3 id={`${project.slug}-title`} className="narrow mt-4 text-[clamp(3.4rem,10vw,9rem)] leading-[0.82] font-[850] uppercase">
                Starbucks
                <span className="semiwide mt-2 block text-title font-[700] normal-case">estudo de interface</span>
              </h3>
            </div>
            <p className="grid h-32 w-32 shrink-0 rotate-[-8deg] place-items-center rounded-full border-2 border-(--accent-text) p-3 text-center font-mono text-[0.62rem] leading-snug font-bold text-(--accent-text) uppercase">
              Projeto educacional · sem vínculo com a marca
            </p>
          </div>
          <p className="text-lead mt-6 max-w-2xl">{project.tagline}</p>
          <ShotView shot={desktop} address={shotAddress(project, desktop)} sizes="(min-width: 1024px) 60vw, 100vw" className="mt-10" />
          <div className="mt-10 grid gap-10 md:grid-cols-2">
            <div className="space-y-4">
              {project.summary.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
            <div className="space-y-8">
              <FeatureList project={project} max={5} />
              <TechChips project={project} />
              <ProjectLinks project={project} />
            </div>
          </div>
          <TechSheetCompact project={project} className="mt-10" />
        </div>
      </div>
    </Shell>
  );
}

// 08 — B7 Burger: placa laranja (a cor da própria interface) -----------------
function PlateSpread({ project }: { project: Project }) {
  const desktop = shot(project, "b7burger/desktop");
  const mobile = shot(project, "b7burger/mobile");
  return (
    <Shell project={project} surface>
      <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <Heading project={project} size="md" />
          <p className="text-lead mt-6">{project.tagline}</p>
          <div className="mt-5 space-y-4">
            {project.summary.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          <FeatureList project={project} max={4} className="mt-8" />
          <TechChips project={project} className="mt-8" />
          <ProjectLinks project={project} className="mt-8" />
        </div>
        <div className="relative pb-16 pl-[14%] lg:col-span-7">
          <ShotView
            shot={desktop}
            address={shotAddress(project, desktop)}
            sizes="(min-width: 1024px) 50vw, 86vw"
            showCaption={false}
            frameClassName="[--frame-line:var(--color-ink)] [--frame-bar:#1f1f1f] text-white"
          />
          <figure className="absolute bottom-0 left-0 w-[30%] -rotate-[4deg]">
            <PhoneFrame>
              <RenderShot id={mobile.image} alt={mobile.alt} sizes="(min-width: 1024px) 15vw, 30vw" />
            </PhoneFrame>
          </figure>
        </div>
        <TechSheetCompact project={project} className="lg:col-span-12" />
      </div>
    </Shell>
  );
}

// 09 — Agência XYZ: tríptico com as capturas do autor ------------------------
function TriptychSpread({ project }: { project: Project }) {
  return (
    <Shell project={project}>
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-end">
        <Heading project={project} className="lg:col-span-7" />
        <p className="text-lead lg:col-span-5">{project.tagline}</p>
      </div>
      <div className="mt-12 grid gap-6 sm:grid-cols-3">
        {project.shots.map((item, index) => (
          <Reveal key={item.image} delay={index * 120} className={index === 1 ? "sm:mt-14" : index === 2 ? "sm:mt-28" : ""}>
            <ShotView shot={item} address={shotAddress(project, item)} sizes="(min-width: 640px) 31vw, 100vw" />
          </Reveal>
        ))}
      </div>
      <aside aria-label="Nota sobre as imagens" className="mt-10 max-w-3xl border-l-4 border-(--accent) pl-5">
        <p className="label mb-2 text-(--accent-text)">Nota de transparência</p>
        <p>{project.notes?.[0]}</p>
      </aside>
      <Facts project={project} features={5} />
    </Shell>
  );
}

// 10 — Medicenter: navegador com a página inteira rolando --------------------
function BrowserSpread({ project }: { project: Project }) {
  return (
    <Shell project={project}>
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center">
        <div className="rounded-[1.75rem] bg-(--accent-surface) p-3 sm:p-6 lg:col-span-8 lg:p-8">
          <BrowserFrame address="aleckdevv.github.io/AleckDevv-projeto-medcenter.github.io/">
            <ScrollShot
              id="medcenter/desktop-full"
              alt="Página inteira da Medicenter com banner, notícias, widgets laterais e rodapé em colunas."
              label="Página da Medicenter"
              aspect="16 / 10"
              sizes="(min-width: 1024px) 62vw, 100vw"
            />
          </BrowserFrame>
        </div>
        <div className="lg:col-span-4">
          <Heading project={project} size="md" />
          <p className="text-lead mt-6">{project.tagline}</p>
          <p className="mt-5">{project.summary[0]}</p>
          <FeatureList project={project} max={4} className="mt-8" />
          {project.notes?.map((note) => (
            <p key={note} className="mt-6 border-l-4 border-(--accent) pl-4 text-sm">
              {note}
            </p>
          ))}
          <TechChips project={project} className="mt-8" />
          <ProjectLinks project={project} className="mt-8" />
        </div>
        <TechSheetCompact project={project} className="lg:col-span-12" />
      </div>
    </Shell>
  );
}

const LAYOUTS: Record<Project["layout"], (props: { project: Project }) => ReactNode> = {
  modules: ModulesSpread,
  stack: StackSpread,
  portals: PortalsSpread,
  filmstrip: FilmstripSpread,
  pipeline: PipelineSpread,
  hud: HudSpread,
  magazine: MagazineSpread,
  plate: PlateSpread,
  triptych: TriptychSpread,
  browser: BrowserSpread,
};

export function ProjectSpread({ project }: { project: Project }) {
  const Layout = LAYOUTS[project.layout];
  return <Layout project={project} />;
}
