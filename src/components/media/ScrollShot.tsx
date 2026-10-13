import { useEffect, useRef } from "react";
import type { ImageId } from "../../content/images";
import { useCursorEffects } from "../../lib/prefs-store";
import { Picture } from "./Picture";

interface ScrollShotProps {
  id: ImageId;
  alt: string;
  sizes: string;
  /** Proporção da janela (CSS aspect-ratio), ex.: "16 / 10". */
  aspect: string;
  /** Nome acessível da região rolável. */
  label: string;
  className?: string;
}

/**
 * Página inteira dentro de uma janela de altura fixa.
 * Com mouse, a captura desce sozinha ao passar o cursor; em qualquer
 * dispositivo dá para rolar com a roda, o toque ou o teclado (região focável).
 */
export function ScrollShot({ id, alt, sizes, aspect, label, className }: ScrollShotProps) {
  const ref = useRef<HTMLDivElement>(null);
  const frame = useRef<number | null>(null);
  const cursorEffects = useCursorEffects();

  useEffect(() => () => {
    if (frame.current) cancelAnimationFrame(frame.current);
  }, []);

  const stop = () => {
    if (frame.current) cancelAnimationFrame(frame.current);
    frame.current = null;
  };

  const scrollTo = (target: number, speed: number) => {
    const element = ref.current;
    if (!element) return;
    stop();
    let last = performance.now();
    const step = (now: number) => {
      const delta = Math.min(64, now - last);
      last = now;
      const current = element.scrollTop;
      const direction = Math.sign(target - current);
      const next = current + direction * speed * delta;
      if ((direction > 0 && next >= target) || (direction < 0 && next <= target) || direction === 0) {
        element.scrollTop = target;
        frame.current = null;
        return;
      }
      element.scrollTop = next;
      frame.current = requestAnimationFrame(step);
    };
    frame.current = requestAnimationFrame(step);
  };

  return (
    <div className={`group relative ${className ?? ""}`}>
      <div
        ref={ref}
        role="region"
        aria-label={`${label} — página inteira; role para ver`}
        tabIndex={0}
        className="overflow-y-auto [scrollbar-width:thin]"
        style={{ aspectRatio: aspect }}
        onMouseEnter={() => {
          if (cursorEffects && ref.current) scrollTo(ref.current.scrollHeight - ref.current.clientHeight, 0.32);
        }}
        onMouseLeave={() => {
          if (cursorEffects) scrollTo(0, 1.6);
        }}
        onWheel={stop}
        onTouchStart={stop}
        onKeyDown={stop}
      >
        <Picture id={id} alt={alt} sizes={sizes} />
      </div>
      <span
        aria-hidden="true"
        className="label pointer-events-none absolute right-3 bottom-3 rounded-full bg-ink/85 px-2.5 py-1 text-paper transition-opacity group-hover:opacity-0"
      >
        página inteira ↓
      </span>
    </div>
  );
}
