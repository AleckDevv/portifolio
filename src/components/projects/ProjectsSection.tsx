import { useEffect, useRef, useState } from "react";
import { projects, type Project } from "../../content/projects";
import { useCursorEffects } from "../../lib/prefs-store";
import { Picture } from "../media/Picture";
import { SectionHeading } from "../ui/SectionHeading";
import { kindLabel } from "./project-utils";
import { ProjectSpread } from "./ProjectSpread";

/** Índice com prévia da captura que acompanha o cursor (só com mouse). */
function ProjectIndex() {
  const cursorEffects = useCursorEffects();
  const [hovered, setHovered] = useState<Project | null>(null);
  // Última prévia exibida (continua montada enquanto some) e posição inicial dela.
  const [shown, setShown] = useState<Project | null>(null);
  const [origin, setOrigin] = useState({ x: 0, y: 0 });
  const preview = useRef<HTMLDivElement>(null);
  const target = useRef({ x: 0, y: 0 });
  const current = useRef({ x: 0, y: 0 });
  const frame = useRef<number | null>(null);

  const enter = (project: Project) => {
    if (!cursorEffects) return;
    if (!hovered) setOrigin({ ...target.current });
    setHovered(project);
    setShown(project);
  };

  useEffect(() => () => {
    if (frame.current !== null) cancelAnimationFrame(frame.current);
  }, []);

  const follow = () => {
    const c = current.current;
    const t = target.current;
    c.x += (t.x - c.x) * 0.2;
    c.y += (t.y - c.y) * 0.2;
    if (preview.current) preview.current.style.translate = `${c.x.toFixed(1)}px ${c.y.toFixed(1)}px`;
    frame.current = Math.abs(t.x - c.x) + Math.abs(t.y - c.y) > 0.5 ? requestAnimationFrame(follow) : null;
  };

  const onPointerMove = (event: React.PointerEvent) => {
    if (!cursorEffects) return;
    target.current = { x: event.clientX + 28, y: event.clientY - 110 };
    if (!hovered) current.current = { ...target.current };
    if (frame.current === null) frame.current = requestAnimationFrame(follow);
  };

  return (
    <nav aria-labelledby="indice-titulo" onPointerMove={onPointerMove}>
      <h3 id="indice-titulo" className="label mb-3 text-ink-soft">
        Índice
      </h3>
      <ol className="border-t border-ink/20">
        {projects.map((project) => (
          <li key={project.slug} className="border-b border-ink/20">
            <a
              href={`#${project.slug}`}
              onPointerEnter={() => enter(project)}
              onPointerLeave={() => setHovered(null)}
              className="group grid grid-cols-[2.5rem_1fr_auto] items-baseline gap-3 py-2.5 no-underline"
            >
              <span className="label text-ink-soft transition-colors group-hover:text-orange">{project.number}</span>
              <span className="semiwide font-bold transition-transform duration-300 group-hover:translate-x-1.5">{project.name}</span>
              <span className="label text-ink-soft">{kindLabel(project)}</span>
            </a>
          </li>
        ))}
      </ol>
      {cursorEffects && shown && (
        <div
          ref={preview}
          aria-hidden="true"
          className={`pointer-events-none fixed top-0 left-0 z-40 w-88 overflow-hidden rounded-xl border-2 border-ink bg-paper transition-[opacity,scale,rotate] duration-200 ${
            hovered ? "scale-100 rotate-0 opacity-100" : "scale-95 -rotate-2 opacity-0"
          }`}
          style={{ translate: `${origin.x}px ${origin.y}px` }}
        >
          <Picture id={shown.shots[0]!.image} alt="" sizes="22rem" />
        </div>
      )}
    </nav>
  );
}

export function ProjectsSection() {
  return (
    <section id="projetos" aria-labelledby="projetos-titulo" data-section="<section#projetos>" data-header="light" className="theme-paper">
      <div className="px-4 pt-24 pb-16 sm:px-8 lg:px-14 lg:pt-32">
        <SectionHeading
          id="projetos-titulo"
          label="// 01 — trabalho selecionado"
          labelClassName="text-ink-soft"
          title={
            <>
              Projetos
              <sup className="ml-2 align-top font-mono text-[0.16em] font-bold tracking-normal text-volt">
                ({String(projects.length).padStart(2, "0")})
              </sup>
            </>
          }
        >
          <p className="text-lead max-w-xl lg:col-span-5">
            Nove projetos reais, das primeiras páginas em HTML e CSS a sistemas completos com Java, React e banco de dados. Cada um tem
            uma composição própria e um estudo de caso com telas, tecnologias e detalhes técnicos.
          </p>
          <div className="lg:col-span-6 lg:col-start-7">
            <ProjectIndex />
          </div>
        </SectionHeading>
      </div>
      {projects.map((project) => (
        <ProjectSpread key={project.slug} project={project} />
      ))}
    </section>
  );
}
