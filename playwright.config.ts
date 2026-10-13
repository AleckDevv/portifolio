import { defineConfig, devices } from "@playwright/test";

// Testes de ponta a ponta sobre o build (dist/), servido como em produção.
// Usa o Google Chrome instalado (channel "chrome"): não baixa navegadores.
// Rode "npm run build" antes de "npm run test:e2e".
export default defineConfig({
  testDir: "tests/e2e",
  timeout: 45_000,
  fullyParallel: true,
  reporter: [["list"]],
  use: {
    baseURL: "http://localhost:4174",
    channel: "chrome",
    trace: "retain-on-failure",
  },
  webServer: {
    command: "node scripts/serve-dist.mjs 4174",
    url: "http://localhost:4174",
    reuseExistingServer: true,
    timeout: 20_000,
  },
  projects: [
    { name: "desktop", use: { viewport: { width: 1440, height: 900 } } },
    {
      name: "mobile",
      use: { ...devices["Pixel 7"], channel: "chrome", viewport: { width: 390, height: 844 } },
    },
  ],
});
