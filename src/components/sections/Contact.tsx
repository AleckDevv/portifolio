import { useEffect, useRef, useState } from "react";
import { profile } from "../../content/profile";
import { Icon } from "../ui/Icon";

function CopyEmail({ email }: { email: string }) {
  const [status, setStatus] = useState<"idle" | "copied" | "failed">("idle");
  const timer = useRef<number | null>(null);

  useEffect(() => () => {
    if (timer.current) window.clearTimeout(timer.current);
  }, []);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setStatus("copied");
    } catch {
      setStatus("failed");
    }
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setStatus("idle"), 2800);
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      <button type="button" onClick={copy} className="btn btn-ink">
        <Icon name={status === "copied" ? "check" : "copy"} /> {status === "copied" ? "E-mail copiado" : "Copiar e-mail"}
      </button>
      <p role="status" className="text-sm font-semibold">
        {status === "failed" ? "Não foi possível copiar automaticamente — use o link do e-mail acima." : ""}
      </p>
    </div>
  );
}

export function Contact() {
  const { contact } = profile;
  return (
    <section
      id="contato"
      aria-labelledby="contato-titulo"
      data-section="<section#contato>"
      data-header="light"
      className="theme-orange relative overflow-hidden px-4 py-24 sm:px-8 lg:px-14 lg:py-36"
    >
      <p className="label">// 05 — contato</p>
      <h2 id="contato-titulo" className="mt-6 text-[clamp(2.1rem,8.6vw,9rem)] leading-[0.86] font-[850] tracking-tight uppercase">
        <span className="block">Tem um problema?</span>
        <span className="block md:wide">Vamos transformar em software.</span>
      </h2>

      <div className="mt-14 grid gap-12 lg:grid-cols-12 lg:items-end">
        <div className="lg:col-span-7">
          <p className="label mb-3">E-mail</p>
          <a
            href={`mailto:${contact.email}`}
            className="semiwide block text-[clamp(1.25rem,3.4vw,2.6rem)] leading-tight font-[750] break-all underline decoration-2 underline-offset-[0.18em] hover:decoration-[0.12em]"
          >
            {contact.email}
          </a>
          <div className="mt-6">
            <CopyEmail email={contact.email} />
          </div>
        </div>
        <ul className="space-y-3 lg:col-span-5">
          {[
            { label: "GitHub", detail: "github.com/AleckDevv", href: contact.github },
            { label: "LinkedIn", detail: "Alex Soares Lopes", href: contact.linkedin },
          ].map((item) => (
            <li key={item.label}>
              <a
                href={item.href}
                target="_blank"
                rel="noreferrer"
                className="group flex items-center justify-between gap-4 border-b-2 border-ink py-4 no-underline"
              >
                <span>
                  <span className="wide block text-3xl font-[850] uppercase">{item.label}</span>
                  <span className="label">{item.detail}</span>
                </span>
                <Icon name="arrow-ne" size={36} className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
                <span className="sr-only">(abre em nova aba)</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
