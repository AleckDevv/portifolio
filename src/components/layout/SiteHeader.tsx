import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router";
import { profile } from "../../content/profile";
import { usePrefs, type MotionChoice } from "../../lib/prefs-store";
import { TransitionLink } from "../../lib/transition";
import { Icon } from "../ui/Icon";
import { SECTIONS } from "../../content/sections";
import { SectionLink } from "./NavLinks";

interface HeaderState {
  tone: "dark" | "light";
  /** Cor de fundo da seção sob o cabeçalho (o cabeçalho a reutiliza). */
  background: string;
  /** No topo da página o cabeçalho fica transparente sobre o hero. */
  atTop: boolean;
}

/** Detecta a seção sob o cabeçalho (data-header="dark|light") e a cor dela. */
function useHeaderState(): HeaderState {
  const location = useLocation();
  const [state, setState] = useState<HeaderState>({ tone: "dark", background: "transparent", atTop: true });

  useEffect(() => {
    let frame: number | null = null;
    const measure = () => {
      frame = null;
      const stack = document.elementsFromPoint(24, 36);
      const host = stack.find((el) => !el.closest("[data-site-header]"))?.closest<HTMLElement>("[data-header]");
      let background = "transparent";
      for (let el: HTMLElement | null = host ?? null; el; el = el.parentElement) {
        const color = getComputedStyle(el).backgroundColor;
        if (color && color !== "rgba(0, 0, 0, 0)" && color !== "transparent") {
          background = color;
          break;
        }
      }
      const next: HeaderState = {
        tone: host?.dataset.header === "dark" ? "dark" : "light",
        background,
        atTop: window.scrollY < 8,
      };
      setState((prev) =>
        prev.tone === next.tone && prev.background === next.background && prev.atTop === next.atTop ? prev : next,
      );
    };
    const schedule = () => {
      if (frame === null) frame = requestAnimationFrame(measure);
    };
    measure();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (frame !== null) cancelAnimationFrame(frame);
    };
  }, [location.pathname]);

  return state;
}

export function TechToggle({ className, showLabel = false }: { className?: string; showLabel?: boolean }) {
  const { techMode, toggleTechMode } = usePrefs();
  return (
    <button
      type="button"
      aria-pressed={techMode}
      onClick={toggleTechMode}
      className={`inline-flex min-h-11 items-center gap-2 rounded-full border-2 px-3.5 text-sm font-semibold transition-colors ${
        techMode ? "border-cyan bg-cyan text-ink" : "border-current"
      } ${className ?? ""}`}
    >
      <Icon name="code" size={18} />
      <span className={showLabel ? "" : "sr-only xl:not-sr-only"}>Modo técnico</span>
      <span aria-hidden="true" className="label max-[359px]:hidden">
        {techMode ? "on" : "off"}
      </span>
    </button>
  );
}

const MOTION_OPTIONS: Array<{ value: MotionChoice; label: string }> = [
  { value: "system", label: "Sistema" },
  { value: "reduce", label: "Reduzidas" },
  { value: "full", label: "Completas" },
];

export function MotionControl({ className }: { className?: string }) {
  const { motionChoice, setMotionChoice } = usePrefs();
  return (
    <fieldset className={className}>
      <legend className="label mb-2">Animações</legend>
      <div className="inline-flex rounded-full border-2 border-current p-1">
        {MOTION_OPTIONS.map((option) => (
          <label
            key={option.value}
            className={`seg-option cursor-pointer rounded-full px-3 py-1.5 text-sm font-semibold transition-colors ${
              motionChoice === option.value ? "bg-current" : ""
            }`}
          >
            <input
              type="radio"
              name="motion-choice"
              value={option.value}
              checked={motionChoice === option.value}
              onChange={() => setMotionChoice(option.value)}
              className="sr-only"
            />
            <span className={motionChoice === option.value ? "text-[var(--motion-on,var(--color-ink))]" : ""}>{option.label}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

function MobileMenu() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const close = () => dialogRef.current?.close();

  return (
    <>
      <button
        type="button"
        onClick={() => dialogRef.current?.showModal()}
        className="inline-flex min-h-11 items-center gap-2 rounded-full border-2 border-current px-4 text-sm font-semibold md:hidden"
        aria-haspopup="dialog"
      >
        <Icon name="menu" size={18} /> <span className="max-[359px]:sr-only">Menu</span>
      </button>
      <dialog
        ref={dialogRef}
        aria-label="Menu"
        className="theme-volt m-0 h-dvh max-h-none w-screen max-w-none p-0 backdrop:bg-ink/60 [--motion-on:var(--color-volt)]"
        onClick={(event) => {
          if (event.target === dialogRef.current) close();
        }}
      >
        <div className="flex h-full flex-col px-5 pt-5 pb-8">
          <div className="flex items-center justify-between">
            <span className="label text-white/80">{profile.handle} · navegação</span>
            <button
              type="button"
              onClick={close}
              className="inline-flex min-h-11 items-center gap-2 rounded-full border-2 border-current px-4 text-sm font-semibold"
            >
              <Icon name="close" size={18} /> Fechar
            </button>
          </div>
          <nav aria-label="Seções" className="mt-10">
            <ul className="space-y-1">
              {SECTIONS.map((section) => (
                <li key={section.id}>
                  <SectionLink
                    id={section.id}
                    label={section.label}
                    onNavigate={close}
                    className="wide flex items-baseline gap-3 py-1 text-[clamp(2.4rem,13vw,4rem)] leading-none font-[800] text-white uppercase no-underline"
                  />
                </li>
              ))}
            </ul>
          </nav>
          <div className="mt-auto space-y-6">
            <TechToggle showLabel />
            <MotionControl />
          </div>
        </div>
      </dialog>
    </>
  );
}

export function SiteHeader() {
  const { tone, background, atTop } = useHeaderState();
  const dark = tone === "dark";
  return (
    <header
      data-site-header
      style={{ backgroundColor: atTop ? "transparent" : `color-mix(in srgb, ${background} 94%, transparent)` }}
      className={`fixed inset-x-0 top-0 z-50 border-b transition-[background-color,color,border-color] duration-300 ${
        atTop ? "border-transparent" : dark ? "border-white/10 backdrop-blur-md" : "border-ink/15 backdrop-blur-md"
      } ${dark ? "text-white [--focus:var(--color-acid)]" : "text-ink [--focus:var(--color-volt)]"}`}
    >
      <div className="flex h-16 items-center justify-between gap-4 px-4 sm:px-8 lg:px-14">
        <TransitionLink to="/" label="Início" className="group flex items-center gap-2 no-underline" aria-label={`${profile.handle} — início`}>
          <span aria-hidden="true" className="block h-3.5 w-3.5 bg-orange transition-transform duration-300 group-hover:rotate-45" />
          <span className="semiwide text-lg font-[800] tracking-tight">{profile.handle}</span>
        </TransitionLink>

        <nav aria-label="Principal" className="hidden md:block">
          <ul className="flex items-center gap-7 text-[0.95rem] font-semibold">
            {SECTIONS.map((section) => (
              <li key={section.id}>
                <SectionLink id={section.id} label={section.label} className="arrow-link py-2" />
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <TechToggle />
          <MobileMenu />
        </div>
      </div>
    </header>
  );
}
