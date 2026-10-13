import type { ReactNode } from "react";

interface SectionHeadingProps {
  id: string;
  label: string;
  title: ReactNode;
  /** Texto de apoio, exibido abaixo do título (alinhado à direita no desktop). */
  children?: ReactNode;
  labelClassName?: string;
}

/** Título gigante ocupando a largura toda, com o texto de apoio logo abaixo. */
export function SectionHeading({ id, label, title, children, labelClassName }: SectionHeadingProps) {
  return (
    <div>
      <p className={`label ${labelClassName ?? "opacity-80"}`}>{label}</p>
      <h2 id={id} className="wide mt-4 pb-[0.06em] text-giga font-[850] tracking-tight uppercase">
        {title}
      </h2>
      {children && <div className="mt-10 grid gap-6 lg:grid-cols-12">{children}</div>}
    </div>
  );
}
