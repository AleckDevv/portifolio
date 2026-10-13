import type { Page } from "@playwright/test";

/** Coleta erros de JavaScript e de console durante o teste. */
export function trackErrors(page: Page): string[] {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() !== "error") return;
    const text = message.text();
    // O próprio documento da página 404 responde com status 404 (esperado).
    if (text.includes("status of 404")) return;
    errors.push(text);
  });
  return errors;
}

/** Rola a página inteira devagar (dispara carregamento sob demanda e revelações). */
export async function scrollThrough(page: Page) {
  await page.evaluate(async () => {
    for (let y = 0; y < document.documentElement.scrollHeight; y += Math.round(window.innerHeight * 0.7)) {
      window.scrollTo({ top: y, behavior: "instant" });
      await new Promise((resolve) => setTimeout(resolve, 90));
    }
  });
}

export async function horizontalOverflow(page: Page): Promise<number> {
  return page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
}
