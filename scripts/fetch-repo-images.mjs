// Baixa as capturas de tela que já existem dentro dos próprios repositórios.
//
// Uso: npm run fetch:repo-images
//
// - IaWorkout: não tem demonstração publicada; o repositório inclui capturas
//   reais do sistema em landing-page/src/assets/.
// - Agência: a página publicada está sem a folha de estilos (src/style/style.css
//   tem 0 bytes no repositório); o autor incluiu capturas da versão estilizada,
//   executada localmente, em src/resultado-site/.
// Os arquivos são baixados de raw.githubusercontent.com (somente leitura).

import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT = path.join(ROOT, "assets-src", "repo");
const RAW = "https://raw.githubusercontent.com/AleckDevv";

const FILES = {
  iaworkout: [
    ["IaWorkout", "landing-page/src/assets/dashboard-main.png", "dashboard"],
    ["IaWorkout", "landing-page/src/assets/showcase-ia-editor.png", "editor-ficha-ia"],
    ["IaWorkout", "landing-page/src/assets/students-list.png", "alunos"],
    ["IaWorkout", "landing-page/src/assets/showcase-financeiro.png", "matriculas"],
    ["IaWorkout", "landing-page/src/assets/showcase-dashboard.png", "dashboard-indicadores"],
    ["IaWorkout", "landing-page/src/assets/feature-ai.png", "fichas-ia"],
    ["IaWorkout", "landing-page/src/assets/mobile-home.png", "login-aluno-mobile"],
    ["IaWorkout", "landing-page/src/assets/mobile-progress.png", "portal-aluno-mobile"],
    ["IaWorkout", "landing-page/src/assets/showcase-mobile-treino.png", "treino-mobile"],
    ["IaWorkout", "landing-page/src/assets/showcase-chatbot.png", "assistente-mobile"],
    ["IaWorkout", "frontend/public/android-chrome-512x512.png", "icone"],
  ],
  agencia: [
    ["AleckDevv-projeto-agencia.github.io", "src/resultado-site/inicio.png", "autor-inicio"],
    ["AleckDevv-projeto-agencia.github.io", "src/resultado-site/servi%C3%A7os.png", "autor-servicos"],
    ["AleckDevv-projeto-agencia.github.io", "src/resultado-site/final.png", "autor-final"],
  ],
};

let failures = 0;
for (const [slug, files] of Object.entries(FILES)) {
  await mkdir(path.join(OUT, slug), { recursive: true });
  for (const [repo, file, name] of files) {
    const url = `${RAW}/${repo}/main/${file}`;
    const res = await fetch(url);
    if (!res.ok) {
      failures++;
      console.error(`  ✗ ${url} → HTTP ${res.status}`);
      continue;
    }
    const ext = path.extname(decodeURIComponent(file));
    await writeFile(path.join(OUT, slug, `${name}${ext}`), Buffer.from(await res.arrayBuffer()));
    console.log(`  ✓ ${slug}/${name}${ext}`);
  }
}
process.exitCode = failures ? 1 : 0;
