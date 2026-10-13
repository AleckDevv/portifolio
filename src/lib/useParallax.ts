import { useEffect, useState, type RefObject } from "react";
import { usePrefs } from "./prefs-store";

/**
 * Paralaxe sutil ligada à rolagem: cada alvo se desloca entre +d e −d px
 * enquanto o contêiner atravessa a tela. Escreve só `transform` (sem reflow)
 * e fica desligada com movimento reduzido ou em dispositivos limitados.
 * Os alvos devem ser refs estáveis do próprio componente.
 */
export function useParallax(
  container: RefObject<HTMLElement | null>,
  targets: Array<[RefObject<HTMLElement | null>, number]>,
) {
  const { reduceMotion, lite } = usePrefs();

  useEffect(() => {
    const root = container.current;
    if (!root || reduceMotion || lite) return;
    let frame: number | null = null;

    const update = () => {
      frame = null;
      const rect = root.getBoundingClientRect();
      const viewport = window.innerHeight;
      const progress = Math.min(1, Math.max(0, (viewport - rect.top) / (viewport + rect.height)));
      for (const [ref, distance] of targets) {
        if (ref.current) ref.current.style.transform = `translate3d(0, ${(distance * (1 - progress * 2)).toFixed(1)}px, 0)`;
      }
    };
    const schedule = () => {
      if (frame === null) frame = requestAnimationFrame(update);
    };

    const observer = new IntersectionObserver(([entry]) => {
      if (entry?.isIntersecting) {
        window.addEventListener("scroll", schedule, { passive: true });
        schedule();
      } else {
        window.removeEventListener("scroll", schedule);
      }
    });
    observer.observe(root);
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", schedule);
      if (frame !== null) cancelAnimationFrame(frame);
      for (const [ref] of targets) if (ref.current) ref.current.style.transform = "";
    };
  }, [container, reduceMotion, lite]); // eslint-disable-line react-hooks/exhaustive-deps
}

/** true depois que o elemento entra na tela (uma vez). false na pré-renderização. */
export function useInViewOnce(ref: RefObject<HTMLElement | null>, rootMargin = "0px 0px -12% 0px"): boolean {
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const element = ref.current;
    if (!element || seen) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setSeen(true);
          observer.disconnect();
        }
      },
      { rootMargin },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [ref, rootMargin, seen]);
  return seen;
}
