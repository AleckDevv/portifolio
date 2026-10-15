import type { CSSProperties } from "react";
import { getImage } from "../../content/images";
import type { Project, Shot } from "../../content/projects";

/** Variáveis CSS com a identidade do projeto. */
export function accentVars(project: Project): CSSProperties {
  return {
    "--accent": project.accent.color,
    "--accent-ink": project.accent.ink,
    "--accent-text": project.accent.text,
    "--accent-surface": project.accent.surface,
    "--accent-on": project.accent.onSurface,
  } as CSSProperties;
}

/** Texto da barra de endereço da moldura: domínio da demo ou origem da captura. */
export function shotAddress(project: Project, shot: Shot): string {
  if (getImage(shot.image).origin === "repo") {
    return project.slug === "agencia" ? "127.0.0.1:5500 · execução local do autor" : "captura incluída no repositório";
  }
  if (project.captureAddress) return project.captureAddress;
  if (!project.links.demo) return project.repoName;
  const url = new URL(project.links.demo.url);
  return `${url.host}${url.pathname === "/" ? "" : url.pathname}`;
}

export function kindLabel(project: Project): string {
  return project.kind === "sistema" ? "Sistema" : "Interface web";
}
