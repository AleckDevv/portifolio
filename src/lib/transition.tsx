import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Link, useLocation, useNavigate, useNavigationType, type LinkProps } from "react-router";
import { isModifiedClick, useIsoLayoutEffect } from "./hooks";
import { usePrefs } from "./prefs-store";
import { TransitionContext, useTransitionNav } from "./transition-context";

// ---------------------------------------------------------------------------
// Transição entre páginas: uma "cortina" azul cobre a tela com o nome do
// destino, a rota muda por baixo e a cortina sai pelo topo. Com movimento
// reduzido, a navegação é imediata.
// ---------------------------------------------------------------------------

type Phase = "idle" | "cover" | "reveal";

export function TransitionProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const { reduceMotion } = usePrefs();
  const [phase, setPhase] = useState<Phase>("idle");
  const [label, setLabel] = useState("");
  const target = useRef<string | null>(null);

  const go = useCallback(
    (to: string, nextLabel = "") => {
      if (reduceMotion) {
        navigate(to);
        return;
      }
      target.current = to;
      setLabel(nextLabel);
      setPhase("cover");
    },
    [navigate, reduceMotion],
  );

  const onCurtainDone = () => {
    if (phase === "cover") {
      if (target.current) navigate(target.current);
      target.current = null;
      setPhase("reveal");
    } else if (phase === "reveal") {
      setPhase("idle");
    }
  };

  const api = useMemo(() => ({ go }), [go]);

  return (
    <TransitionContext.Provider value={api}>
      {children}
      {phase !== "idle" && (
        <div
          aria-hidden="true"
          data-phase={phase}
          className="curtain theme-volt fixed inset-0 z-90 flex items-end overflow-hidden p-[clamp(1rem,4vw,3.5rem)]"
          onAnimationEnd={(event) => {
            if (event.target === event.currentTarget) onCurtainDone();
          }}
        >
          <span className="label absolute top-[clamp(1rem,4vw,3.5rem)] left-[clamp(1rem,4vw,3.5rem)] text-acid">carregando rota</span>
          <span className="wide block max-w-full truncate text-display font-[850] uppercase">{label}</span>
        </div>
      )}
    </TransitionContext.Provider>
  );
}

type TransitionLinkProps = Omit<LinkProps, "to"> & { to: string; label?: string };

/** Link interno com a transição de página. Cliques com Ctrl/Cmd/Shift seguem o comportamento normal. */
export function TransitionLink({ to, label, onClick, ...rest }: TransitionLinkProps) {
  const { go } = useTransitionNav();
  const location = useLocation();
  return (
    <Link
      to={to}
      onClick={(event) => {
        onClick?.(event);
        if (event.defaultPrevented || isModifiedClick(event) || rest.target === "_blank") return;
        const [path] = to.split("#");
        if (path === location.pathname || (path === "" && to.startsWith("#"))) return; // mesma página: rolagem nativa
        event.preventDefault();
        go(to, label ?? "");
      }}
      {...rest}
    />
  );
}

// ---------------------------------------------------------------------------
// Rolagem: topo em navegação nova, posição salva ao voltar, âncoras com #.
// ---------------------------------------------------------------------------

const positions = new Map<string, number>();

export function ScrollManager() {
  const location = useLocation();
  const navigationType = useNavigationType();
  const { reduceMotion } = usePrefs();
  const firstRender = useRef(true);
  const previousPath = useRef(location.pathname);

  useEffect(() => {
    if ("scrollRestoration" in window.history) window.history.scrollRestoration = "manual";
    const save = () => positions.set(window.history.state?.key ?? "initial", window.scrollY);
    window.addEventListener("scroll", save, { passive: true });
    return () => window.removeEventListener("scroll", save);
  }, []);

  useIsoLayoutEffect(() => {
    const samePage = previousPath.current === location.pathname;
    previousPath.current = location.pathname;
    if (firstRender.current) {
      firstRender.current = false;
      return; // carga inicial: o navegador já cuida da âncora
    }
    if (location.hash) {
      const element = document.getElementById(decodeURIComponent(location.hash.slice(1)));
      if (element) {
        element.scrollIntoView({ block: "start", behavior: samePage && !reduceMotion ? "smooth" : "instant" });
        return;
      }
    }
    if (samePage) return;
    if (navigationType === "POP") {
      const saved = positions.get(location.key);
      if (saved !== undefined) {
        window.scrollTo({ top: saved, behavior: "instant" });
        return;
      }
    }
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [location.key]);

  return null;
}

// ---------------------------------------------------------------------------
// Acessibilidade em navegação de SPA: anuncia o título da nova página e move
// o foco para o conteúdo principal.
// ---------------------------------------------------------------------------

export function RouteAnnouncer() {
  const location = useLocation();
  const [message, setMessage] = useState("");
  const firstRender = useRef(true);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    const timer = window.setTimeout(() => {
      setMessage(document.title);
      if (!location.hash) {
        const main = document.getElementById("conteudo");
        main?.focus({ preventScroll: true });
      }
    }, 60);
    return () => window.clearTimeout(timer);
  }, [location.pathname, location.hash]);

  return (
    <p aria-live="polite" aria-atomic="true" className="sr-only">
      {message}
    </p>
  );
}
