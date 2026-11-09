import { defineConfig } from '@playwright/test'
import { STORYBOOK_STATIC } from '../visual/paths'

// Comportamentos que dependem de layout real (rolagem, overflow, posição de sobreposições,
// movimento reduzido) — o jsdom dos testes unitários não tem layout. Roda nas stories do
// Storybook construído, em Chromium, Firefox e WebKit (o motor do Safari). Diferente da
// regressão visual, não compara imagens: mede posições, então vale em qualquer ambiente.
// Fora do contêiner do CI, rode só o que tiver instalado: `pnpm test:layout --project=chromium`.

const CI = !!process.env.CI
const PORT = Number(process.env.LAYOUT_PORT ?? 6008)

export default defineConfig({
  testDir: '.',
  testMatch: 'layout.spec.ts',
  outputDir: './test-results',
  fullyParallel: true,
  forbidOnly: CI,
  retries: CI ? 1 : 0,
  workers: CI ? '100%' : undefined,
  reporter: CI
    ? [['github'], ['list'], ['html', { open: 'never', outputFolder: 'playwright-report' }]]
    : [['list']],
  use: {
    baseURL: `http://127.0.0.1:${PORT}`,
    viewport: { width: 1280, height: 800 },
    locale: 'pt-BR',
    timezoneId: 'America/Sao_Paulo',
    // Padrão: movimento reduzido (onde vários defeitos apareciam). Testes de animação sobrescrevem.
    reducedMotion: 'reduce',
  },
  projects: [
    {
      name: 'chromium',
      use: {
        browserName: 'chromium',
        // Só para rodadas locais com um Chromium já instalado (ex.: /opt/pw-browsers/...).
        launchOptions: process.env.PW_CHROMIUM_PATH
          ? { executablePath: process.env.PW_CHROMIUM_PATH }
          : {},
      },
    },
    { name: 'firefox', use: { browserName: 'firefox' } },
    { name: 'webkit', use: { browserName: 'webkit' } },
  ],
  webServer: {
    command: `node ../visual/serve.mjs ${PORT} "${STORYBOOK_STATIC}"`,
    url: `http://127.0.0.1:${PORT}/iframe.html`,
    reuseExistingServer: !CI,
    timeout: 30_000,
  },
})
