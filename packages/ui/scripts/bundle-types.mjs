/**
 * Junta as declarações geradas pelo `tsc` (dist/types/**) em um único arquivo
 * e publica duas cópias: `dist/index.d.ts` (ESM) e `dist/index.d.cts` (CJS).
 *
 * Por quê: o `tsc` emite imports relativos sem extensão (`export * from './components'`)
 * e mantém `import './Button.css'` nas declarações. Isso funciona com
 * `moduleResolution: "bundler"`, mas quebra os tipos em `node16`/`nodenext` e faz
 * o `require('@orange/ui')` receber tipos ESM ("masquerading as ESM"). Um arquivo
 * único, sem imports relativos, resolve igual em todos os modos.
 *
 * Roda no fim de `pnpm --filter @orange/ui build`.
 */
import { copyFile, readdir, readFile, rm, writeFile } from 'node:fs/promises'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { rollup } from 'rollup'
import { dts } from 'rollup-plugin-dts'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const typesDir = join(root, 'dist/types')
const esmOut = join(root, 'dist/index.d.ts')
const cjsOut = join(root, 'dist/index.d.cts')

// 1. Remove os imports de CSS (só efeito colateral; não existem em tipos).
const CSS_IMPORT = /^import\s+['"][^'"]+\.css['"];?\s*$/gm
for (const entry of await readdir(typesDir, { recursive: true })) {
  if (!entry.endsWith('.d.ts')) continue
  const file = join(typesDir, entry)
  const source = await readFile(file, 'utf8')
  const stripped = source.replace(CSS_IMPORT, '')
  if (stripped !== source) await writeFile(file, stripped)
}

// 2. Empacota tudo em um arquivo. Pacotes (react, @floating-ui…) ficam externos.
const bundle = await rollup({
  input: join(typesDir, 'index.d.ts'),
  plugins: [dts({ respectExternal: false })],
  external: (id) => !id.startsWith('.') && !id.startsWith('/') && !id.startsWith(root),
  onwarn(warning, warn) {
    if (warning.code === 'CIRCULAR_DEPENDENCY') return
    warn(warning)
  },
})
await bundle.write({ file: esmOut, format: 'es' })
await bundle.close()

// 3. Mesmo conteúdo para o `require`: um .d.cts é lido como CommonJS.
await copyFile(esmOut, cjsOut)
await rm(typesDir, { recursive: true, force: true })

console.log('tipos empacotados em dist/index.d.ts e dist/index.d.cts')
