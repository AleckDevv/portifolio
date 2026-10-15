import { expect, test } from "@playwright/test";
import { trackErrors } from "./helpers";

// Abertura da página inicial (src/components/intro/Intro.tsx).
// Aqui não se usa a fixture que marca a abertura como vista.

test.describe("abertura", () => {
  test("toca na primeira visita e entrega para o título do hero", async ({ page }) => {
    const errors = trackErrors(page);
    await page.goto("/");
    await expect(page.locator("html")).toHaveAttribute("data-intro", "play");
    const intro = page.locator(".intro");
    await expect(intro).toBeVisible();
    // Sem barras, porcentagens ou medidores: o letreiro mostra os projetos.
    await expect(intro).not.toContainText("%");
    await expect(intro.locator("progress, meter, [role=progressbar]")).toHaveCount(0);
    await expect(intro.locator(".intro__ticker li")).toHaveCount(10);
    // A cortina sobe sozinha (~3 s) e a abertura sai do DOM depois do título.
    await expect(intro).toBeHidden({ timeout: 6000 });
    await expect(page.getByRole("heading", { level: 1, name: "Problemas entram. Software sai." })).toBeVisible();
    await expect(page.locator("html")).toHaveAttribute("data-intro", "done", { timeout: 6000 });
    expect(errors).toEqual([]);
  });

  test("qualquer tecla pula direto para a cortina", async ({ page }) => {
    await page.goto("/");
    const intro = page.locator(".intro");
    await expect(intro).toBeVisible();
    await page.waitForFunction(() => document.getAnimations().length > 0);
    const started = Date.now();
    await page.keyboard.press("Escape");
    await expect(intro).toBeHidden({ timeout: 2500 });
    expect(Date.now() - started).toBeLessThan(2500);
  });

  test("recarregar recomeça do zero: topo, sem âncora e com a abertura", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator(".intro")).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(page.locator(".intro")).toBeHidden({ timeout: 2500 });
    // Navegar por uma seção grava a âncora no endereço e rola a página.
    await page.getByRole("link", { name: /Ver os \d+ projetos/ }).click();
    await expect(page).toHaveURL(/#projetos$/);
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(300);

    await page.reload();
    await expect(page.locator("html")).toHaveAttribute("data-intro", "play");
    await expect(page.locator(".intro")).toBeVisible();
    expect(new URL(page.url()).hash).toBe("");
    // Nem salto para a âncora nem restauração da rolagem anterior, do começo ao fim.
    for (let i = 0; i < 6; i++) {
      expect(await page.evaluate(() => window.scrollY)).toBe(0);
      await page.waitForTimeout(250);
    }
    await expect(page.locator(".intro")).toBeHidden({ timeout: 6000 });
    expect(await page.evaluate(() => window.scrollY)).toBe(0);
    await expect(page.getByRole("heading", { level: 1, name: "Problemas entram. Software sai." })).toBeInViewport();
  });

  test("entrar por um link com âncora também começa do topo, com a abertura", async ({ page }) => {
    await page.goto("/#contato");
    await expect(page.locator("html")).toHaveAttribute("data-intro", "play");
    expect(new URL(page.url()).hash).toBe("");
    await page.waitForTimeout(1200);
    expect(await page.evaluate(() => window.scrollY)).toBe(0);
  });

  test("voltar no histórico não toca a abertura de novo", async ({ page }) => {
    await page.goto("/");
    await page.keyboard.press("Escape");
    await expect(page.locator("html")).toHaveAttribute("data-intro", "done", { timeout: 5000 });
    await page.goto("/projetos/pilates/");
    await page.goBack();
    // Recarregada do histórico ("skip") ou restaurada do cache de navegação ("done").
    await expect(page.locator("html")).toHaveAttribute("data-intro", /skip|done/);
    await expect(page.locator(".intro")).toBeHidden();
  });

  test("não toca com movimento reduzido", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    await expect(page.locator("html")).toHaveAttribute("data-intro", "skip");
    await expect(page.locator(".intro")).toBeHidden();
  });

  test("não toca em quem chega direto a um estudo de caso", async ({ page }) => {
    await page.goto("/projetos/pilates/");
    await expect(page.locator("html")).toHaveAttribute("data-intro", "skip");
    await expect(page.locator(".intro")).toHaveCount(0);
  });
});
