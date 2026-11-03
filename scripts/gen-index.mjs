#!/usr/bin/env node
/**
 * Gera `packages/ui/src/components/index.ts` a partir das pastas de
 * componentes. Cada pasta em `packages/ui/src/components/<Nome>/` com um
 * `index.ts` é exportada automaticamente — não edite o arquivo gerado.
 *
 * Uso: `pnpm gen`
 */
import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const componentsDir = join(root, 'packages/ui/src/components')
const outFile = join(componentsDir, 'index.ts')

const dirs = readdirSync(componentsDir, { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .map((d) => d.name)
  .filter((name) => existsSync(join(componentsDir, name, 'index.ts')))
  .sort((a, b) => a.localeCompare(b))

const content = `/* Arquivo gerado por scripts/gen-index.mjs — não edite manualmente. */
${dirs.map((d) => `export * from './${d}'`).join('\n')}
`

const previous = existsSync(outFile) ? readFileSync(outFile, 'utf8') : ''
if (previous !== content) {
  writeFileSync(outFile, content)
  console.log(`components/index.ts atualizado (${dirs.length} componentes).`)
} else {
  console.log(`components/index.ts já está atualizado (${dirs.length} componentes).`)
}
