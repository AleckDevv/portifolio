import type { ReactNode } from "react";
import type { Project } from "../../content/projects";
import { getTech, type TechId } from "../../content/technologies";
import { monthYear, shortDate, year } from "../../lib/format";
import { TransitionLink } from "../../lib/transition";
import { useTechDialog } from "../stack/tech-dialog-context";
import { Breakable } from "../ui/Breakable";
import { Icon } from "../ui/Icon";
import { kindLabel } from "./project-utils";

export function ProjectMeta({ project, className }: { project: Project; className?: string }) {
  return (
    <p className={`label flex flex-wrap items-center gap-x-3 gap-y-1 ${className ?? ""}`}>
      <span className="rounded-full bg-(--accent) px-2 py-0.5 font-bold text-(--accent-ink)">
        {project.number}
      </span>
      <span>{kindLabel(project)}</span>
      <span aria-hidden="true">/</span>
      <span>{year(project.createdAt)}</span>
    </p>
  );
}

interface ProjectTitleProps {
  project: Project;
  as?: "h1" | "h2" | "h3";
  /** "xl": colunas largas · "md": colunas estreitas (nomes longos não estouram). */
  size?: "xl" | "md";
  className?: string;
}

const TITLE_SIZES = {
  xl: "text-display md:wide",
  md: "text-[clamp(2.1rem,3.8vw,4rem)] leading-[0.92]",
} as const;

export function ProjectTitle({ project, as: Tag = "h3", size = "xl", className }: ProjectTitleProps) {
  return (
    <Tag
      id={`${project.slug}-title`}
      className={`${TITLE_SIZES[size]} font-[850] tracking-tight break-words uppercase ${className ?? ""}`}
    >
      <Breakable text={project.name} />
    </Tag>
  );
}

export function TechChips({ project, className, max }: { project: Project; className?: string; max?: number }) {
  const { openTech } = useTechDialog();
  const items = project.stack.filter((item) => item.id !== "git" && item.id !== "github").slice(0, max);
  return (
    <ul aria-label="Tecnologias" className={`flex flex-wrap gap-2 ${className ?? ""}`}>
      {items.map((item) => (
        <li key={item.id}>
          <button
            type="button"
            className="chip transition-colors hover:bg-(--accent) hover:text-(--accent-ink) hover:border-transparent"
            onClick={(event) => openTech(item.id as TechId, event.currentTarget)}
            aria-haspopup="dialog"
          >
            {getTech(item.id).name}
          </button>
        </li>
      ))}
    </ul>
  );
}

export function FeatureList({ project, max, className }: { project: Project; max?: number; className?: string }) {
  const items = project.features.slice(0, max);
  return (
    <ul className={`space-y-3 ${className ?? ""}`}>
      {items.map((feature, index) => (
        <li key={feature} className="grid grid-cols-[2.2rem_1fr] gap-2">
          <span aria-hidden="true" className="label pt-1 text-(--accent-text)">
            {String(index + 1).padStart(2, "0")}
          </span>
          <span>{feature}</span>
        </li>
      ))}
    </ul>
  );
}

interface ProjectLinksProps {
  project: Project;
  showCaseStudy?: boolean;
  className?: string;
  /** Classe dos botões principais (varia conforme o fundo). */
  tone?: "dark" | "light";
}

