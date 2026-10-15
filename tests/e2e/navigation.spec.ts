import { expect, test } from "./fixtures";
import { projects } from "../../src/content/projects";
import { trackErrors } from "./helpers";

test.describe("navegação", () => {
  test("abre o estudo de caso com transição e volta para a página inicial", async ({ page }) => {
    const errors = trackErrors(page);
    await page.goto("/#conveniencia");
    await page.locator("article#conveniencia").getByRole("link", { name: /Estudo de caso/ }).click();
    await expect(page).toHaveURL(/\/projetos\/conveniencia\/$/);
    await expect(page.getByRole("heading", { level: 1, name: "Conveniência THR" })).toBeVisible();
    await expect(page).toHaveTitle(/Conveniência THR/);
    await expect(page.locator("#conteudo")).toBeFocused();
    await page.goBack();
    await expect(page).toHaveURL(/\/#conveniencia$|\/$/);
    await expect(page.getByRole("heading", { level: 1, name: "Problemas entram. Software sai." })).toBeVisible();
    expect(errors).toEqual([]);
  });

  test("navega para o próximo projeto pelo rodapé do estudo de caso", async ({ page }) => {
    await page.goto("/projetos/vieira");
    await page.getByRole("navigation", { name: "Outros projetos" }).getByRole("link", { name: /Conveniência THR/ }).click();
    await expect(page).toHaveURL(/\/projetos\/conveniencia\/$/);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Conveniência THR");
  });

  for (const project of projects) {
    test(`página pré-renderizada: ${project.slug}`, async ({ page, request }) => {
      // HTML estático (sem JavaScript) já traz o conteúdo e os metadados.
      const response = await request.get(`/projetos/${project.slug}/`);
      expect(response.status()).toBe(200);
      const html = await response.text();
      expect(html).toContain(`<title>${project.name.replace(/"/g, "&quot;")}`);
      expect(html).toContain(`og/${project.slug}.png`);
      expect(html).toContain(`rel="canonical"`);
      expect(html).toContain(project.links.repo ?? "Repositório privado");

      await page.goto(`/projetos/${project.slug}/`);
      await expect(page.getByRole("heading", { level: 1 })).toHaveText(project.name);
      if (project.links.repo) {
        await expect(page.getByRole("link", { name: /Repositório/ }).first()).toHaveAttribute("href", project.links.repo);
      } else {
        await expect(page.getByRole("link", { name: /Repositório/ })).toHaveCount(0);
      }
    });
  }

  test("rota inexistente responde 404 com página própria", async ({ page, request }) => {
    const response = await request.get("/rota-que-nao-existe");
    expect(response.status()).toBe(404);
    await page.goto("/rota-que-nao-existe");
    await expect(page.getByRole("heading", { level: 1, name: /404/ })).toBeVisible();
    await page.getByRole("link", { name: /Voltar ao início/ }).click();
    await expect(page).toHaveURL(/\/$/);
  });

  test("slug de projeto desconhecido também mostra a 404", async ({ page }) => {
    await page.goto("/projetos/nao-existe");
    await expect(page.getByRole("heading", { level: 1, name: /404/ })).toBeVisible();
  });

  test("com movimento reduzido, navega sem a cortina de transição", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/#agencia");
    await page.locator("article#agencia").getByRole("link", { name: /Estudo de caso/ }).click();
    await expect(page).toHaveURL(/\/projetos\/agencia\/$/);
    await expect(page.locator(".curtain")).toHaveCount(0);
  });

  test("menu mobile abre, navega e fecha", async ({ page, isMobile }) => {
    test.skip(!isMobile, "menu só aparece no celular");
    await page.goto("/");
    await page.getByRole("button", { name: "Menu" }).click();
    const menu = page.getByRole("dialog", { name: "Menu" });
    await expect(menu).toBeVisible();
    await menu.getByRole("link", { name: "Stack" }).click();
    await expect(menu).toBeHidden();
    await expect(page).toHaveURL(/#stack$/);
  });
});
