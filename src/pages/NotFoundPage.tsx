import { useLocation } from "react-router";
import { Icon } from "../components/ui/Icon";
import { useMounted } from "../lib/hooks";
import { TransitionLink } from "../lib/transition";
import { useSeo } from "../lib/useSeo";

export function NotFoundPage() {
  const location = useLocation();
  const mounted = useMounted();
  useSeo("/404");
  return (
    <section
      aria-labelledby="erro-titulo"
      data-header="dark"
      data-section="<section#404>"
      className="theme-volt relative flex min-h-svh flex-col justify-center overflow-hidden px-4 pt-24 pb-16 sm:px-8 lg:px-14"
    >
      <p className="label text-acid">erro 404 · rota não encontrada</p>
      <h1 id="erro-titulo" className="wide mt-4 text-[clamp(6rem,30vw,22rem)] leading-[0.8] font-[850]">
        404
        <span className="sr-only"> — página não encontrada</span>
      </h1>
      <p className="text-lead mt-8 max-w-xl text-white">
        Esta rota não compilou. O endereço que você abriu não existe — mas os nove projetos continuam no lugar.
      </p>
      <div className="mt-10 flex flex-wrap gap-3">
        <TransitionLink to="/" label="Início" className="btn btn-acid">
          <Icon name="arrow-left" /> Voltar ao início
        </TransitionLink>
        <TransitionLink to="/#projetos" label="Projetos" className="btn border-white text-white hover:bg-white hover:text-volt">
          Ver os projetos <Icon name="arrow" />
        </TransitionLink>
      </div>
      <pre aria-hidden="true" className="mt-14 overflow-x-auto font-mono text-xs leading-relaxed text-acid">
        {`GET ${mounted ? location.pathname : "/…"}  →  404 Not Found\nat Router (rotas: /, /projetos/:slug)`}
      </pre>
    </section>
  );
}
