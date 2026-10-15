import { projectsUsing } from "../../content/projects";
import { categories, technologies, type TechCategory, type TechId, type Technology } from "../../content/technologies";
import { useTechDialog } from "../stack/tech-dialog-context";
import { Breakable } from "../ui/Breakable";
import { Reveal } from "../ui/Reveal";
import { SectionHeading } from "../ui/SectionHeading";

const ORDER: TechCategory[] = ["frontend", "backend", "dados", "ferramentas", "integracoes"];

function TechTile({ id }: { id: TechId }) {
  const { openTech } = useTechDialog();
  const tech: Technology = technologies[id];
  const count = projectsUsing(id).length;
  const studying = tech.status === "estudo";
  return (
    <button
      type="button"
      aria-haspopup="dialog"
      onClick={(event) => openTech(id, event.currentTarget)}
      className={`group relative flex aspect-square w-full flex-col justify-between rounded-lg p-3 text-left transition-[transform,background-color,color] duration-300 hover:-translate-y-1 ${
        studying
          ? "border-2 border-dashed border-ink/60 hover:border-ink"
          : "border-2 border-ink bg-white hover:bg-volt hover:text-white"
      }`}
    >
      <span className="flex items-start justify-between gap-2">
        <span aria-hidden="true" className="wide text-[clamp(1.6rem,2.6vw,2.4rem)] leading-none font-[850]">
          {tech.symbol}
        </span>
        <span className="label pt-0.5 opacity-75">{studying ? "estudo" : count}</span>
      </span>
      <span className="text-[0.92rem] leading-tight font-semibold">
        <Breakable text={tech.name} />
        <span className="sr-only">
          {studying ? " — em estudo" : ` — usado em ${count} ${count === 1 ? "projeto" : "projetos"}`}. Ver detalhes.
        </span>
      </span>
    </button>
  );
}

export function StackSection() {
  const ids = Object.keys(technologies) as TechId[];
  // A legenda de "estudo" só aparece quando alguma tecnologia está nesse status.
  const hasStudying = ids.some((id) => (technologies[id] as Technology).status === "estudo");
  return (
    <section
      id="stack"
      aria-labelledby="stack-titulo"
      data-section="<section#stack>"
      data-header="light"
      className="theme-paper px-4 py-24 sm:px-8 lg:px-14 lg:py-32"
    >
      <SectionHeading id="stack-titulo" label="// 03 — tecnologias" title="Stack" labelClassName="text-ink-soft">
        <div className="space-y-4 lg:col-span-6 lg:col-start-7">
          <p className="text-lead">
            Sem barras, porcentagens ou notas: cada tecnologia mostra onde foi usada de verdade. Abra um bloco para ver a explicação e os
            projetos em que ela aparece.
          </p>
          <ul className="label flex flex-wrap gap-x-6 gap-y-2 text-ink-soft">
            <li className="flex items-center gap-2">
              <span aria-hidden="true" className="inline-block h-3.5 w-3.5 border-2 border-ink bg-white" /> usada em projetos (nº de projetos)
            </li>
            {hasStudying && (
              <li className="flex items-center gap-2">
                <span aria-hidden="true" className="inline-block h-3.5 w-3.5 border-2 border-dashed border-ink" /> aprendizado em andamento
              </li>
            )}
          </ul>
        </div>
      </SectionHeading>

      <div className="mt-16 grid gap-x-6 gap-y-12 md:grid-cols-2 xl:grid-cols-5">
        {ORDER.map((category, index) => {
          const items = ids.filter((id) => technologies[id].category === category);
          return (
            <Reveal key={category} delay={index * 90} className="flex flex-col">
              <h3 className="semiwide border-t-2 border-ink pt-4 text-xl font-[750]">{categories[category].label}</h3>
              <p className="mt-1 mb-5 text-sm text-ink-soft">{categories[category].description}</p>
              <ul className="grid grid-cols-3 gap-2.5 sm:grid-cols-4 md:grid-cols-3 xl:grid-cols-2">
                {items.map((id) => (
                  <li key={id}>
                    <TechTile id={id} />
                  </li>
                ))}
              </ul>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
