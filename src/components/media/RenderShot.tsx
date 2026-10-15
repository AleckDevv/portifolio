import { useEffect, useRef, useState, type CSSProperties, type PointerEvent } from "react";
import { getImage, type ImageId } from "../../content/images";
import { asset } from "../../content/site";
import { useIsoLayoutEffect, useMounted } from "../../lib/hooks";
import { useCursorEffects, usePrefs } from "../../lib/prefs-store";
import { Picture } from "./Picture";

// "Do código à tela": a captura chega primeiro como planta (os contornos da
// própria interface, gerados no build por scripts/optimize-images.mjs) e uma
// linha de renderização percorre a moldura pintando a tela real. Depois, com
// o mouse, uma lente de raio-x mostra a planta por baixo da tela e a moldura
// inclina na direção do cursor.
//
// O HTML pré-renderizado mostra só a imagem. A animação só é armada para telas
// que ainda estão fora da área visível na hidratação, e fica desligada com
// movimento reduzido ou em dispositivos limitados.

type Phase = "static" | "armed" | "render" | "replay" | "done";

interface RenderShotProps {
  id: ImageId;
  alt: string;
  sizes: string;
  priority?: boolean;
  className?: string;
  imgClassName?: string;
  /** "cover-top": a imagem preenche a caixa (object-cover no topo) e a planta acompanha. */
  fit?: "natural" | "cover-top";
  /** Quando passa a verdadeiro (ex.: aba selecionada), a tela é renderizada de novo, em versão curta. */
  replay?: boolean;
  /** Lente de raio-x ao passar o mouse (padrão: ligada). */
  xray?: boolean;
}

const DURATION: Record<"render" | "replay", number> = { render: 2200, replay: 1000 };
/** Inclinação máxima (graus) por tipo de moldura. */
const TILT: Record<string, number> = { browser: 4, phone: 9 };

function preload(url: string, timeout: number): Promise<void> {
  return new Promise((resolve) => {
    const image = new Image();
    image.onload = image.onerror = () => resolve();
    image.src = url;
    setTimeout(resolve, timeout);
  });
}

/** Espera a imagem estar decodificada (pronta para pintar), com limite de tempo. */
function decoded(img: HTMLImageElement | null, timeout: number): Promise<void> {
  if (!img) return Promise.resolve();
  return Promise.race([img.decode().catch(() => {}), new Promise<void>((resolve) => setTimeout(resolve, timeout))]);
}

