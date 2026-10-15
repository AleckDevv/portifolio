import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "./fixtures";
import { scrollThrough } from "./helpers";

// Auditoria automática de acessibilidade (WCAG 2.2 A/AA) com axe-core.
for (const path of ["/", "/projetos/vieira", "/projetos/pilates", "/projetos/iaworkout", "/projetos/fotos", "/rota-que-nao-existe"]) {
  test(`acessibilidade: ${path}`, async ({ page }) => {
    await page.goto(path);
    await scrollThrough(page);
    await page.evaluate(() => window.scrollTo(0, 0));
    const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"]).analyze();
    const serious = results.violations.filter((v) => v.impact === "serious" || v.impact === "critical");
    const summary = serious.map((v) => `${v.id} (${v.impact}): ${v.nodes.length} × ${v.nodes[0]?.target.join(" ")} — ${v.help}`);
    expect(summary, summary.join("\n")).toEqual([]);
  });
}

test("modo técnico ligado continua acessível", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: /Modo técnico/ }).first().click();
  const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa"]).analyze();
  const serious = results.violations.filter((v) => v.impact === "serious" || v.impact === "critical");
  expect(serious.map((v) => `${v.id}: ${v.nodes[0]?.target.join(" ")}`)).toEqual([]);
});
