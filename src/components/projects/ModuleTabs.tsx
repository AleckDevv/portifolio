import { useRef, useState, type KeyboardEvent } from "react";
import type { Project } from "../../content/projects";
import { useCursorEffects } from "../../lib/prefs-store";
import { BrowserFrame } from "../media/Frames";
import { Picture } from "../media/Picture";

interface ModuleTabsProps {
  project: Project;
  /** Prefixo dos IDs (a mesma lista aparece na home e na página do projeto). */
  idPrefix: string;
  sizes: string;
}

/**
 * Abas com as telas reais de cada módulo (padrão WAI-ARIA Tabs, ativação automática).
 * Só a tela ativa e as já visitadas são carregadas.
 */
export function ModuleTabs({ project, idPrefix, sizes }: ModuleTabsProps) {
  const modules = project.modules ?? [];
  const [active, setActive] = useState(0);
  const [visited, setVisited] = useState<Set<number>>(() => new Set([0]));
  const tabs = useRef<Array<HTMLButtonElement | null>>([]);
  const cursorEffects = useCursorEffects();

  if (!modules.length) return null;
  const current = modules[active]!;
  const demoHost = project.links.demo ? new URL(project.links.demo.url).host : project.repoName;

  const select = (index: number, focus = false) => {
    setActive(index);
    setVisited((previous) => (previous.has(index) ? previous : new Set(previous).add(index)));
    if (focus) tabs.current[index]?.focus();
  };

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const last = modules.length - 1;
    const keys: Record<string, number> = {
      ArrowDown: index === last ? 0 : index + 1,
      ArrowRight: index === last ? 0 : index + 1,
      ArrowUp: index === 0 ? last : index - 1,
      ArrowLeft: index === 0 ? last : index - 1,
      Home: 0,
      End: last,
    };
    const next = keys[event.key];
    if (next === undefined) return;
    event.preventDefault();
    select(next, true);
  };

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8">
      <div
        role="tablist"
        aria-label={`Módulos do ${project.name}`}
        aria-orientation="vertical"
        className="-mx-4 flex min-w-0 snap-x gap-2 overflow-x-auto px-4 pb-2 lg:col-span-3 lg:mx-0 lg:flex-col lg:gap-0 lg:overflow-visible lg:px-0 lg:pb-0"
      >
        {modules.map((module, index) => {
          const selected = index === active;
          return (
            <button
              key={module.id}
              ref={(element) => {
                tabs.current[index] = element;
              }}
              role="tab"
              type="button"
              id={`${idPrefix}-tab-${module.id}`}
              aria-selected={selected}
              aria-controls={`${idPrefix}-panel`}
              tabIndex={selected ? 0 : -1}
              onClick={() => select(index)}
              onMouseEnter={cursorEffects ? () => select(index) : undefined}
              onKeyDown={(event) => onKeyDown(event, index)}
              className={`group flex shrink-0 snap-start items-baseline gap-3 rounded-full border-2 px-4 py-2 text-left font-semibold transition-colors lg:rounded-none lg:border-0 lg:border-b lg:border-ink/15 lg:px-0 lg:py-2.5 ${
                selected ? "border-ink bg-ink text-paper lg:bg-transparent lg:text-ink" : "border-ink/20 hover:border-ink"
              }`}
            >
              <span aria-hidden="true" className={`label ${selected ? "lg:text-(--accent-text)" : "opacity-60"}`}>
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="whitespace-nowrap lg:whitespace-normal">{module.label}</span>
              <span
                aria-hidden="true"
                className={`ml-auto hidden h-2.5 w-2.5 shrink-0 self-center rounded-full bg-orange transition-transform lg:block ${
                  selected ? "scale-100" : "scale-0"
                }`}
              />
            </button>
          );
        })}
      </div>

      <div
        role="tabpanel"
        id={`${idPrefix}-panel`}
        aria-labelledby={`${idPrefix}-tab-${current.id}`}
        tabIndex={0}
        className="relative min-w-0 lg:col-span-9"
      >
        <BrowserFrame address={`${demoHost}/#/${current.id}`}>
          <div className="grid">
            {modules.map((module, index) =>
              visited.has(index) ? (
                <div
                  key={module.id}
                  aria-hidden={index !== active}
                  className={`[grid-area:1/1] transition-opacity duration-500 ${index === active ? "opacity-100" : "opacity-0"}`}
                >
                  <Picture id={module.shot.image} alt={index === active ? module.shot.alt : ""} sizes={sizes} />
                </div>
              ) : null,
            )}
          </div>
        </BrowserFrame>
        <p className="mt-4 max-w-2xl">
          <strong className="font-semibold">{current.label}.</strong> {current.description}
        </p>
      </div>
    </div>
  );
}