export function RenderShot({
  id,
  alt,
  sizes,
  priority,
  className,
  imgClassName,
  fit = "natural",
  replay,
  xray = true,
}: RenderShotProps) {
  const ref = useRef<HTMLDivElement>(null);
  const frame = useRef<number | null>(null);
  const { reduceMotion, lite } = usePrefs();
  const cursorEffects = useCursorEffects();
  const mounted = useMounted();
  // true quando o componente nasce depois da hidratação (ex.: aba aberta pela primeira vez).
  const [bornAfterHydration] = useState(mounted);
  const [phase, setPhase] = useState<Phase>("static");
  // A planta só é baixada quando a tela se aproxima (ou com o mouse sobre ela).
  const [near, setNear] = useState(false);

  const image = getImage(id);
  const edges = image.edges ? asset(image.edges) : null;
  const motion = !reduceMotion && !lite && edges !== null;
  // As preferências reais chegam logo após a hidratação; os observadores consultam o valor atual.
  const motionRef = useRef(motion);
  useEffect(() => {
    motionRef.current = motion;
  });

  // Arma a renderização para telas que ainda não apareceram.
  useIsoLayoutEffect(() => {
    const element = ref.current;
    if (!element || !motion || !("IntersectionObserver" in window)) return;
    if (element.getBoundingClientRect().top < window.innerHeight * 0.9) return;
    setPhase("armed");

    const nearby = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setNear(true);
          // Começa a baixar a tela antes de ela aparecer, para a varredura já pintar a imagem.
          const img = element.querySelector("img");
          if (img) img.loading = "eager";
          nearby.disconnect();
        }
      },
      { rootMargin: "75% 0px 75% 0px" },
    );
    let timer: number | undefined;
    const visible = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        visible.disconnect();
        if (!motionRef.current) return setPhase("static");
        setNear(true);
        Promise.all([preload(edges!, 900), decoded(element.querySelector("img"), 1600)]).then(() => {
          setPhase("render");
          timer = window.setTimeout(() => setPhase("done"), DURATION.render);
        });
      },
      { threshold: 0.3 },
    );
    nearby.observe(element);
    visible.observe(element);
    return () => {
      nearby.disconnect();
      visible.disconnect();
      window.clearTimeout(timer);
    };
  }, []);

  // Preferência alterada para movimento reduzido: mostra a tela pronta.
  useEffect(() => {
    if (motion) return;
    const raf = requestAnimationFrame(() => setPhase("static"));
    return () => cancelAnimationFrame(raf);
  }, [motion]);

  // Nova renderização curta quando `replay` passa a verdadeiro.
  const firstReplay = useRef(true);
  useEffect(() => {
    const first = firstReplay.current;
    firstReplay.current = false;
    if (!replay || !motion || (first && !bornAfterHydration)) return;
    let timer: number | undefined;
    const raf = requestAnimationFrame(() => {
      setNear(true);
      setPhase("replay");
      timer = window.setTimeout(() => setPhase("done"), DURATION.replay);
    });
    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(timer);
    };
  }, [replay]); // eslint-disable-line react-hooks/exhaustive-deps

  const lensEnabled = xray && cursorEffects && edges !== null;

  function tiltTarget() {
    return ref.current?.closest<HTMLElement>("[data-tilt]") ?? null;
  }

  function onPointerEnter() {
    if (!cursorEffects) return;
    if (lensEnabled) setNear(true);
    tiltTarget()?.setAttribute("data-hover", "");
  }

  function onPointerMove(event: PointerEvent<HTMLDivElement>) {
    if (!cursorEffects || frame.current !== null) return;
    const { clientX, clientY } = event;
    frame.current = requestAnimationFrame(() => {
      frame.current = null;
      const element = ref.current;
      if (!element) return;
      const rect = element.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;
      const busy = element.dataset.render === "armed" || element.dataset.render === "render";
      if (lensEnabled && !busy) {
        element.style.setProperty("--lx", `${x.toFixed(1)}px`);
        element.style.setProperty("--ly", `${y.toFixed(1)}px`);
        element.dataset.xray = "on";
      }
      const target = tiltTarget();
      if (target) {
        const max = TILT[target.dataset.tilt ?? ""] ?? 4;
        const box = target.getBoundingClientRect();
        const px = (clientX - box.left) / box.width - 0.5;
        const py = (clientY - box.top) / box.height - 0.5;
        target.style.setProperty("--ry", `${(px * max * 2).toFixed(2)}deg`);
        target.style.setProperty("--rx", `${(-py * max * 2).toFixed(2)}deg`);
        target.style.setProperty("--gx", `${((px + 0.5) * 100).toFixed(1)}%`);
        target.style.setProperty("--gy", `${((py + 0.5) * 100).toFixed(1)}%`);
      }
    });
  }

  function onPointerLeave() {
    if (frame.current !== null) cancelAnimationFrame(frame.current);
    frame.current = null;
    if (ref.current) delete ref.current.dataset.xray;
    const target = tiltTarget();
    if (target) {
      target.removeAttribute("data-hover");
      for (const name of ["--rx", "--ry", "--gx", "--gy"]) target.style.removeProperty(name);
    }
  }

  const style = near && edges ? ({ "--edges": `url("${edges}")` } as CSSProperties) : undefined;

  return (
    <div
      ref={ref}
      className={`render ${className ?? ""}`}
      data-render={phase}
      data-fit={fit}
      style={style}
      onPointerEnter={onPointerEnter}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
    >
      <Picture id={id} alt={alt} sizes={sizes} priority={priority} className="render__img" imgClassName={imgClassName} />
      {edges && (
        <>
          <div aria-hidden="true" className="render__bp">
            <div className="render__draw">
              <div className="render__lines" />
            </div>
          </div>
          <div aria-hidden="true" className="render__scan">
            <span className="render__tag">render ▸ {id}</span>
          </div>
          {lensEnabled && (
            <>
              <div aria-hidden="true" className="render__xray">
                <div className="render__lines" />
              </div>
              <span aria-hidden="true" className="render__ring">
                <span>raio-x</span>
              </span>
            </>
          )}
        </>
      )}
    </div>
  );
}
