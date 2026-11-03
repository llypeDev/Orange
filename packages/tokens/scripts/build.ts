/**
 * Gera `css/tokens.css` a partir de `src/index.ts`.
 * Execute com `pnpm --filter @orange/tokens build`.
 */
import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  borderWidth,
  controlSize,
  layout,
  motion,
  primitives,
  radius,
  shadow,
  space,
  themes,
  typography,
  zIndex,
} from '../src/index'

const here = dirname(fileURLToPath(import.meta.url))
const out = resolve(here, '../css/tokens.css')

const decl = (name: string, value: string) => `  --or-${name}: ${value};`
const block = (entries: [string, string][]) => entries.map(([k, v]) => decl(k, v)).join('\n')
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
  ...prefixed('z', zIndex),
  ...prefixed('layout', layout),
  ...prefixed('control', controlSize),
]

const themeBlock = (name: keyof typeof themes) => block(prefixed('color', themes[name] as never))

const css = `/**
 * Orange design tokens — arquivo gerado por packages/tokens/scripts/build.ts.
 * Não edite manualmente: altere packages/tokens/src/index.ts e rode \`pnpm build:tokens\`.
 */

:root {
${block(staticTokens)}
}

/* Tema escuro (padrão) */
:root,
[data-theme='dark'] {
  color-scheme: dark;
${themeBlock('dark')}
}

/* Tema claro */
[data-theme='light'] {
  color-scheme: light;
${themeBlock('light')}
}

/* Movimento reduzido: anula durações para quem prefere menos animação */
@media (prefers-reduced-motion: reduce) {
  :root {
    --or-duration-instant: 0ms;
    --or-duration-fast: 0ms;
    --or-duration-medium: 0ms;
    --or-duration-slow: 0ms;
    --or-duration-slower: 0ms;
  }
}
`

mkdirSync(dirname(out), { recursive: true })
writeFileSync(out, css)
console.log(`tokens.css gerado em ${out}`)
