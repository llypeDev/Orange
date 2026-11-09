/**
 * CSS por componente no pacote publicado (plugin do build, usado pelo `vite.config.ts`).
 *
 * O `dist/styles.css` continua sendo o CSS inteiro da biblioteca. Este plugin publica, ao lado
 * dele, o CSS de cada módulo e uma segunda entrada, `@orangesys/ui/with-css`, em que cada
 * componente importa só o CSS de que precisa — o bundler de quem usa leva para a página apenas o
 * CSS dos componentes importados:
 *
 *   dist/css/base.css                       tokens, reset, controles e movimento (styles/index.css)
 *   dist/css/components/Button/Button.css   o CSS de cada módulo, minificado como o styles.css
 *   dist/esm/with-css/index.js              mesmos exports de dist/esm/index.js
 *   dist/esm/with-css/components/…          um módulo fino por componente: importa o CSS e reexporta
 *
 * O CSS de um componente é o dele e o de tudo o que ele importa, na ordem do grafo de módulos
 * (dependências antes): a mesma ordem relativa do `styles.css`. Como são imports de JavaScript,
 * cada arquivo entra uma vez só, na primeira vez em que aparece, em qualquer bundler.
 *
 * O build falha se um módulo usar uma classe `or-*` cujo CSS não está entre os que ele importa:
 * com o `styles.css` isso passaria despercebido; com o CSS por componente, sairia sem estilo.
 */
import { createRequire } from 'node:module'
import { posix, relative, resolve } from 'node:path'
import type { Plugin, ResolvedConfig } from 'vite'

/** Nome da entrada: `@orangesys/ui/with-css` → `dist/esm/with-css/index.js`. */
const ENTRY = 'with-css'

interface Lightning {
  transform(options: Record<string, unknown>): {
    code: Uint8Array
    warnings: { message: string }[]
  }
}

// A mesma lightningcss que o Vite usa para minificar o styles.css (é dependência dele, não nossa).
const requireHere = createRequire(import.meta.url)
const lightning = createRequire(requireHere.resolve('vite'))('lightningcss') as Lightning

/** Nomes de navegador do `build.cssTarget` (formato do esbuild) → os da lightningcss. */
const BROWSERS: Record<string, string | false> = {
  chrome: 'chrome',
  edge: 'edge',
  firefox: 'firefox',
  ie: 'ie',
  ios: 'ios_saf',
  opera: 'opera',
  safari: 'safari',
  node: false,
  hermes: false,
  rhino: false,
}

/** `['chrome107', 'safari16.4']` → `{ chrome: 107 << 16, safari: (16 << 16) | (4 << 8) }`, como o Vite. */
function lightningTargets(target: unknown): Record<string, number> | undefined {
  const entries = (Array.isArray(target) ? target : target ? [target] : []) as string[]
  const targets: Record<string, number> = {}
  for (const entry of entries) {
    if (entry === 'esnext') continue
    const at = entry.search(/\d/)
    const browser = at > 0 ? BROWSERS[entry.slice(0, at)] : undefined
    if (browser === false) continue
    const [major, minor = 0] = entry
      .slice(at)
      .split('.')
      .map((part) => Number.parseInt(part, 10))
    if (!browser || Number.isNaN(major) || Number.isNaN(minor))
      throw new Error(`component-css: alvo de CSS não reconhecido: "${entry}"`)
    const version = (major << 16) | (minor << 8)
    if (!targets[browser] || version < targets[browser]) targets[browser] = version
  }
  return Object.keys(targets).length ? targets : undefined
}

const stripQuery = (id: string) => id.split('?')[0]
const isCss = (id: string) => stripQuery(id).endsWith('.css')
const toPosix = (path: string) => path.replaceAll('\\', '/')

/** `./x.js` relativo a `from` (os dois são caminhos dentro de dist, com `/`). */
function importPath(from: string, to: string) {
  const path = posix.relative(posix.dirname(from), to)
  return path.startsWith('.') ? path : `./${path}`
}

/** `a, b as c` → `[['a', 'a'], ['b', 'c']]` (nome de origem, nome local). */
function parseSpecifiers(text: string): [string, string][] {
  return text
    .split(',')
    .map((part) => part.trim())
    .filter(Boolean)
    .map((part) => {
      const [name, alias] = part.split(/\s+as\s+/)
      return [name, alias ?? name]
    })
}

/**
 * Classes usadas num módulo cujo CSS vem de outro lugar, de propósito. Chave: caminho do módulo
 * em `src`; valor: as classes e o motivo. Mantenha vazio sempre que der — a saída certa costuma
 * ser importar o componente dono da classe.
 */
