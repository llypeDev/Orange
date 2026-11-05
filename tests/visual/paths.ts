import { join, resolve } from 'node:path'

/** Porta do servidor estático do Storybook (ver `serve.mjs`). */
export const PORT = Number(process.env.VISUAL_PORT ?? 6007)

/** Storybook construído por `pnpm build:storybook`. */
export const STORYBOOK_STATIC = join(__dirname, '../../apps/storybook/storybook-static')

/**
 * Pasta das baselines. `VISUAL_SNAPSHOT_DIR` permite gerar baselines descartáveis em outro lugar
 * (ex.: para testar a suíte localmente sem tocar nas baselines versionadas, que vêm do CI).
 */
export const SNAPSHOT_DIR = process.env.VISUAL_SNAPSHOT_DIR
  ? resolve(process.env.VISUAL_SNAPSHOT_DIR)
  : join(__dirname, '__screenshots__')
