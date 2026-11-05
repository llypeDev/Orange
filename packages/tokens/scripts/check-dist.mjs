/**
 * Confere o `dist/` que vai para o npm (roda no fim do `build`): cada caminho do
 * `publishConfig` existe, a versão CommonJS carrega com `require()` como CommonJS de verdade
 * (e não como ESM, que só funciona no Node com suporte a require de ESM) e exporta os mesmos
 * nomes da versão ESM.
 */
import { existsSync, readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { dirname, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const { publishConfig } = JSON.parse(readFileSync(resolve(root, 'package.json'), 'utf8'))
const require = createRequire(import.meta.url)
const problems = []

const files = (target) =>
  typeof target === 'string' ? [target] : Object.values(target).flatMap(files)
const names = (mod) =>
  Object.keys(mod)
    .filter((key) => key !== 'default' && key !== '__esModule')
    .sort()
    .join(', ')

for (const file of [publishConfig.main, publishConfig.module, publishConfig.types]) {
  if (!existsSync(resolve(root, file))) problems.push(`${file} não existe`)
}

for (const [entry, target] of Object.entries(publishConfig.exports)) {
  const missing = files(target).filter((file) => !existsSync(resolve(root, file)))
  for (const file of missing) problems.push(`${entry}: ${file} não existe`)
  if (typeof target === 'string' || missing.length > 0) continue

  const esm = await import(pathToFileURL(resolve(root, target.import.default)).href)
  let cjs
  try {
    cjs = require(resolve(root, target.require.default))
  } catch (error) {
    problems.push(
      `${entry}: require(${target.require.default}) falhou: ${error.message.split('\n')[0]}`,
    )
    continue
  }
  if (Object.prototype.toString.call(cjs) === '[object Module]') {
    problems.push(`${entry}: ${target.require.default} foi carregado como ESM, não como CommonJS`)
  } else if (names(esm) !== names(cjs)) {
    problems.push(`${entry}: ESM exporta [${names(esm)}] e CommonJS exporta [${names(cjs)}]`)
  }
}

if (problems.length > 0) {
  console.error(`dist/ inválido:\n- ${problems.join('\n- ')}`)
  process.exit(1)
}
console.log(`dist/ ok: ${Object.keys(publishConfig.exports).length} entradas, ESM e CommonJS`)
