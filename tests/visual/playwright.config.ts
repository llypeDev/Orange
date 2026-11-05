import { defineConfig } from '@playwright/test'
import { PORT, SNAPSHOT_DIR, STORYBOOK_STATIC } from './paths'

// Regressão visual das stories do Storybook nos temas dark e light.
// As baselines só valem no ambiente em que foram geradas: o contêiner
// mcr.microsoft.com/playwright:v<versão do @playwright/test> usado pelos workflows
// visual.yml e visual-update.yml. Rodadas locais são apenas informativas.

const CI = !!process.env.CI

export default defineConfig({
  testDir: '.',
  testMatch: 'visual.spec.ts',
  outputDir: './test-results',
  // Sem sufixo de plataforma/projeto: há um único ambiente de referência (o contêiner do CI).
  snapshotPathTemplate: `${SNAPSHOT_DIR}/{arg}{ext}`,
  // Baseline ausente falha em vez de ser gravada: só `test:visual:update` (--update-snapshots) grava.
  updateSnapshots: 'none',
  fullyParallel: true,
  forbidOnly: CI,
  // Uma nova tentativa absorve falhas transitórias de rede (fontes do Google Fonts).
  retries: CI ? 1 : 0,
  workers: CI ? '100%' : undefined,
  reporter: CI
    ? [['github'], ['list'], ['html', { open: 'never', outputFolder: 'playwright-report' }]]
    : [['list'], ['html', { open: 'never', outputFolder: 'playwright-report' }]],
  expect: {
    toHaveScreenshot: {
      maxDiffPixelRatio: 0.002,
      threshold: 0.2,
      animations: 'disabled',
      caret: 'hide',
      scale: 'css',
    },
  },
  use: {
    browserName: 'chromium',
    baseURL: `http://127.0.0.1:${PORT}`,
    viewport: { width: 1280, height: 800 },
    deviceScaleFactor: 1,
    locale: 'pt-BR',
    timezoneId: 'America/Sao_Paulo',
    reducedMotion: 'reduce',
    // Só para rodadas locais fora do contêiner (ex.: PW_CHROMIUM_PATH=/opt/pw-browsers/chromium).
    // No CI fica vazio e o Playwright usa o Chromium do próprio contêiner.
    launchOptions: process.env.PW_CHROMIUM_PATH
      ? { executablePath: process.env.PW_CHROMIUM_PATH }
      : {},
  },
  webServer: {
    command: `node serve.mjs ${PORT} "${STORYBOOK_STATIC}"`,
    url: `http://127.0.0.1:${PORT}/iframe.html`,
    reuseExistingServer: !CI,
    timeout: 30_000,
  },
})
