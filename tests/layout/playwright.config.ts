import { defineConfig } from '@playwright/test'
import { STORYBOOK_STATIC } from '../visual/paths'

// Comportamentos que dependem de layout real (rolagem, overflow, posição de sobreposições,
// movimento reduzido) — o jsdom dos testes unitários não tem layout. Roda nas stories do
// Storybook construído, num Chromium de verdade. Diferente da regressão visual, não compara
// imagens: mede posições, então roda em qualquer ambiente com Chromium.

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
    browserName: 'chromium',
    baseURL: `http://127.0.0.1:${PORT}`,
    viewport: { width: 1280, height: 800 },
    locale: 'pt-BR',
    timezoneId: 'America/Sao_Paulo',
    // Padrão: movimento reduzido (onde vários defeitos apareciam). Testes de animação sobrescrevem.
    reducedMotion: 'reduce',
    launchOptions: process.env.PW_CHROMIUM_PATH
      ? { executablePath: process.env.PW_CHROMIUM_PATH }
      : {},
  },
  webServer: {
    command: `node ../visual/serve.mjs ${PORT} "${STORYBOOK_STATIC}"`,
    url: `http://127.0.0.1:${PORT}/iframe.html`,
    reuseExistingServer: !CI,
    timeout: 30_000,
  },
})
