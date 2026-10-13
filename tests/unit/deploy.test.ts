import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const ROOT = path.resolve(__dirname, "../..");
const vercel = JSON.parse(readFileSync(path.join(ROOT, "vercel.json"), "utf8"));
const html = readFileSync(path.join(ROOT, "index.html"), "utf8");
const pkg = JSON.parse(readFileSync(path.join(ROOT, "package.json"), "utf8"));

describe("configuração da Vercel", () => {
  it("usa o build completo (com pré-renderização) e publica dist/", () => {
    expect(vercel.buildCommand).toBe("npm run build");
    expect(pkg.scripts.build).toContain("prerender.mjs");
    expect(vercel.outputDirectory).toBe("dist");
    expect(vercel.installCommand).toBe("npm ci");
  });

  it("usa barra final, igual aos links canônicos e ao sitemap", () => {
    expect(vercel.trailingSlash).toBe(true);
  });

  it("autoriza na CSP exatamente os scripts inline do index.html", () => {
    // Se o script inline de index.html mudar, atualize o hash em vercel.json:
    // o valor esperado aparece na mensagem de erro deste teste.
    const csp: string = vercel.headers
      .flatMap((rule: { headers: Array<{ key: string; value: string }> }) => rule.headers)
      .find((header: { key: string }) => header.key === "Content-Security-Policy").value;
    const inline = [...html.matchAll(/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/g)].map(
      (match) => `'sha256-${createHash("sha256").update(match[1]!, "utf8").digest("base64")}'`,
    );
    expect(inline.length).toBeGreaterThan(0);
    for (const hash of inline) expect(csp, `inclua ${hash} em script-src`).toContain(hash);
    expect(csp).not.toContain("'unsafe-eval'");
    expect(csp).toMatch(/script-src 'self' 'sha256-/);
  });
});
