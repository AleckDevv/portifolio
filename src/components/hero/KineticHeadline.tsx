import { useEffect, useRef } from "react";
import type { HeadlineLine } from "../../content/profile";
import { INTRO_REVEAL, introPlaying } from "../../lib/intro";
import { useCursorEffects, usePrefs } from "../../lib/prefs-store";

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

const styleClass: Record<HeadlineLine["style"], string> = {
  strike: "text-white",
  outline: "text-outline text-white [--outline-fill:var(--color-volt)]",
  accent: "text-acid",
  solid: "text-white",
};

/**
 * Título do hero. Cada letra reage à proximidade do cursor mudando os eixos
 * variáveis da fonte (peso e largura). A linha de destaque "recompila"
 * (embaralha e resolve) ao carregar e ao passar o mouse.
 * Leitores de tela recebem a frase completa (texto visual é aria-hidden).
 */
export function KineticHeadline({ lines, id }: { lines: HeadlineLine[]; id?: string }) {
  const ref = useRef<HTMLHeadingElement>(null);
  const cursorEffects = useCursorEffects();
  const { reduceMotion } = usePrefs();
  const decodeTimer = useRef<number | null>(null);

  const decode = () => {
    const root = ref.current;
    if (!root) return;
    const letters = Array.from(root.querySelectorAll<HTMLElement>('[data-line="accent"] [data-letter]'));
    if (!letters.length) return;
    if (decodeTimer.current) window.clearInterval(decodeTimer.current);
    const finals = letters.map((el) => el.dataset.letter ?? "");
    const started = performance.now();
    decodeTimer.current = window.setInterval(() => {
      const elapsed = performance.now() - started;
      let done = true;
      letters.forEach((el, i) => {
        if (elapsed > 260 + i * 85) {
          el.textContent = finals[i]!;
        } else {
          done = false;
          el.textContent = GLYPHS[Math.floor(Math.random() * GLYPHS.length)]!;
        }
      });
      if (done && decodeTimer.current) {
        window.clearInterval(decodeTimer.current);
        decodeTimer.current = null;
      }
    }, 45);
  };

  // "Recompila" a linha de destaque uma vez depois da hidratação — ou, com a
  // abertura tocando, logo que a cortina sobe e o título começa a aparecer.
  useEffect(() => {
    if (reduceMotion) return;
    const root = ref.current;
    const timer = decodeTimer;
    let timeout: number | undefined;
    const start = () => {
      timeout = window.setTimeout(decode, 350);
    };
    if (introPlaying()) window.addEventListener(INTRO_REVEAL, start, { once: true });
    else start();
    return () => {
      window.removeEventListener(INTRO_REVEAL, start);
      window.clearTimeout(timeout);
      if (timer.current) window.clearInterval(timer.current);
      root?.querySelectorAll<HTMLElement>("[data-letter]").forEach((el) => {
        el.textContent = el.dataset.letter ?? "";
      });
    };
  }, [reduceMotion]);

  // Efeito de proximidade do cursor (só com mouse e sem movimento reduzido).
  useEffect(() => {
    const root = ref.current;
    if (!root || !cursorEffects) return;
    const letters = Array.from(root.querySelectorAll<HTMLElement>("[data-letter]"));
    const intensity = letters.map(() => 0);
    const baseStretch = parseFloat(getComputedStyle(root).fontStretch) || 100;
    const pointer = { x: 0, y: 0, active: false };
    let frame: number | null = null;

    const loop = () => {
      const rects = letters.map((el) => el.getBoundingClientRect());
      let moving = false;
      rects.forEach((rect, i) => {
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const distance = pointer.active ? Math.hypot(pointer.x - cx, pointer.y - cy) : Infinity;
        const target = distance < 280 ? (1 - distance / 280) ** 1.4 : 0;
        const next = intensity[i]! + (target - intensity[i]!) * 0.16;
        if (Math.abs(next - intensity[i]!) > 0.002) moving = true;
        intensity[i] = next;
      });
      letters.forEach((el, i) => {
        const value = intensity[i]!;
        el.style.fontWeight = String(Math.round(850 - value * 560));
        el.style.fontStretch = `${(baseStretch - value * (baseStretch - 75)).toFixed(1)}%`;
      });
      frame = moving || pointer.active ? requestAnimationFrame(loop) : null;
    };

    const onMove = (event: PointerEvent) => {
      const box = root.getBoundingClientRect();
      pointer.x = event.clientX;
      pointer.y = event.clientY;
      pointer.active = event.clientY > box.top - 120 && event.clientY < box.bottom + 120;
      if (frame === null) frame = requestAnimationFrame(loop);
    };
    const onLeave = () => {
      pointer.active = false;
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
      if (frame !== null) cancelAnimationFrame(frame);
      letters.forEach((el) => {
        el.style.fontWeight = "";
        el.style.fontStretch = "";
      });
    };
  }, [cursorEffects]);

  const sentence = lines.map((line) => line.text).join(" ");

  return (
    <h1 ref={ref} id={id} className="hero-title relative">
      <span className="sr-only">{sentence}</span>
      <span aria-hidden="true" className="block">
        {lines.map((line, index) => (
          <span
            key={`${line.text}-${index}`}
            data-line={line.style}
            className={`block whitespace-nowrap ${line.align === "end" ? "text-right" : ""} ${styleClass[line.style]}`}
            onPointerEnter={line.style === "accent" && cursorEffects ? decode : undefined}
          >
            <span className="relative inline-block">
              {Array.from(line.text).map((char, i) => (
                <span key={i} data-letter={char}>
                  {char}
                </span>
              ))}
              {line.style === "strike" && <span className="hero-strike" />}
            </span>
          </span>
        ))}
      </span>
    </h1>
  );
}
