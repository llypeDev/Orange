#!/usr/bin/env node
// Orçamento de tamanho do @orangesys/ui (rode depois de `pnpm build:lib`).
//
// Mede o custo real de importar cada item como um projeto faria: empacota
// `export { X } from '@orangesys/ui'` a partir do dist publicado, com tree-shaking e minificação,
// React fora (dependência de quem usa), e compara o gzip com os limites em size-limits.json.
// Também mede o styles.css. Falha (exit 1) se algum item passar do limite.
//
// Por quê: até a 1.3.1 o pacote era um arquivo único e importar só o Button trazia a biblioteca
// inteira (~147 KB gzip). Este check trava esse tipo de regressão.
import { appendFileSync, existsSync, readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { gzipSync } from 'node:zlib'
import { build } from 'esbuild'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const uiDist = join(root, 'packages/ui/dist')
const tokensDist = join(root, 'packages/tokens/dist')
const entry = join(uiDist, 'esm/index.js')
if (!existsSync(entry) || !existsSync(join(tokensDist, 'index.js'))) {
  console.error('dist não encontrado. Rode `pnpm build:lib` antes de `pnpm size`.')
  process.exit(1)
}

const { items } = JSON.parse(readFileSync(join(root, 'size-limits.json'), 'utf8'))
const kb = (bytes) => bytes / 1024
const parseLimit = (text) => Number.parseFloat(text)

async function measure(item) {
  if (item.file) return gzipSync(readFileSync(join(root, item.file))).length
  const contents =
    item.import === '*' ? `export * from '${entry}'` : `export { ${item.import} } from '${entry}'`
  const result = await build({
    stdin: { contents, resolveDir: root, loader: 'js' },
    bundle: true,
    minify: true,
    write: false,
    format: 'esm',
    platform: 'browser',
    external: ['react', 'react-dom', 'react/jsx-runtime'],
    // Os tokens como publicados (o pacote no workspace aponta para o código-fonte).
    alias: { '@orangesys/tokens': join(tokensDist, 'index.js') },
    logLevel: 'silent',
  })
  return gzipSync(result.outputFiles[0].contents).length
}

const rows = []
let failed = 0
for (const item of items) {
  const size = kb(await measure(item))
  const limit = parseLimit(item.limit)
  const ok = size <= limit
  if (!ok) failed++
  rows.push({ name: item.name, size, limit, ok })
}

const width = Math.max(...rows.map((r) => r.name.length))
for (const r of rows) {
  console.log(
    `${r.ok ? '✓' : '✗'} ${r.name.padEnd(width)}  ${r.size.toFixed(1).padStart(6)} KB gzip  (limite ${r.limit} KB)`,
  )
}
if (process.env.GITHUB_STEP_SUMMARY) {
  const table = [
    '### Tamanho do @orangesys/ui (gzip)',
    '| Item | Tamanho | Limite | |',
    '| --- | ---: | ---: | :---: |',
    ...rows.map(
      (r) => `| ${r.name} | ${r.size.toFixed(1)} KB | ${r.limit} KB | ${r.ok ? '✓' : '✗'} |`,
    ),
  ].join('\n')
  appendFileSync(process.env.GITHUB_STEP_SUMMARY, `${table}\n`)
}
if (failed) {
  console.error(
    `\n${failed} item(ns) acima do limite. Se o aumento é intencional (componente novo, recurso), ` +
      'ajuste size-limits.json no mesmo PR e explique o motivo.',
  )
  process.exit(1)
}
