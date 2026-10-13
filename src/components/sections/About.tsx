import { profile } from "../../content/profile";
import { Icon } from "../ui/Icon";
import { Reveal } from "../ui/Reveal";
import { SectionHeading } from "../ui/SectionHeading";

export function About() {
  const { about, education, goals } = profile;
  return (
    <section
      id="sobre"
      aria-labelledby="sobre-titulo"
      data-section="<section#sobre>"
      data-header="dark"
      className="theme-volt relative overflow-hidden px-4 py-24 sm:px-8 lg:px-14 lg:py-32"
    >
      {/* Composição geométrica decorativa */}
      <div aria-hidden="true" className="pointer-events-none absolute -top-24 -right-24 hidden h-[26rem] w-[26rem] lg:block">
        <span className="absolute inset-0 rounded-full border-2 border-white/25" />
        <span className="absolute inset-[18%] rounded-full border-2 border-white/25" />
        <span className="absolute top-1/2 left-0 h-[2px] w-full bg-white/25" />
        <span className="absolute top-[30%] left-[30%] h-10 w-10 bg-acid" />
      </div>

      <SectionHeading id="sobre-titulo" label="// 04 — sobre" title="Sobre" labelClassName="text-white/90" />
      <div className="mt-12 grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <dl className="grid grid-cols-2 gap-6 border-t border-white/30 pt-6">
            <div>
              <dt className="label text-white/90">Nome</dt>
              <dd className="mt-1 font-semibold">{profile.name}</dd>
            </div>
            <div>
              <dt className="label text-white/90">No GitHub</dt>
              <dd className="mt-1 font-semibold">{profile.handle}</dd>
            </div>
            <div>
              <dt className="label text-white/90">Atuação</dt>
              <dd className="mt-1 font-semibold">{profile.role}</dd>
            </div>
            <div>
              <dt className="label text-white/90">Base</dt>
              <dd className="mt-1 font-semibold">{profile.location}</dd>
            </div>
          </dl>
        </div>

        <div className="lg:col-span-7 lg:col-start-6">
          <Reveal>
            <p className="semiwide text-[clamp(1.6rem,3vw,2.6rem)] leading-[1.12] font-[700]">{about.lead}</p>
          </Reveal>
          <div className="mt-8 max-w-2xl space-y-5 text-lg text-white">
            {about.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>

          <div className="mt-12 grid gap-10 md:grid-cols-2">
            <div>
              <h3 className="label mb-4 text-acid">Foco</h3>
              <ul className="space-y-3">
                {about.focus.map((item) => (
                  <li key={item} className="flex gap-3">
                    <span aria-hidden="true" className="mt-2 h-2.5 w-2.5 shrink-0 bg-acid" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="label mb-4 text-acid">Objetivos</h3>
              <ul className="space-y-3">
                {goals.map((goal) => (
                  <li key={goal} className="flex gap-3">
                    <Icon name="arrow" className="mt-1 shrink-0 text-acid" />
                    <span>{goal}</span>
                  </li>
                ))}
              </ul>
            </div>
            {education.length > 0 && (
              <div className="md:col-span-2">
                <h3 className="label mb-4 text-acid">Formação</h3>
                <ul className="divide-y divide-white/20 border-y border-white/20">
                  {education.map((item) => (
                    <li key={`${item.course}-${item.institution}`} className="flex flex-wrap justify-between gap-2 py-3">
                      <span className="font-semibold">
                        {item.course} <span className="font-normal text-white/80">— {item.institution}</span>
                      </span>
                      <span className="label text-white/80">
                        {item.period}
                        {item.status ? ` · ${item.status}` : ""}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
