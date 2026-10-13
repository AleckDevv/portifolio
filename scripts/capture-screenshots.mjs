// Captura telas reais dos projetos a partir das demonstrações publicadas.
//
// Uso:  npm run capture            (todos os projetos)
//       npm run capture -- vieira  (apenas um projeto, pelo slug)
//
// As imagens brutas (PNG) vão para assets-src/captures/<slug>/ e depois são
// otimizadas por scripts/optimize-images.mjs. Nenhum repositório original é
// alterado: as capturas são feitas nas páginas públicas (Vercel / GitHub Pages).
// Usa o Google Chrome instalado na máquina (channel: "chrome").

import { chromium } from "@playwright/test";
import { mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT = path.join(ROOT, "assets-src", "captures");

const DESKTOP = { viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 };
const MOBILE = {
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 3,
  isMobile: true,
  hasTouch: true,
};

const wait = (ms) => new Promise((r) => setTimeout(r, ms));

async function settle(page, ms = 800) {
  await page.evaluate(() => document.fonts?.ready);
  await page.waitForLoadState("networkidle").catch(() => {});
  await wait(ms);
}

/** Rola a página inteira devagar para disparar animações "whileInView". */
async function scrollThrough(page) {
  await page.evaluate(async () => {
    const step = Math.round(window.innerHeight * 0.6);
    for (let y = 0; y < document.body.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 180));
    }
    window.scrollTo(0, 0);
  });
  await wait(600);
}

async function shot(page, slug, name, opts = {}) {
  const dir = path.join(OUT, slug);
  await mkdir(dir, { recursive: true });
  const file = path.join(dir, `${name}.png`);
  if (opts.element) {
    await page.locator(opts.element).first().screenshot({ path: file, animations: "disabled" });
  } else {
    await page.screenshot({ path: file, fullPage: !!opts.fullPage, animations: "disabled" });
  }
  console.log(`  ✓ ${slug}/${name}.png`);
}

// ---------------------------------------------------------------------------
// Projetos
// ---------------------------------------------------------------------------

const VIEIRA_URL = "https://sistemaprototipovieira.vercel.app/";
const VIEIRA_PAGES = [
  "dashboard",
  "veiculos",
  "manutencao",
  "compras",
  "estoque",
  "pecas",
  "abastecimento",
  "despesas",
  "relatorios",
  "usuarios",
];

async function vieira(browser) {
  const ctx = await browser.newContext({ ...DESKTOP, colorScheme: "light", locale: "pt-BR" });
  const page = await ctx.newPage();
  for (const id of VIEIRA_PAGES) {
    await page.goto(`${VIEIRA_URL}#/${id}`);
    await page.waitForFunction(() => document.getElementById("titulo-pagina")?.textContent?.trim());
    await settle(page, 900);
    await shot(page, "vieira", id);
  }
  // Detalhe de uma solicitação de compra (rota com identificador, citada no README)
  await page.goto(`${VIEIRA_URL}#/compras/SC-0013`);
  await settle(page, 1200);
  await shot(page, "vieira", "compras-detalhe");
  await ctx.close();

  const dark = await browser.newContext({ ...DESKTOP, colorScheme: "dark", locale: "pt-BR" });
  const dp = await dark.newPage();
  await dp.goto(`${VIEIRA_URL}#/dashboard`);
  await dp.waitForFunction(() => document.getElementById("titulo-pagina")?.textContent?.trim());
  await settle(dp, 900);
  await shot(dp, "vieira", "dashboard-escuro");
  await dark.close();

  const mob = await browser.newContext({ ...MOBILE, colorScheme: "light", locale: "pt-BR" });
  const mp = await mob.newPage();
  for (const id of ["dashboard", "compras", "abastecimento"]) {
    await mp.goto(`${VIEIRA_URL}#/${id}`);
    await mp.waitForFunction(() => document.getElementById("titulo-pagina")?.textContent?.trim());
    await settle(mp, 900);
    await shot(mp, "vieira", `${id}-mobile`);
  }
  await mob.close();
}

