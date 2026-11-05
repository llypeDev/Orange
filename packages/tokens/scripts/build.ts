/**
 * Gera `css/tokens.css` e os arquivos DTCG (`dist/tokens.dtcg.json` e
 * `dist/tokens/**`) a partir de `src/index.ts`.
 * Execute com `pnpm --filter @orange/tokens build`.
 */
import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { buildDtcgBundle, buildDtcgFiles } from '../src/dtcg'
import {
  borderWidth,
  controlSize,
  layout,
  motion,
  primitives,
  radius,
  shadow,
  space,
  themeMeta,
  themeNames,
  themes,
  typography,
  vizThemes,
  zIndex,
  type ThemeName,
} from '../src/index'

const here = dirname(fileURLToPath(import.meta.url))
const root = resolve(here, '..')
const out = resolve(root, 'css/tokens.css')

const decl = (name: string, value: string, indent = '  ') => `${indent}--or-${name}: ${value};`
const block = (entries: [string, string][], indent = '  ') =>
  entries.map(([k, v]) => decl(k, v, indent)).join('\n')
const prefixed = (prefix: string, obj: Record<string | number, string>): [string, string][] =>
  Object.entries(obj).map(([k, v]) => [`${prefix}-${k}`, v])

const staticTokens: [string, string][] = [
  ...Object.entries(primitives).flatMap(([palette, scale]) =>
    prefixed(`palette-${palette}`, scale as Record<string, string>),
  ),
  ...prefixed('font', typography.fontFamily),
  ...prefixed('text', typography.fontSize),
  ...prefixed('weight', typography.fontWeight),
  ...prefixed('leading', typography.lineHeight),
  ...prefixed('tracking', typography.letterSpacing),
  ...prefixed('space', space),
  ...prefixed('radius', radius),
  ...prefixed('border', borderWidth),
  ...prefixed('shadow', shadow),
  ...prefixed('duration', motion.duration),
  ...prefixed('ease', motion.easing),
  ...prefixed('distance', motion.distance),
  ['stagger', motion.stagger],
  ...prefixed('z', zIndex),
  ...prefixed('layout', layout),
  ...prefixed('control', controlSize),
]

const themeBody = (name: ThemeName, indent = '  ') =>
  [
    `${indent}color-scheme: ${themeMeta[name].colorScheme};`,
    block(prefixed('color', themes[name] as never), indent),
    `${indent}/* Visualização de dados: categórica, "outros", sequencial e divergente */`,
    block(prefixed('color', vizThemes[name]), indent),
  ].join('\n')

const themeTitles: Record<ThemeName, string> = {
  dark: 'Tema escuro (padrão)',
  light: 'Tema claro',
  'dark-hc': 'Tema escuro de alto contraste (WCAG AAA)',
  'light-hc': 'Tema claro de alto contraste (WCAG AAA)',
}

/** O tema padrão (escuro) também vale para `:root`, sem `data-theme`. */
const defaultTheme: ThemeName = 'dark'
const defaultHighContrast = themeNames.find(
  (name) =>
    themeMeta[name].highContrast &&
    themeMeta[name].colorScheme === themeMeta[defaultTheme].colorScheme,
) as ThemeName

const themeCss = themeNames
  .map((name) => {
    const selector =
      name === defaultTheme ? `:root,\n[data-theme='${name}']` : `[data-theme='${name}']`
    return `/* ${themeTitles[name]} */\n${selector} {\n${themeBody(name)}\n}`
  })
  .join('\n\n')

const css = `/**
 * Orange design tokens — arquivo gerado por packages/tokens/scripts/build.ts.
 * Não edite manualmente: altere packages/tokens/src/index.ts e rode \`pnpm build:tokens\`.
 */

:root {
${block(staticTokens)}
}

${themeCss}

/*
 * Alto contraste automático: sem tema escolhido (nenhum data-theme no <html>),
 * quem pede mais contraste ao sistema recebe o ${defaultHighContrast} no lugar do ${defaultTheme}.
 * Com o OrangeProvider em theme="system", o provider faz a mesma troca para os
 * dois esquemas (dark → dark-hc, light → light-hc). Um data-theme explícito vence.
 */
@media (prefers-contrast: more) {
  :root:not([data-theme]) {
${themeBody(defaultHighContrast, '    ')}
  }
}

/* Movimento reduzido: anula durações para quem prefere menos animação */
@media (prefers-reduced-motion: reduce) {
  :root {
${Object.keys(motion.duration).map((k) => `    --or-duration-${k}: 0ms;`).join('\n')}
${Object.keys(motion.distance).map((k) => `    --or-distance-${k}: 0px;`).join('\n')}
    --or-stagger: 0ms;
  }
}
`

function write(path: string, content: string) {
  mkdirSync(dirname(path), { recursive: true })
  writeFileSync(path, content)
}

const json = (value: unknown) => `${JSON.stringify(value, null, 2)}\n`

write(out, css)
console.log(`tokens.css gerado em ${relative(root, out)}`)

// DTCG: um arquivo por conjunto (primitivas + um por modo/tema) e um pacote único.
const dtcgDir = resolve(root, 'dist/tokens')
const files = buildDtcgFiles()
for (const [path, content] of Object.entries(files)) write(resolve(dtcgDir, path), json(content))
console.log(`DTCG: ${Object.keys(files).length} arquivos em ${relative(root, dtcgDir)}/`)

const bundle = resolve(root, 'dist/tokens.dtcg.json')
write(bundle, json(buildDtcgBundle()))
console.log(`DTCG: pacote único em ${relative(root, bundle)}`)
