import { chromium } from "@playwright/test";
const urls = {
  vieira: "https://sistemaprototipovieira.vercel.app/#/dashboard",
  conveniencia: "https://conveniencia-zeta.vercel.app/",
  fotos: "https://fotosrestaurar.vercel.app/",
  cyborg: "https://aleckdevv.github.io/projeto-CyborgGames/",
  starbucks: "https://aleckdevv.github.io/AleckDevv-projeto-starbucks.github.io/",
  b7burger: "https://aleckdevv.github.io/AleckDevv-projeto-b7-burger.github.io/",
  agencia: "https://aleckdevv.github.io/AleckDevv-projeto-agencia.github.io/",
  medcenter: "https://aleckdevv.github.io/AleckDevv-projeto-medcenter.github.io/",
};
const b = await chromium.launch({ channel: "chrome" });
for (const w of [390, 768]) {
  const ctx = await b.newContext({ viewport: { width: w, height: 844 }, isMobile: w < 500, hasTouch: w < 500 });
  for (const [k, u] of Object.entries(urls)) {
    const p = await ctx.newPage();
    const errors = [];
    p.on("pageerror", (e) => errors.push(e.message));
    await p.goto(u, { waitUntil: "networkidle" });
    await p.waitForTimeout(800);
    const r = await p.evaluate(() => ({ sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth, title: document.title }));
    console.log(`${String(w).padEnd(4)} ${k.padEnd(13)} scrollWidth=${r.sw} clientWidth=${r.cw} overflow=${r.sw > r.cw + 1 ? "SIM (+" + (r.sw - r.cw) + "px)" : "não"} | title="${r.title}" ${errors.length ? "| JS errors: " + errors.join("; ") : ""}`);
    await p.close();
  }
  await ctx.close();
}
await b.close();
