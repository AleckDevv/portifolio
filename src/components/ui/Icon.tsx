import type { SVGProps } from "react";

const paths = {
  arrow: "M4 12h15M13 6l6 6-6 6",
  "arrow-left": "M20 12H5M11 6l-6 6 6 6",
  "arrow-down": "M12 4v15M6 13l6 6 6-6",
  "arrow-up": "M12 20V5M6 11l6-6 6 6",
  "arrow-ne": "M7 17L17 7M8.5 7H17v8.5",
  check: "M5 12.5l4.5 4.5L19 7.5",
  close: "M6 6l12 12M18 6L6 18",
  menu: "M4 8h16M4 16h16",
  code: "M8 7l-5 5 5 5M16 7l5 5-5 5M13.5 4l-3 16",
  copy: "M9 9h10v10H9zM5 15V5h10",
  mail: "M3.5 6.5h17v11h-17zM4 7l8 6 8-6",
  motion: "M3 12c3-6 6-6 9 0s6 6 9 0",
} as const;

export type IconName = keyof typeof paths;

interface IconProps extends SVGProps<SVGSVGElement> {
  name: IconName;
  size?: number | string;
}

/** Ícones lineares próprios (decorativos: use junto de um texto visível). */
export function Icon({ name, size = "1em", strokeWidth = 2, ...rest }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="square"
      strokeLinejoin="miter"
      aria-hidden="true"
      focusable="false"
      {...rest}
    >
      <path d={paths[name]} />
    </svg>
  );
}
