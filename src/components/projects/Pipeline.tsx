import { useRef } from "react";
import type { PipelineStep } from "../../content/projects";
import { usePrefs } from "../../lib/prefs-store";
import { useInViewOnce } from "../../lib/useParallax";

/**
 * Diagrama do fluxo de geração da ficha no IaWorkout (conferido no código).
 * Lista ordenada: a leitura linear funciona igual com ou sem animação.
 */
export function Pipeline({ steps, title }: { steps: PipelineStep[]; title: string }) {
  const ref = useRef<HTMLOListElement>(null);
  const seen = useInViewOnce(ref);
  const { reduceMotion } = usePrefs();
  const drawn = seen || reduceMotion;

  return (
    <figure>
      <figcaption className="label mb-5 opacity-80">{title}</figcaption>
      <ol ref={ref} className="relative grid gap-3 md:grid-cols-5 md:gap-0">
        {/* Linha conectora que se desenha ao entrar na tela */}
        <span
          aria-hidden="true"
          className="absolute top-[1.15rem] left-[1.15rem] hidden h-[2px] origin-left bg-(--accent) transition-transform duration-[1400ms] ease-(--ease-out-expo) md:block"
          style={{ right: "calc(20% - 1.15rem)", transform: `scaleX(${drawn ? 1 : 0})` }}
        />
        <span aria-hidden="true" className="absolute top-2 bottom-2 left-[1.15rem] w-[2px] bg-(--accent) md:hidden" />
        {steps.map((step, index) => (
          <li key={step.title} className="relative grid grid-cols-[2.3rem_1fr] gap-3 md:block md:pr-5">
            <span
              aria-hidden="true"
              className="relative z-10 grid h-[2.3rem] w-[2.3rem] place-items-center rounded-full border-2 border-(--accent) bg-(--accent-surface) font-mono text-xs font-bold"
            >
              {index + 1}
            </span>
            <div className="pb-4 md:mt-4 md:pb-0">
              <p className="semiwide font-[750]">{step.title}</p>
              <p className="mt-1 text-sm opacity-80">{step.detail}</p>
            </div>
          </li>
        ))}
      </ol>
    </figure>
  );
}
