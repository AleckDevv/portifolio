import type { CSSProperties, ReactNode } from "react";
import type { Shot } from "../../content/projects";
import { RenderShot } from "./RenderShot";

// Cada moldura fica num "palco" com perspectiva: a moldura sobe em 3D durante a
// rolagem e inclina na direção do cursor (data-tilt, controlado por RenderShot).

interface BrowserFrameProps {
  /** Texto da barra de endereço (ex.: domínio da demo). */
  address: string;
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}

export function BrowserFrame({ address, children, className, style }: BrowserFrameProps) {
  return (
    <div className={`frame-stage ${className ?? ""}`} style={style}>
      <div className="frame-browser" data-tilt="browser">
        <div className="frame-browser__bar" aria-hidden="true">
          <span className="frame-browser__dot" />
          <span className="frame-browser__dot" />
          <span className="frame-browser__dot" />
          <span className="ml-2 min-w-0 truncate font-mono text-[0.62rem] tracking-wide opacity-70">{address}</span>
        </div>
        {children}
      </div>
    </div>
  );
}

export function PhoneFrame({ children, className, style }: { children: ReactNode; className?: string; style?: CSSProperties }) {
  return (
    <div className={`frame-stage ${className ?? ""}`} style={style}>
      <div className="frame-phone" data-tilt="phone">
        <div>{children}</div>
      </div>
    </div>
  );
}

/** Moldura de "HUD" de jogo, usada no CyborgGames. */
export function HudFrame({ children, labels, className }: { children: ReactNode; labels: [string, string]; className?: string }) {
  const corner = "absolute h-7 w-7 border-(--accent)";
  return (
    <div className={`relative p-3 sm:p-5 ${className ?? ""}`}>
      <span aria-hidden="true" className={`${corner} top-0 left-0 border-t-[3px] border-l-[3px]`} />
      <span aria-hidden="true" className={`${corner} top-0 right-0 border-t-[3px] border-r-[3px]`} />
      <span aria-hidden="true" className={`${corner} bottom-0 left-0 border-b-[3px] border-l-[3px]`} />
      <span aria-hidden="true" className={`${corner} right-0 bottom-0 border-r-[3px] border-b-[3px]`} />
      <div aria-hidden="true" className="label mb-2 flex justify-between gap-4 opacity-80">
        <span>
          <span className="mr-1.5 inline-block h-2 w-2 rounded-full bg-(--accent) align-middle" />
          {labels[0]}
        </span>
        <span>{labels[1]}</span>
      </div>
      {children}
    </div>
  );
}

interface ShotViewProps {
  shot: Shot;
  sizes: string;
  /** Endereço exibido na moldura de navegador. */
  address: string;
  priority?: boolean;
  showCaption?: boolean;
  className?: string;
  frameClassName?: string;
}

/** Captura dentro da moldura adequada ao dispositivo, com legenda. */
export function ShotView({ shot, sizes, address, priority, showCaption = true, className, frameClassName }: ShotViewProps) {
  const picture = <RenderShot id={shot.image} alt={shot.alt} sizes={sizes} priority={priority} />;
  return (
    <figure className={className}>
      {shot.device === "mobile" ? (
        <PhoneFrame className={frameClassName}>{picture}</PhoneFrame>
      ) : (
        <BrowserFrame address={address} className={frameClassName}>
          {picture}
        </BrowserFrame>
      )}
      {showCaption && <figcaption className="label mt-3 opacity-80">{shot.caption}</figcaption>}
    </figure>
  );
}
