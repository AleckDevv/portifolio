import { profile } from "../../content/profile";
import { projects } from "../../content/projects";
import { useMounted } from "../../lib/hooks";
import { Icon } from "../ui/Icon";
import { KineticHeadline } from "./KineticHeadline";
import { SystemGraph } from "./SystemGraph";

/** Índice dos projetos no formato de um "git log" (mais recentes primeiro). */
function ProjectLog() {
  const entries = [...projects].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  return (
    <nav aria-labelledby="log-title" className="font-mono text-[0.72rem] leading-relaxed">
      <p id="log-title" className="mb-1 text-white" style={{ fontStretch: "87.5%" }}>
        <span className="text-acid">$</span> git log --projetos
      </p>
      <ol>
        {entries.map((project) => (
          <li key={project.slug}>
            <a
              href={`#${project.slug}`}
              className="group flex min-h-6 items-center gap-3 py-0.5 text-white no-underline transition-colors hover:text-acid"
              style={{ fontStretch: "87.5%" }}
            >
              <span className="tabular text-acid">{project.createdAt}</span>
              <span className="truncate">
                <span className="group-hover:text-acid">{project.number}</span> {project.name.toLowerCase()}
              </span>
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}

export function Hero() {
  const mounted = useMounted();
  return (
    <section
      id="inicio"
      aria-labelledby="hero-title"
      data-section="<section#inicio>"
      data-header="dark"
      className="theme-volt relative isolate flex min-h-svh flex-col overflow-hidden px-4 pt-22 pb-8 sm:px-8 lg:px-14 lg:pt-24"
    >
      <div className="label flex flex-wrap items-center justify-between gap-x-6 gap-y-1 text-white/85">
        <span>
          {profile.name} <span className="text-acid">/</span> {profile.handle}
        </span>
        <span>
          {profile.role} <span className="text-acid">·</span> {profile.location}
        </span>
      </div>

      <div className="relative mt-6 lg:mt-8">
        {/* Rede de sistemas conectados: só na faixa do título, sem invadir textos menores */}
        {mounted && (
          <SystemGraph className="absolute -top-8 -bottom-4 left-1/2 -z-10 h-[calc(100%+3rem)] w-screen -translate-x-1/2" />
        )}
        <KineticHeadline id="hero-title" lines={profile.headline} />
        {/* Pontuação geométrica ao lado de "sai." (desktop) */}
        <div aria-hidden="true" className="pointer-events-none absolute bottom-[2%] left-[6%] hidden h-[0.9em] items-center gap-4 lg:flex">
          <span className="block aspect-square h-[clamp(4rem,9vh,7rem)] rounded-full bg-orange" />
          <span className="block h-[2px] w-[clamp(6rem,14vw,16rem)] bg-white/70" />
          <span className="block aspect-square h-4 bg-acid" />
        </div>
      </div>

      <div className="mt-10 grid items-end gap-8 lg:mt-auto lg:grid-cols-12 lg:gap-10 lg:pt-10">
        <p className="text-lead max-w-[34rem] text-white lg:col-span-5">{profile.intro}</p>

        <div className="flex flex-col gap-3 sm:flex-row lg:col-span-3 lg:flex-col">
          <a href="#projetos" className="btn btn-acid">
            Ver os {projects.length} projetos <Icon name="arrow-down" />
          </a>
          <a href="#contato" className="btn border-white text-white hover:bg-white hover:text-volt">
            Falar comigo <Icon name="arrow" />
          </a>
        </div>

        <div className="lg:col-span-4">
          <ProjectLog />
        </div>
      </div>
    </section>
  );
}
