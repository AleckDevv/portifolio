import { profile } from "../../content/profile";
import { Icon } from "../ui/Icon";
import { SECTIONS } from "../../content/sections";
import { SectionLink } from "./NavLinks";
import { MotionControl, TechToggle } from "./SiteHeader";

// Ano calculado uma vez (no build para o HTML estático; na carga no navegador).
const YEAR = new Date().getFullYear();

export function SiteFooter() {
  return (
    <footer data-header="dark" data-section="<footer>" className="theme-ink overflow-hidden px-4 pt-16 pb-8 sm:px-8 lg:px-14">
      <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-12">
        <nav aria-label="Rodapé" className="lg:col-span-3">
          <p className="label mb-4 text-paper/70">Navegação</p>
          <ul className="space-y-2 text-lg font-semibold">
            <li>
              <SectionLink id="inicio" label="Início" className="arrow-link" />
            </li>
            {SECTIONS.map((section) => (
              <li key={section.id}>
                <SectionLink id={section.id} label={section.label} className="arrow-link" />
              </li>
            ))}
          </ul>
        </nav>

        <div className="lg:col-span-4">
          <p className="label mb-4 text-paper/70">Contato</p>
          <ul className="space-y-2 text-lg font-semibold">
            <li>
              <a href={`mailto:${profile.contact.email}`} className="arrow-link break-all">
                {profile.contact.email}
              </a>
            </li>
            <li>
              <a href={profile.contact.github} target="_blank" rel="noreferrer" className="arrow-link">
                GitHub <Icon name="arrow-ne" className="arrow arrow-ne" />
                <span className="sr-only">(abre em nova aba)</span>
              </a>
            </li>
            <li>
              <a href={profile.contact.linkedin} target="_blank" rel="noreferrer" className="arrow-link">
                LinkedIn <Icon name="arrow-ne" className="arrow arrow-ne" />
                <span className="sr-only">(abre em nova aba)</span>
              </a>
            </li>
          </ul>
        </div>

        <div className="space-y-6 md:col-span-2 lg:col-span-5">
          <p className="label text-paper/70">Preferências deste navegador</p>
          <TechToggle showLabel />
          <MotionControl />
          <p className="max-w-md text-sm text-paper/75">
            Feito com React, TypeScript e Tailwind CSS. Páginas pré-renderizadas, imagens em AVIF/WebP e nenhuma barra de progresso.
          </p>
        </div>
      </div>

      <p aria-hidden="true" className="wide mt-16 text-[clamp(2.2rem,12.4vw,15rem)] leading-[0.8] font-[850] tracking-tight text-paper uppercase select-none">
        {profile.handle}
      </p>

      <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-paper/20 pt-6 text-sm text-paper/75">
        <p>
          © <span suppressHydrationWarning>{YEAR}</span> {profile.name}
        </p>
        <a href="#conteudo" className="arrow-link">
          Voltar ao topo <Icon name="arrow-up" className="arrow" />
        </a>
      </div>
    </footer>
  );
}
