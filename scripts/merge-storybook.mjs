#!/usr/bin/env node
// Copia o Storybook estático para apps/docs/dist/storybook, publicando os dois
// juntos (o site de documentação aponta para /storybook/).
import { cpSync, existsSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const from = join(root, 'apps/storybook/storybook-static')
const to = join(root, 'apps/docs/dist/storybook')

if (!existsSync(from)) {
  console.error('Storybook não encontrado. Rode `pnpm build:storybook` antes.')
  process.exit(1)
}
cpSync(from, to, { recursive: true })
console.log(`Storybook copiado para ${to}`)
