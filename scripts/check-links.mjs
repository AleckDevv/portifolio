// Confere todos os links externos do portfólio (repositórios, demonstrações e contatos).
//
// Uso: npm run check:links
// Sai com erro se algum repositório ou demonstração não responder com sucesso.
// O LinkedIn bloqueia acessos automatizados (status 999): é reportado como aviso.

import { profile } from "../src/content/profile.ts";
import { projects } from "../src/content/projects.ts";

const links = [
  ...projects.flatMap((p) => [
    // Repositório privado não tem link público para conferir.
    ...(p.links.repo ? [{ label: `${p.number} ${p.name} — repositório`, url: p.links.repo, required: true }] : []),
    ...(p.links.demo ? [{ label: `${p.number} ${p.name} — demonstração`, url: p.links.demo.url, required: true }] : []),
  ]),
  { label: "Perfil no GitHub", url: profile.contact.github, required: true },
  { label: "LinkedIn", url: profile.contact.linkedin, required: false },
];

async function check(url) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 20_000);
  try {
    const response = await fetch(url, {
      redirect: "follow",
      signal: controller.signal,
      headers: { "User-Agent": "Mozilla/5.0 (verificador de links do portfólio)" },
    });
    return { status: response.status, ok: response.ok };
  } catch (error) {
    return { status: 0, ok: false, error: error.message };
  } finally {
    clearTimeout(timer);
  }
}

let failures = 0;
const results = await Promise.all(links.map(async (link) => ({ ...link, ...(await check(link.url)) })));
for (const result of results) {
  const blocked = result.status === 999;
  const mark = result.ok ? "✓" : blocked ? "!" : "✗";
  const note = blocked ? " (bloqueia robôs — confira manualmente)" : result.error ? ` (${result.error})` : "";
  console.log(`${mark} ${String(result.status).padEnd(3)} ${result.label}\n      ${result.url}${note}`);
  if (!result.ok && result.required) failures++;
}
console.log(failures ? `\n${failures} link(s) com problema.` : `\nTodos os ${results.length} links obrigatórios responderam.`);
process.exitCode = failures ? 1 : 0;
