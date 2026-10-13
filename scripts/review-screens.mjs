// Gera capturas do próprio portfólio para revisão visual, como um visitante vê:
// rola a página em etapas e, a cada etapa, espera as imagens visíveis carregarem.
//
// Uso: npm run build && npm run preview          (em outro terminal)
//      node scripts/review-screens.mjs [url-base] [pasta-saída]
// Variáveis: ROUTES="/,/projetos/vieira"  WIDTHS="1440,390"  STEPS=0 (só a 1ª dobra)

import { chromium } from "@playwright/test";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const BASE = process.argv[2] ?? "http://localhost:4173";
const OUT = path.resolve(process.argv[3] ?? "review-screens");
const ROUTES = (process.env.ROUTES ?? "/,/projetos/vieira,/projetos/iaworkout,/nao-existe").split(",");
const WIDTHS = (process.env.WIDTHS ?? "1440,1024,768,390,320").split(",").map(Number);
const STEPS = process.env.STEPS !== "0";

async function waitForVisibleImages(page) {
  await page
    .waitForFunction(
      () =>
        [...document.images]
          .filter((img) => {
            const r = img.getBoundingClientRect();
            return r.bottom > 0 && r.top < innerHeight && r.width > 0;
          })
          .every((img) => img.complete),
      null,
      { timeout: 8000 },
    )
    .catch(() => {});
}

await mkdir(OUT, { recursive: true });
const browser = await chromium.launch({ channel: "chrome" });
for (const width of WIDTHS) {
  const height = width < 600 ? 844 : 900;
  const context = await browser.newContext({ viewport: { width, height }, isMobile: width < 600, hasTouch: width < 600 });
  const page = await context.newPage();
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => message.type() === "error" && errors.push(message.text()));

  for (const route of ROUTES) {
    await page.goto(BASE + route, { waitUntil: "networkidle" });
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(900);
    const name = `${route === "/" ? "home" : route.replace(/\//g, "_").replace(/^_/, "")}-${width}`;
    const total = await page.evaluate(() => document.documentElement.scrollHeight);
    const stepSize = Math.round(height * 0.9);
    const count = STEPS ? Math.ceil((total - height) / stepSize) + 1 : 1;
    for (let i = 0; i < count; i++) {
      await page.evaluate((y) => window.scrollTo({ top: y, behavior: "instant" }), i * stepSize);
      await page.waitForTimeout(450);
      await waitForVisibleImages(page);
      await page.screenshot({ path: path.join(OUT, `${name}-${String(i).padStart(2, "0")}.png`) });
    }
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    console.log(`${String(width).padEnd(5)} ${route.padEnd(22)} ${count} capturas · overflow=${overflow}px ${errors.length ? "ERROS: " + errors.join(" | ") : ""}`);
    errors.length = 0;
  }
  await context.close();
}
await browser.close();