const CONVENIENCIA_URL = "https://conveniencia-zeta.vercel.app/";
// Dados de exemplo digitados pela própria interface, apenas para a captura.
const CONV_PRODUTOS = [
  ["Água mineral 500 ml", "3.50", "48", "24"],
  ["Refrigerante lata 350 ml", "6.00", "36", "24"],
  ["Café expresso", "5.00", "60", "20"],
  ["Energético 473 ml", "11.90", "8", "12"],
  ["Salgadinho 90 g", "8.50", "22", "10"],
  ["Chocolate ao leite 90 g", "7.90", "5", "10"],
  ["Gelo 5 kg", "14.00", "12", "6"],
  ["Óleo de motor 1 L", "39.90", "3", "6"],
];
const CONV_MOVIMENTOS = [
  ["Água mineral 500 ml", "saida", "12", "Venda balcão"],
  ["Café expresso", "saida", "18", "Turno da manhã"],
  ["Refrigerante lata 350 ml", "entrada", "24", "Reposição do fornecedor"],
  ["Energético 473 ml", "saida", "2", ""],
  ["Gelo 5 kg", "entrada", "10", "Entrega semanal"],
  ["Salgadinho 90 g", "saida", "6", "Venda balcão"],
];

async function convPopulate(page) {
  await page.getByRole("button", { name: "Produtos" }).click();
  for (const [nome, preco, qtd, min] of CONV_PRODUTOS) {
    await page.getByRole("button", { name: "+ Novo Produto" }).click();
    await page.fill("#product-nome", nome);
    await page.fill("#product-preco", preco);
    await page.fill("#product-quantidade", qtd);
    await page.fill("#product-quantidade-minima", min);
    await page.locator(".modal__footer .btn--primary").click();
    await wait(150);
  }
  for (const [nome, tipo, qtd, obs] of CONV_MOVIMENTOS) {
    const row = page.locator("tr", { hasText: nome });
    await row.getByTitle(tipo === "entrada" ? "Registrar entrada" : "Registrar saída").click();
    await page.fill("#movement-quantidade", qtd);
    if (obs) await page.fill("#movement-observacao", obs);
    await page.locator(".modal__footer .btn--primary").click();
    await wait(150);
  }
}

async function conveniencia(browser) {
  const ctx = await browser.newContext({ ...DESKTOP, locale: "pt-BR" });
  const page = await ctx.newPage();
  await page.goto(CONVENIENCIA_URL);
  await settle(page);
  await shot(page, "conveniencia", "vazio");
  await convPopulate(page);
  await wait(3500); // espera os avisos (toasts) sumirem

  await page.getByRole("button", { name: "Dashboard" }).click();
  await settle(page, 600);
  await shot(page, "conveniencia", "dashboard");

  await page.getByRole("button", { name: "Produtos" }).click();
  await settle(page, 400);
  await shot(page, "conveniencia", "produtos");

  await page.getByLabel("Somente estoque baixo").check();
  await settle(page, 500);
  await shot(page, "conveniencia", "estoque-baixo");
  await page.getByLabel("Somente estoque baixo").uncheck();

  await page.getByRole("button", { name: "+ Novo Produto" }).click();
  await page.fill("#product-nome", "Pão de queijo");
  await page.fill("#product-preco", "4.50");
  await settle(page, 400);
  await shot(page, "conveniencia", "modal-produto");
  await page.getByRole("button", { name: "Fechar" }).click();

  const row = page.locator("tr", { hasText: "Óleo de motor 1 L" });
  await row.getByTitle("Registrar saída").click();
  await page.fill("#movement-quantidade", "5");
  await page.locator(".modal__footer .btn--primary").click(); // saldo insuficiente → erro de validação
  await settle(page, 500);
  await shot(page, "conveniencia", "modal-saida-bloqueada");
  await page.getByRole("button", { name: "Fechar" }).click();

  // Mesma origem → reaproveita o LocalStorage populado
  const state = await ctx.storageState();
  await ctx.close();

  const mob = await browser.newContext({ ...MOBILE, locale: "pt-BR", storageState: state });
  const mp = await mob.newPage();
  await mp.goto(CONVENIENCIA_URL);
  await settle(mp);
  await shot(mp, "conveniencia", "dashboard-mobile");
  await mp.getByRole("button", { name: "Produtos" }).click();
  await settle(mp, 400);
  await shot(mp, "conveniencia", "produtos-mobile");
  await mob.close();
}

