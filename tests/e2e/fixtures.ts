import { test as base } from "@playwright/test";

// Testes que vão direto ao conteúdo: a abertura fica desligada ("off", lido
// pelo script de index.html). Ela tem testes próprios em intro.spec.ts.
export const test = base.extend({
  page: async ({ page }, provide) => {
    await page.addInitScript(() => {
      try {
        sessionStorage.setItem("aleckdevv:intro", "off");
      } catch {
        // sem sessionStorage, o script da página já pula a abertura
      }
    });
    await provide(page);
  },
});

export { expect } from "@playwright/test";
