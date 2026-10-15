import { useRef, type CSSProperties } from "react";
import { getImage } from "../../content/images";
import { profile } from "../../content/profile";
import { projects } from "../../content/projects";
import { asset } from "../../content/site";
import { useBornAfterInitialRender, useIsoLayoutEffect } from "../../lib/hooks";
import { INTRO_REVEAL } from "../../lib/intro";
import { Picture } from "../media/Picture";

// Abertura do portfólio: "o portfólio se compila na sua frente".
//
// 1. Marcas de registro e a grade técnica aparecem no painel azul-noite.
// 2. As capas dos 10 projetos são distribuídas como cartas, cada uma com a
//    planta da própria interface; um letreiro passa o nome de cada projeto.
//    Ao fundo, "Problemas entram." em contorno.
// 3. A carta do topo (o projeto mais recente) é renderizada pela linha ácida,
//    e o fundo vira "Software sai.".
// 4. O painel sobe com a borda curva e entrega para o título do hero, que sobe
//    linha a linha (a continuação da abertura).
//
// Toda a sequência é CSS e começa na primeira pintura, antes do JavaScript.
// Este componente só cuida de pular (clique, tecla, rolagem ou toque) e de
// avisar o fim. Decisão de tocar: script inline de index.html (src/lib/intro.ts).

/** Animações que seguem o relógio da abertura (pular = adiantar todas juntas). */
const TIMELINE = /^(intro-|hero-line-in$|strike-in$)/;

/** Deslocamentos fixos que bagunçam o maço; a última carta (topo) fica reta. */
const DECK = [
  { x: -18, y: 10, r: -5 },
  { x: 14, y: -8, r: 4 },
  { x: -10, y: 14, r: -3 },
  { x: 20, y: -12, r: 6 },
  { x: -14, y: 6, r: -6 },
  { x: 8, y: -10, r: 3 },
  { x: -6, y: 8, r: -4 },
  { x: 12, y: -6, r: 5 },
  { x: -4, y: 4, r: -2 },
  { x: 0, y: 0, r: 0 },
];

export function Intro() {
  const ref = useRef<HTMLDivElement>(null);
  // A abertura pertence à carga da página (hidratada ou, no `npm run dev`, do zero).
  // Voltar ao início por navegação interna monta o componente de novo — aí não toca.
  const bornLater = useBornAfterInitialRender();

  useIsoLayoutEffect(() => {
    const root = document.documentElement;
    if (bornLater) {
      if (root.dataset.intro === "play") root.dataset.intro = "done";
      return;
    }
    const intro = ref.current;
    if (!intro || root.dataset.intro !== "play") return;

    let doneTimer: number | undefined;
    const exitAnimation = () => intro.getAnimations().find((a) => (a as CSSAnimation).animationName === "intro-exit");

    // Pular = adiantar o relógio de toda a sequência até o início da saída.
    const skip = () => {
      const exit = exitAnimation();
      if (!exit || exit.currentTime === null) return;
      const start = Number(exit.effect?.getTiming().delay ?? 0);
      const jump = start - Number(exit.currentTime);
      if (jump <= 0) return;
      for (const animation of document.getAnimations()) {
        const name = (animation as CSSAnimation).animationName;
        if (name && TIMELINE.test(name) && animation.currentTime !== null) {
          animation.currentTime = Number(animation.currentTime) + jump;
        }
      }
    };

    const onAnimationEnd = (event: AnimationEvent) => {
      if (event.target !== intro || event.animationName !== "intro-exit") return;
      window.dispatchEvent(new Event(INTRO_REVEAL));
      removeSkip();
      // As linhas do título terminam de subir ~1,3 s depois; então a abertura sai do DOM.
      doneTimer = window.setTimeout(() => {
        if (root.dataset.intro === "play") root.dataset.intro = "done";
      }, 1400);
    };

    const events: Array<[EventTarget, string]> = [
      [window, "keydown"],
      [window, "wheel"],
      [window, "touchstart"],
      [intro, "pointerdown"],
    ];
    const removeSkip = () => events.forEach(([target, type]) => target.removeEventListener(type, skip));
    events.forEach(([target, type]) => target.addEventListener(type, skip, { passive: true }));
    intro.addEventListener("animationend", onAnimationEnd);

    return () => {
      removeSkip();
      intro.removeEventListener("animationend", onAnimationEnd);
      window.clearTimeout(doneTimer);
    };
  }, []);

  if (bornLater) return null;

  // Do mais antigo ao mais recente: o projeto 01 fecha o maço e é renderizado.
  const deck = [...projects].reverse();
  const top = deck.at(-1)!;
  const words = profile.headline.map((line) => line.text);

  return (
    <div ref={ref} className="intro" aria-hidden="true">
      <div className="intro__grid" />

      {[
        ["tl", profile.handle],
        ["tr", profile.name],
        ["bl", `${profile.role} · ${profile.location}`],
        ["br", `Portfólio · ${projects.length} projetos`],
      ].map(([corner, text], index) => (
        <div key={corner} className={`intro__corner intro__corner--${corner}`} style={{ "--k": index } as CSSProperties}>
          <span className="intro__mark" />
          <span className="intro__label">
            <span>{text}</span>
          </span>
        </div>
      ))}

      <p className="intro__word intro__word--in">{`${words[0]} ${words[1]}`}</p>
      <p className="intro__word intro__word--out">{`${words[2]} ${words[3]}`}</p>

      <div className="intro__stack">
        {deck.map((project, index) => {
          const cover = getImage(project.shots[0]!.image);
          const offset = DECK[index] ?? DECK.at(-1)!;
          const style = {
            "--i": index,
            "--x": `${offset.x}px`,
            "--y": `${offset.y}px`,
            "--r": `${offset.r}deg`,
            ...(cover.edgesSmall ? { "--edges": `url("${asset(cover.edgesSmall)}")` } : {}),
          } as CSSProperties;
          return (
            <div key={project.slug} className="intro__card" style={style}>
              <div className="intro__bar">
                <i />
                <i />
                <i />
                <span>
                  {project.number} / {project.slug}
                </span>
              </div>
              <div className="intro__bp">
                <div className="intro__lines" />
              </div>
              {project === top && (
                <>
                  <div className="intro__render">
                    <Picture
                      id={project.shots[0]!.image}
                      alt=""
                      sizes="(min-width: 1024px) 36rem, 80vw"
                      className="h-full"
                      imgClassName="h-full w-full object-cover object-top"
                    />
                  </div>
                  <div className="intro__scan">
                    <span>
                      render ▸ {project.number} {project.name.toLowerCase()}
                    </span>
                  </div>
                </>
              )}
            </div>
          );
        })}
        <div className="intro__ticker">
          <ol>
            {deck.map((project) => (
              <li key={project.slug}>
                <b>{project.number}</b> {project.name}
              </li>
            ))}
          </ol>
        </div>
      </div>

      <p className="intro__skip">
        <span className="intro__skip-mouse">Clique ou tecle para pular</span>
        <span className="intro__skip-touch">Toque para pular</span>
      </p>
      <div className="intro__curve" />
    </div>
  );
}