async function landing(browser, slug, url, { full = true, mobileFull = false, extra } = {}) {
  const ctx = await browser.newContext({ ...DESKTOP, locale: "pt-BR" });
  const page = await ctx.newPage();
  await page.goto(url);
  await settle(page, 1500);
  await shot(page, slug, "desktop");
  if (full) {
    await scrollThrough(page);
    await settle(page, 800);
    await shot(page, slug, "desktop-full", { fullPage: true });
  }
  if (extra) await extra(page, "desktop");
  await ctx.close();

  const mob = await browser.newContext({ ...MOBILE, locale: "pt-BR" });
  const mp = await mob.newPage();
  await mp.goto(url);
  await settle(mp, 1500);
  await shot(mp, slug, "mobile");
  if (mobileFull) {
    await scrollThrough(mp);
    await settle(mp, 800);
    await shot(mp, slug, "mobile-full", { fullPage: true });
  }
  if (extra) await extra(mp, "mobile");
  await mob.close();
}

const PROJECTS = {
  vieira,
  conveniencia,
  fotos: (b) =>
    landing(b, "fotos", "https://fotosrestaurar.vercel.app/", {
      mobileFull: true,
      extra: async (page, kind) => {
        if (kind !== "desktop") return;
        // Seções individuais (a página usa <section> para cada bloco)
        const sections = await page.locator("main > section").count();
        for (let i = 0; i < sections; i++) {
          const s = page.locator("main > section").nth(i);
          await s.scrollIntoViewIfNeeded();
          await wait(900);
          await s.screenshot({
            path: path.join(OUT, "fotos", `secao-${String(i + 1).padStart(2, "0")}.png`),
            animations: "disabled",
          });
          console.log(`  ✓ fotos/secao-${String(i + 1).padStart(2, "0")}.png`);
        }
      },
    }),
  cyborg: (b) =>
    landing(b, "cyborg", "https://aleckdevv.github.io/projeto-CyborgGames/", {
      mobileFull: true,
      extra: async (page, kind) => {
        if (kind !== "mobile") return;
        await page.locator(".lines_menu").click();
        await wait(1200);
        await shot(page, "cyborg", "mobile-menu");
      },
    }),
  starbucks: (b) =>
    landing(b, "starbucks", "https://aleckdevv.github.io/AleckDevv-projeto-starbucks.github.io/", {
      mobileFull: true,
    }),
  b7burger: (b) =>
    landing(b, "b7burger", "https://aleckdevv.github.io/AleckDevv-projeto-b7-burger.github.io/", {
      mobileFull: true,
    }),
  agencia: (b) =>
    landing(b, "agencia", "https://aleckdevv.github.io/AleckDevv-projeto-agencia.github.io/", {
      full: true,
    }),
  medcenter: (b) =>
    landing(b, "medcenter", "https://aleckdevv.github.io/AleckDevv-projeto-medcenter.github.io/", {
      mobileFull: true,
    }),
};

const only = process.argv.slice(2);
const browser = await chromium.launch({ channel: "chrome", headless: true });
let failures = 0;
try {
  for (const [slug, run] of Object.entries(PROJECTS)) {
    if (only.length && !only.includes(slug)) continue;
    console.log(`→ ${slug}`);
    try {
      await run(browser);
    } catch (error) {
      failures++;
      console.error(`  ✗ ${slug}: ${error.message}`);
    }
  }
} finally {
  await browser.close();
}
process.exitCode = failures ? 1 : 0;