export function ProjectLinks({ project, showCaseStudy = true, className, tone = "light" }: ProjectLinksProps) {
  const primary = tone === "dark" ? "btn btn-acid" : "btn btn-ink";
  return (
    <div className={className}>
      <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
        {showCaseStudy && (
          <TransitionLink to={`/projetos/${project.slug}/`} label={project.name} className={primary}>
            Estudo de caso <Icon name="arrow" />
          </TransitionLink>
        )}
        {project.links.repo ? (
          <a href={project.links.repo} target="_blank" rel="noreferrer" className="arrow-link">
            Repositório <Icon name="arrow-ne" className="arrow arrow-ne" />
            <span className="sr-only">no GitHub (abre em nova aba)</span>
          </a>
        ) : (
          <span className="label opacity-80">Repositório privado</span>
        )}
        {project.links.demo ? (
          <a href={project.links.demo.url} target="_blank" rel="noreferrer" className="arrow-link">
            Demonstração <Icon name="arrow-ne" className="arrow arrow-ne" />
            <span className="sr-only">em {project.links.demo.host} (abre em nova aba)</span>
          </a>
        ) : (
          <span className="label opacity-80">Sem demonstração publicada</span>
        )}
      </div>
      {project.links.demo?.note && <p className="mt-3 text-sm opacity-80">{project.links.demo.note}</p>}
      {project.links.privateRepo && <p className="mt-3 text-sm opacity-80">{project.links.privateRepo}</p>}
    </div>
  );
}

/** Ficha técnica compacta — aparece só no modo técnico. */
export function TechSheetCompact({ project, className }: { project: Project; className?: string }) {
  return (
    <div className={`tech-only ${className ?? ""}`}>
      <dl className="grid gap-x-6 gap-y-3 rounded-xl border border-dashed border-cyan bg-ink p-4 font-mono text-[0.72rem] leading-relaxed text-paper sm:grid-cols-2">
        <SheetItem label="repo">
          {project.repoName}
          {project.links.privateRepo && " (privado)"}
        </SheetItem>
        <SheetItem label={project.links.repo ? "criado em" : "primeiro commit"}>{shortDate(project.createdAt)}</SheetItem>
        <SheetItem label={project.links.repo ? "linguagens (GitHub)" : "linguagens"}>{project.sheet.languages.join(" · ")}</SheetItem>
        <SheetItem label="deploy">{project.sheet.deploy}</SheetItem>
        <SheetItem label="persistência" wide>
          {project.sheet.persistence}
        </SheetItem>
      </dl>
    </div>
  );
}

function SheetItem({ label, children, wide }: { label: string; children: ReactNode; wide?: boolean }) {
  return (
    <div className={wide ? "sm:col-span-2" : ""}>
      <dt className="text-cyan" style={{ fontStretch: "87.5%" }}>
        {label}
      </dt>
      <dd style={{ fontStretch: "87.5%" }}>{children}</dd>
    </div>
  );
}

/** Ficha técnica completa (página do projeto). */
export function TechSheetFull({ project }: { project: Project }) {
  const { sheet } = project;
  return (
    <dl className="grid gap-8 md:grid-cols-2">
      <div>
        <dt className="label mb-2 text-ink-soft">
          {project.links.repo ? "Linguagens detectadas pelo GitHub" : "Linguagens do código-fonte"}
        </dt>
        <dd className="font-semibold">{sheet.languages.join(" · ")}</dd>
      </div>
      <div>
        <dt className="label mb-2 text-ink-soft">{project.links.repo ? "Repositório criado em" : "Primeiro commit em"}</dt>
        <dd className="font-semibold">
          {shortDate(project.createdAt)} <span className="text-ink-soft">({monthYear(project.createdAt)})</span>
        </dd>
      </div>
      <div>
        <dt className="label mb-2 text-ink-soft">Persistência de dados</dt>
        <dd>{sheet.persistence}</dd>
      </div>
      <div>
        <dt className="label mb-2 text-ink-soft">Publicação</dt>
        <dd>{sheet.deploy}</dd>
      </div>
      <div className="md:col-span-2">
        <dt className="label mb-2 text-ink-soft">Arquitetura</dt>
        <dd>
          <ul className="list-disc space-y-1.5 pl-5">
            {sheet.architecture.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </dd>
      </div>
      {sheet.files && (
        <div className="md:col-span-2">
          <dt className="label mb-2 text-ink-soft">Arquivos-chave</dt>
          <dd className="flex flex-wrap gap-2">
            {sheet.files.map((file) => (
              <code key={file} className="max-w-full rounded bg-ink px-2 py-1 font-mono text-[0.72rem] break-all text-paper">
                {file}
              </code>
            ))}
          </dd>
        </div>
      )}
    </dl>
  );
}
