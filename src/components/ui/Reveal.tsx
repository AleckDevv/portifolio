import { useRef, useState, type CSSProperties, type ElementType, type ReactNode } from "react";
import { useIsoLayoutEffect } from "../../lib/hooks";
import { usePrefs } from "../../lib/prefs-store";

interface RevealProps {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  /** Atraso em ms (para escalonar elementos vizinhos). */
  delay?: number;
  /** Deslocamento vertical inicial em px. */
  y?: number;
  id?: string;
  style?: CSSProperties;
}

/**
 * Revela o conteúdo ao entrar na tela.
 * O HTML pré-renderizado é sempre visível; só elementos que ainda estão fora da
 * tela na hidratação são escondidos (sem piscar) e revelados ao aparecer.
 */
export function Reveal({ children, as: Tag = "div", className, delay = 0, y = 36, id, style }: RevealProps) {
  const ref = useRef<HTMLElement>(null);
  const { reduceMotion } = usePrefs();
  const [state, setState] = useState<"static" | "hidden" | "shown">("static");

  useIsoLayoutEffect(() => {
    const element = ref.current;
    if (!element || reduceMotion || !("IntersectionObserver" in window)) return;
    if (element.getBoundingClientRect().top < window.innerHeight * 0.92) return;
    setState("hidden");
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setState("shown");
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px -8% 0px" },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const motionStyle: CSSProperties =
    state === "hidden"
      ? { opacity: 0, transform: `translate3d(0, ${y}px, 0)` }
      : state === "shown"
        ? {
            opacity: 1,
            transform: "none",
            transition: `opacity 0.9s var(--ease-out-expo) ${delay}ms, transform 1.1s var(--ease-out-expo) ${delay}ms`,
          }
        : {};

  return (
    <Tag ref={ref} id={id} className={className} style={{ ...style, ...motionStyle }}>
      {children}
    </Tag>
  );
}
