import { useCallback, useMemo, useRef, useState, type ReactNode } from "react";
import { projectsUsing } from "../../content/projects";
import { categories, getTech, type TechId } from "../../content/technologies";
import { TransitionLink } from "../../lib/transition";
import { Icon } from "../ui/Icon";
import { TechDialogContext } from "./tech-dialog-context";

/** Diálogo único (nativo) com a explicação da tecnologia e os projetos onde ela aparece. */
export function TechDialogProvider({ children }: { children: ReactNode }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);
  const [techId, setTechId] = useState<TechId | null>(null);

  const openTech = useCallback((id: TechId, trigger?: HTMLElement | null) => {
    triggerRef.current = trigger ?? (document.activeElement as HTMLElement | null);
    setTechId(id);
    const dialog = dialogRef.current;
    if (dialog && !dialog.open) dialog.showModal();
  }, []);

  const close = () => dialogRef.current?.close();
  const api = useMemo(() => ({ openTech }), [openTech]);

  const tech = techId ? getTech(techId) : null;
  const usage = techId ? projectsUsing(techId) : [];

  return (
    <TechDialogContext.Provider value={api}>
      {children}
      <dialog
        ref={dialogRef}
        aria-labelledby="tech-dialog-title"
        aria-describedby="tech-dialog-desc"
        className="theme-paper fixed inset-0 m-auto max-h-[min(42rem,92dvh)] w-[min(40rem,calc(100vw-2rem))] overflow-y-auto rounded-2xl border-2 border-ink p-0 backdrop:bg-ink/55 backdrop:backdrop-blur-[2px]"
        onClose={() => {
          setTechId(null);
          triggerRef.current?.focus();
        }}
        onClick={(event) => {
          if (event.target === dialogRef.current) close();
        }}
      >
        {tech && techId && (
          <div className="p-6 sm:p-8">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-4">
                <span
                  aria-hidden="true"
                  className={`wide grid h-16 w-16 shrink-0 place-items-center rounded-lg text-2xl font-[850] ${
                    tech.status === "estudo" ? "border-2 border-dashed border-ink text-ink" : "bg-volt text-white"
                  }`}
                >
                  {tech.symbol}
                </span>
                <div>
                  <p className="label text-ink-soft">{categories[tech.category].label}</p>
                  <h2 id="tech-dialog-title" className="semiwide text-title font-[800]">
                    {tech.name}
                  </h2>
                </div>
              </div>
              <button
                type="button"
                onClick={close}
                className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-full border-2 border-ink px-3.5 text-sm font-semibold hover:bg-ink hover:text-paper"
              >
                <Icon name="close" size={16} /> Fechar
              </button>
            </div>

            <p className="mt-5">
              <span
                className={`label inline-block rounded-full px-2.5 py-1 ${
                  tech.status === "estudo" ? "border border-dashed border-ink" : "bg-acid text-ink"
                }`}
              >
                {tech.status === "estudo" ? "Aprendizado em andamento" : `Usado em ${usage.length} ${usage.length === 1 ? "projeto" : "projetos"}`}
              </span>
            </p>
            <p id="tech-dialog-desc" className="mt-4 text-lg">
              {tech.description}
            </p>

            {usage.length > 0 && (
              <div className="mt-6">
                <h3 className="label mb-3 text-ink-soft">Onde aparece</h3>
                <ul className="divide-y divide-ink/15 border-y border-ink/15">
                  {usage.map(({ project, note }) => (
                    <li key={project.slug}>
                      <TransitionLink
                        to={`/projetos/${project.slug}/`}
                        label={project.name}
                        onClick={close}
                        className="group flex items-start gap-4 py-3 no-underline"
                      >
                        <span className="label mt-1 text-volt">{project.number}</span>
                        <span className="flex-1">
                          <span className="block font-semibold group-hover:underline">{project.name}</span>
                          {note && <span className="block text-sm text-ink-soft">{note}</span>}
                        </span>
                        <Icon name="arrow" className="mt-1 shrink-0 transition-transform group-hover:translate-x-1" />
                      </TransitionLink>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </dialog>
    </TechDialogContext.Provider>
  );
}