const ALLOWED: Record<string, { classes: string[]; why: string }> = {}

export function componentCss(): Plugin {
  const srcDir = toPosix(resolve(import.meta.dirname, '../src'))
  const globalCss = `${srcDir}/styles/index.css`
  /** Módulo CSS → o CSS depois do pipeline do Vite (com os @import resolvidos). */
  const sources = new Map<string, string>()
  let config: ResolvedConfig

  const minify = (css: string, filename: string) => {
    const { code, warnings } = lightning.transform({
      ...config.css.lightningcss,
      targets: lightningTargets(config.build.cssTarget),
      filename,
      code: Buffer.from(css),
      minify: true,
      cssModules: undefined,
      visitor: undefined,
      customAtRules: undefined,
    })
    for (const warning of warnings)
      config.logger.warn(`[component-css] ${filename}: ${warning.message}`)
    return `${new TextDecoder().decode(code)}\n`
  }

  return {
    name: 'orange:component-css',
    apply: 'build',
    configResolved(resolved) {
      config = resolved
    },
    // Plugin "normal": roda depois do vite:css (que resolve os @import) e antes do vite:css-post
    // (que troca o CSS por JavaScript) — aqui o código do módulo ainda é CSS.
    transform(code, id) {
      if (isCss(id)) sources.set(toPosix(stripQuery(id)), code)
      return null
    },
    generateBundle(options, bundle) {
      if (options.format !== 'es') return
      const index = bundle['esm/index.js']
      if (!index || index.type !== 'chunk')
        throw new Error('component-css: dist/esm/index.js não encontrado')

      // Módulo de origem de cada arquivo de saída (preserveModules: um para um).
      const sourceOf = new Map<string, string>()
      for (const chunk of Object.values(bundle)) {
        if (chunk.type === 'chunk' && chunk.facadeModuleId)
          sourceOf.set(chunk.fileName, chunk.facadeModuleId)
      }

      // CSS de um módulo: o dele e o de tudo o que ele importa, dependências antes — a ordem em
      // que os módulos executam (busca em profundidade, cada módulo uma vez).
      const closures = new Map<string, { css: string[]; modules: string[] }>()
      const closure = (root: string) => {
        const known = closures.get(root)
        if (known) return known
        const css: string[] = []
        const modules: string[] = []
        const visited = new Set<string>()
        const visit = (id: string) => {
          if (visited.has(id)) return
          visited.add(id)
          modules.push(id)
          for (const imported of this.getModuleInfo(id)?.importedIds ?? []) {
            const file = toPosix(stripQuery(imported))
            if (isCss(file)) {
              if (file !== globalCss && sources.has(file) && !css.includes(file)) css.push(file)
            } else if (file.startsWith(`${srcDir}/`)) {
              visit(imported)
            }
          }
        }
        visit(root)
        const result = { css, modules }
        closures.set(root, result)
        return result
      }

      const cssFile = (file: string) =>
        file === globalCss ? 'css/base.css' : `css/${relative(srcDir, file).replaceAll('\\', '/')}`

      // --- Guarda: o CSS de cada bloco usado está entre os importados --------------------------
      // Um bloco (`or-button`, de `or-button__icon--start`) pertence aos arquivos em que uma classe
      // dele abre um seletor. `.or-split-button .or-button__icon` não torna o SplitButton dono do
      // bloco do Button.
      const blockOf = (name: string) => name.split(/__|--/)[0]
      const withoutComments = (code: string) =>
        code.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:'"`])\/\/.*$/gm, '$1')
      const owners = new Map<string, Set<string>>() // bloco → arquivos CSS donos
      for (const [file, css] of sources) {
        for (const match of withoutComments(css).matchAll(/(?:^|[{},])\s*\.(or-[a-zA-Z0-9_-]+)/g)) {
          const block = blockOf(match[1])
          owners.set(block, (owners.get(block) ?? new Set()).add(file))
        }
      }
      const ownersOf = (block: string) =>
        // `or-heading--${size}` chega inteiro; `or-text-${size}` chega como o prefixo `or-text-`.
        block.endsWith('-')
          ? [...owners]
              .filter(([name]) => name.startsWith(block))
              .flatMap(([, files]) => [...files])
          : [...(owners.get(block) ?? [])]
      const references = new Map<string, Set<string>>() // módulo → blocos usados como classe
      const referencesOf = (id: string) => {
        let blocks = references.get(id)
        if (!blocks) {
          blocks = new Set()
          const code = withoutComments(this.getModuleInfo(id)?.code ?? '')
          // `or-…` que não é `--or-token`, `data-or-…`, parte de outra palavra nem um seletor
          // (`closest('.or-field')` procura um elemento; não precisa do CSS dele).
          for (const match of code.matchAll(/(?<![\w.-])or-[a-z][a-z0-9_-]*/g))
            blocks.add(blockOf(match[0]))
          references.set(id, blocks)
        }
        return blocks
      }
      const problems: string[] = []
      const check = (root: string) => {
        const { css, modules } = closure(root)
        const available = new Set([globalCss, ...css])
        for (const id of modules) {
          const name = relative(srcDir, toPosix(stripQuery(id))).replaceAll('\\', '/')
          const allowed = ALLOWED[name]?.classes ?? []
          const missing = [...referencesOf(id)].filter((block) => {
            if (allowed.includes(block)) return false
            const files = ownersOf(block)
            return files.length > 0 && !files.some((file) => available.has(file))
          })
          if (missing.length) {
            const line = `  ${name}: ${missing.sort().join(', ')}`
            if (!problems.includes(line)) problems.push(line)
          }
        }
      }

      // --- Entrada with-css -------------------------------------------------------------------
      // O índice publicado é uma lista de `import { … } from "./x.js"` e um `export { … }` no fim.
      const exported = new Map<string, string[]>() // nome local → nomes exportados
      const exportList = index.code.match(/export\s*\{([^}]*)\}\s*;?\s*$/)
      if (!exportList) throw new Error('component-css: export do índice não encontrado')
      for (const [local, name] of parseSpecifiers(exportList[1]))
        exported.set(local, [...(exported.get(local) ?? []), name])

      const entryFile = `esm/${ENTRY}/index.js`
      const lines: string[] = []
      const emitted = new Set<string>([globalCss])
      let wrappers = 0
      for (const match of index.code.matchAll(
        /^import\s*\{([^}]*)\}\s*from\s*["']([^"']+)["'];?$/gm,
      )) {
        const target = posix.join('esm', match[2])
        // [nome no módulo de origem, nome exportado pelo pacote]
        const pairs = parseSpecifiers(match[1]).flatMap(([name, local]) =>
          (exported.get(local) ?? []).map((as): [string, string] => [name, as]),
        )
        if (!pairs.length) continue
        const source = sourceOf.get(target)
        if (!source) throw new Error(`component-css: módulo de origem de ${target} não encontrado`)
        check(source)
        // O base.css vem primeiro em todo módulo — inclusive nos que não têm CSS próprio (hooks,
        // provider): qualquer import desta entrada traz os tokens e o reset, antes do resto.
        const css = [globalCss, ...closure(source).css]
        css.forEach((file) => emitted.add(file))
        // O módulo declara os exports (`export const Button = …`) em vez de só reexportar: um
        // módulo que só reexporta é pulado pelo bundler — quem importa `Button` é ligado direto
        // ao módulo de origem e os imports de CSS daqui seriam descartados. Pelo mesmo motivo o
        // base.css não pode ficar só no índice.
        const wrapper = posix.join('esm', ENTRY, match[2])
        const exportedNames = pairs.map(([, as]) => as)
        const aliases = pairs.map(([name, as]) => `${name} as _${as}`).join(', ')
        this.emitFile({
          type: 'asset',
          fileName: wrapper,
          source: [
            ...css.map((file) => `import ${JSON.stringify(importPath(wrapper, cssFile(file)))};`),
            `import { ${aliases} } from ${JSON.stringify(importPath(wrapper, target))};`,
            ...exportedNames.map((name) => `export const ${name} = _${name};`),
            '',
          ].join('\n'),
        })
        wrappers++
        lines.push(
          `export { ${exportedNames.join(', ')} } from ${JSON.stringify(importPath(entryFile, wrapper))};`,
        )
      }
      if (problems.length)
        throw new Error(
          [
            'component-css: blocos de classe usados sem o CSS deles entre os imports.',
            'Com @orangesys/ui/with-css ficariam sem estilo. Importe no módulo o componente dono',
            'do bloco (ou o CSS dele), ou registre a exceção em ALLOWED com o motivo:',
            ...problems,
          ].join('\n'),
        )
      this.emitFile({ type: 'asset', fileName: entryFile, source: `${lines.join('\n')}\n` })

      for (const file of emitted) {
        const css = sources.get(file)
        if (css === undefined) throw new Error(`component-css: CSS de ${file} não capturado`)
        this.emitFile({
          type: 'asset',
          fileName: cssFile(file),
          source: minify(css, cssFile(file)),
        })
      }
      config.logger.info(
        `component-css: ${emitted.size} arquivos em dist/css e ${wrappers} módulos em dist/esm/${ENTRY}`,
      )
    },
  }
}
