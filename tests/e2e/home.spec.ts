import { expect, test } from "./fixtures";
import { projects } from "../../src/content/projects";
import { horizontalOverflow, scrollThrough, trackErrors } from "./helpers";

test.describe("página inicial", () => {
  test("apresenta o hero com propósito claro e acessos a projetos e contato", async ({ page }) => {
    const errors = trackErrors(page);
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1, name: "Problemas entram. Software sai." })).toBeVisible();
    await expect(page.getByRole("link", { name: new RegExp(`Ver os ${projects.length} projetos`) })).toHaveAttribute("href", "#projetos");
    await expect(page.getByRole("link", { name: /Falar comigo/ })).toHaveAttribute("href", "#contato");
    expect(errors).toEqual([]);
  });

  test("mostra todos os projetos com repositório e demonstração corretos", async ({ page }) => {
    await page.goto("/");
    for (const project of projects) {
      const article = page.locator(`article#${project.slug}`);
      await expect(article, project.slug).toHaveCount(1);
      await expect(article.getByRole("heading", { level: 3 }).first()).toContainText(project.name.split(" ")[0]!, { ignoreCase: true });
      if (project.links.repo) {
        await expect(article.getByRole("link", { name: /Repositório/ })).toHaveAttribute("href", project.links.repo);
      } else {
        await expect(article.getByRole("link", { name: /Repositório/ })).toHaveCount(0);
        await expect(article.getByText("Repositório privado", { exact: true })).toBeVisible();
      }
      if (project.links.demo) {
        await expect(article.getByRole("link", { name: /Demonstração/ })).toHaveAttribute("href", project.links.demo.url);
      } else {
        await expect(article.getByText("Sem demonstração publicada").first()).toBeVisible();
      }
      await expect(article.getByRole("link", { name: /Estudo de caso/ })).toHaveAttribute("href", `/projetos/${project.slug}/`);
    }
  });

  test("não usa barras de progresso nem medidores", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("progress, meter, [role=progressbar], [aria-valuenow]")).toHaveCount(0);
  });

  test("carrega todas as imagens sem erro", async ({ page }) => {
    await page.goto("/");
    // Força o carregamento de todas as imagens (inclusive as fora da área visível).
    await page.evaluate(() => document.querySelectorAll("img").forEach((img) => (img.loading = "eager")));
    await scrollThrough(page);
    const broken = await page.evaluate(async () => {
      const images = [...document.images];
      await Promise.all(images.map((img) => (img.complete ? null : new Promise((r) => img.addEventListener("load", r, { once: true })))));
      return images.filter((img) => img.naturalWidth === 0).map((img) => img.currentSrc || img.src);
    });
    expect(broken).toEqual([]);
    await expect(page.getByText("Imagem indisponível no momento")).toHaveCount(0);
  });

  test("abre a explicação de uma tecnologia com os projetos onde ela aparece", async ({ page }) => {
    await page.goto("/#stack");
    const tile = page.locator("#stack").getByRole("button", { name: /React — usado em 4 projetos/ });
    await tile.click();
    const dialog = page.getByRole("dialog", { name: "React" });
    await expect(dialog).toBeVisible();
    await expect(dialog).toContainText("Usado em 4 projetos");
    for (const name of ["Conveniência THR", "Sistema Pilates", "RestaurArt", "IaWorkout"]) {
      await expect(dialog.getByRole("link", { name: new RegExp(name) })).toBeVisible();
    }
    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
    await expect(tile).toBeFocused();
  });

  test("mostra o TypeScript como prática, com o projeto em que aparece", async ({ page }) => {
    await page.goto("/#stack");
    await page.locator("#stack").getByRole("button", { name: /TypeScript — usado em 1 projeto/ }).click();
    const dialog = page.getByRole("dialog", { name: "TypeScript" });
    await expect(dialog).toContainText("Usado em 1 projeto");
    await expect(dialog.getByRole("link", { name: /Sistema Pilates/ })).toBeVisible();
    await page.getByRole("button", { name: "Fechar" }).click();
    await expect(dialog).toBeHidden();
  });

  test("troca as telas dos módulos do Vieira pelo teclado", async ({ page }) => {
    await page.goto("/#vieira");
    const tablist = page.getByRole("tablist", { name: /Módulos do Vieira/ });
    const first = tablist.getByRole("tab", { name: /Dashboard/ });
    await first.focus();
    await page.keyboard.press("ArrowDown");
    const second = tablist.getByRole("tab", { name: /Veículos/ });
    await expect(second).toBeFocused();
    await expect(second).toHaveAttribute("aria-selected", "true");
    await expect(page.locator("#home-vieira-panel").getByRole("img", { name: /Lista de veículos/ })).toBeVisible();
    await page.keyboard.press("End");
    await expect(tablist.getByRole("tab", { name: /Usuários/ })).toHaveAttribute("aria-selected", "true");
  });

  test("liga o modo técnico e lembra a escolha", async ({ page }) => {
    await page.goto("/");
    const toggle = page.getByRole("button", { name: /Modo técnico/ }).first();
    await expect(toggle).toHaveAttribute("aria-pressed", "false");
    await toggle.click();
    await expect(page.locator("html")).toHaveAttribute("data-tech", "on");
    await expect(page.locator("#vieira .tech-only").first()).toBeVisible();
    await page.reload();
    await expect(page.locator("html")).toHaveAttribute("data-tech", "on");
    await expect(page.getByRole("button", { name: /Modo técnico/ }).first()).toHaveAttribute("aria-pressed", "true");
  });

  test("permite pular para o conteúdo pelo teclado", async ({ page }) => {
    await page.goto("/");
    await page.keyboard.press("Tab");
    const skip = page.getByRole("link", { name: "Pular para o conteúdo" });
    await expect(skip).toBeFocused();
    await expect(skip).toBeVisible();
  });

  test("copia o e-mail de contato", async ({ page, context, browserName }) => {
    test.skip(browserName !== "chromium", "permissão de área de transferência só no Chromium");
    await context.grantPermissions(["clipboard-read", "clipboard-write"]);
    await page.goto("/#contato");
    await page.getByRole("button", { name: "Copiar e-mail" }).click();
    await expect(page.getByRole("button", { name: "E-mail copiado" })).toBeVisible();
    expect(await page.evaluate(() => navigator.clipboard.readText())).toBe("alexsoareslopes688@gmail.com");
  });
});

test.describe("responsividade", () => {
  for (const width of [320, 375, 768, 1024, 1280, 1920]) {
    test(`sem rolagem horizontal em ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      for (const path of ["/", ...projects.map((p) => `/projetos/${p.slug}/`), "/rota-que-nao-existe"]) {
        await page.goto(path);
        await scrollThrough(page);
        expect(await horizontalOverflow(page), `${path} @ ${width}px`).toBeLessThanOrEqual(0);
        // Nenhum título cortado (texto maior que a própria caixa).
        const clipped = await page.evaluate(() =>
          [...document.querySelectorAll("h1, h2, h3")]
            .filter((el) => el.getBoundingClientRect().width > 0 && el.scrollWidth > el.clientWidth + 1)
            .map((el) => el.textContent?.trim().slice(0, 40)),
        );
        expect(clipped, `títulos cortados em ${path} @ ${width}px`).toEqual([]);
      }
    });
  }
});

test.describe("renderização das telas", () => {
  test("telas fora da área visível chegam como planta e são renderizadas ao aparecer", async ({ page }) => {
    const errors = trackErrors(page);
    await page.goto("/");
    const shot = page.locator("#pilates .render").first();
    await expect(shot).toHaveAttribute("data-render", "armed");
    await shot.scrollIntoViewIfNeeded();
    await expect(shot).toHaveAttribute("data-render", /render|done/);
    await expect(shot).toHaveAttribute("data-render", "done", { timeout: 6000 });
    // A imagem real continua acessível pelo texto alternativo durante todo o efeito.
    await expect(shot.getByRole("img")).toHaveAttribute("alt", /Agenda semanal/);
    expect(errors).toEqual([]);
  });

  test("com movimento reduzido, as telas aparecem prontas", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    const shot = page.locator("#pilates .render").first();
    await shot.scrollIntoViewIfNeeded();
    await page.waitForTimeout(400);
    await expect(shot).toHaveAttribute("data-render", "static");
  });

  test("lente de raio-x acompanha o cursor", async ({ page, isMobile }) => {
    test.skip(isMobile, "efeito só com mouse");
    await page.goto("/#pilates");
    const shot = page.locator("#pilates .render").first();
    await shot.scrollIntoViewIfNeeded();
    await expect(shot).toHaveAttribute("data-render", /static|done/, { timeout: 6000 });
    const box = (await shot.boundingBox())!;
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    await page.mouse.move(box.x + box.width / 2 + 20, box.y + box.height / 2 + 10, { steps: 4 });
    await expect(shot).toHaveAttribute("data-xray", "on");
    await page.mouse.move(5, 5);
    await expect(shot).not.toHaveAttribute("data-xray", "on");
  });
});
