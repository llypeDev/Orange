/**
 * Exporta os tokens no formato W3C Design Tokens (DTCG, versão 2025.10).
 *
 * Modos: o DTCG não tem modos nativos, então cada tema vira um **conjunto
 * (arquivo) por modo** — `tema/dark`, `tema/light`, `tema/dark-hc`,
 * `tema/light-hc` — com os tokens semânticos como aliases para as primitivas
 * (`{color.orange.500}`), que ficam no conjunto `primitivas`. É o formato que a
 * importação de variáveis do Figma (um arquivo JSON por modo) e o Tokens Studio
 * (conjuntos + `$themes`, que viram coleções e modos no Figma) entendem; valores
 * por modo em `$extensions` seriam ignorados pelos dois.
 */
import {
  isPrimitiveName,
  motion,
  primitives,
  radius,
  space,
  themeDefinitions,
  themeNames,
  typography,
  vizDefinition,
  vizPalettes,
  type ColorValue,
  type PrimitiveName,
  type ThemeName,
} from './index.js'

/* -------------------------------------------------------------------------- */
/* Tipos                                                                      */
/* -------------------------------------------------------------------------- */

export type DtcgType =
  | 'color'
  | 'dimension'
  | 'fontFamily'
  | 'fontWeight'
  | 'duration'
  | 'cubicBezier'
  | 'number'

/** Cor no formato do DTCG 2025.10; `hex` é a reserva para ferramentas mais antigas. */
export interface DtcgColor {
  colorSpace: 'srgb'
  components: [number, number, number]
  alpha?: number
  hex: string
}

export interface DtcgDimension {
  value: number
  unit: 'px' | 'rem'
}

export interface DtcgDuration {
  value: number
  unit: 'ms' | 's'
}

export interface DtcgToken {
  $value: unknown
  $type?: DtcgType
  $description?: string
  $extensions?: Record<string, unknown>
}

export interface DtcgGroup {
  $type?: DtcgType
  $description?: string
  [name: string]: unknown
}

/** Token com o caminho completo e o `$type` (e a `$description`) já herdados dos grupos. */
export interface FlatToken {
  path: string[]
  type: DtcgType
  token: DtcgToken
  description?: string
}

/** Tema do Tokens Studio (`$themes.json`): cada grupo vira uma coleção, cada tema um modo. */
export interface TokensStudioTheme {
  id: string
  name: string
  group: string
  selectedTokenSets: Record<string, 'enabled' | 'source' | 'disabled'>
}

/* -------------------------------------------------------------------------- */
/* Nomes                                                                      */
/* -------------------------------------------------------------------------- */

/** Conjuntos de tokens (um arquivo cada): as primitivas e um por tema/modo. */
export const dtcgSets = {
  primitives: 'primitivas',
  theme: (name: ThemeName) => `tema/${name}`,
} as const

/** Coleções de variáveis no Figma (também os grupos de temas do Tokens Studio). */
export const figmaCollections = {
  primitives: 'Orange / Primitivas',
  theme: 'Orange / Tema',
} as const

/** Único modo da coleção de primitivas. Na coleção de tema, os modos são os nomes dos temas. */
export const primitivesMode = 'valor'

/** Chave em `$extensions` com a custom property CSS de cada token (`--or-color-bg`). */
export const cssVarExtension = 'orange.cssVar'

/* -------------------------------------------------------------------------- */
/* Conversões                                                                 */
/* -------------------------------------------------------------------------- */

const round = (n: number) => Math.round(n * 10000) / 10000
const toHex = (channels: number[]) =>
  `#${channels.map((c) => Math.round(c).toString(16).padStart(2, '0')).join('')}`

/** `#rrggbb` ou `rgba(r, g, b, a)` → cor DTCG. */
export function toDtcgColor(value: string): DtcgColor {
  const hex = /^#([0-9a-f]{6})$/i.exec(value.trim())
  const rgba = /^rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)\s*(?:,\s*([\d.]+)\s*)?\)$/i.exec(
    value.trim(),
  )
  let channels: number[]
  let alpha = 1
  if (hex) {
    channels = [0, 2, 4].map((i) => parseInt(hex[1].slice(i, i + 2), 16))
  } else if (rgba) {
    channels = rgba.slice(1, 4).map(Number)
    alpha = rgba[4] === undefined ? 1 : Number(rgba[4])
  } else {
    throw new Error(`Cor não suportada no DTCG: ${value}`)
  }
  const color: DtcgColor = {
    colorSpace: 'srgb',
    components: channels.map((c) => round(c / 255)) as [number, number, number],
    hex: toHex(channels),
  }
  if (alpha < 1) color.alpha = alpha
  return color
}

function toDimension(value: string): DtcgDimension {
  if (value === '0') return { value: 0, unit: 'px' }
  const match = /^(-?[\d.]+)(px|rem)$/.exec(value)
  if (!match) throw new Error(`Dimensão não suportada no DTCG: ${value}`)
  return { value: Number(match[1]), unit: match[2] as DtcgDimension['unit'] }
}

function toDuration(value: string): DtcgDuration {
  const match = /^([\d.]+)(ms|s)$/.exec(value)
  if (!match) throw new Error(`Duração não suportada no DTCG: ${value}`)
  return { value: Number(match[1]), unit: match[2] as DtcgDuration['unit'] }
}

function toCubicBezier(value: string): [number, number, number, number] {
  const match = /^cubic-bezier\(([^)]+)\)$/.exec(value)
  if (!match) throw new Error(`Curva não suportada no DTCG: ${value}`)
  return match[1].split(',').map((n) => Number(n.trim())) as [number, number, number, number]
}

const toFontFamily = (value: string) =>
  value.split(',').map((part) => part.trim().replace(/^["']|["']$/g, ''))

/** Caminho DTCG de uma primitiva: `orange-500` → `color.orange.500`. */
export function primitivePath(name: PrimitiveName): string {
  const at = name.lastIndexOf('-')
  return `color.${name.slice(0, at)}.${name.slice(at + 1)}`
}

/** `{color.orange.500}` → `['color', 'orange', '500']`; `null` se não for alias. */
export function parseAlias(value: unknown): string[] | null {
  if (typeof value !== 'string') return null
  const match = /^\{([^{}]+)\}$/.exec(value)
  return match ? match[1].split('.') : null
}

/* -------------------------------------------------------------------------- */
/* Conjuntos                                                                  */
/* -------------------------------------------------------------------------- */

const token = ($value: unknown, cssVar: string): DtcgToken => ({
  $value,
  $extensions: { [cssVarExtension]: cssVar },
})

function group<V>(
  type: DtcgType,
  values: Record<string, V>,
  convert: (value: V) => unknown,
  cssVar: (key: string) => string,
  description?: string,
): DtcgGroup {
  return {
    $type: type,
    ...(description ? { $description: description } : {}),
    ...Object.fromEntries(
      Object.entries(values).map(([key, value]) => [key, token(convert(value), cssVar(key))]),
    ),
  }
}

/** Primitivas: paletas de cor, espaço, raio, tipografia e movimento. */
export function buildPrimitiveTokens(): DtcgGroup {
  const palettes = primitives as unknown as Record<string, Record<string, string>>
  return {
    color: {
      $type: 'color',
      ...Object.fromEntries(
        Object.entries(palettes).map(([family, scale]) => [
          family,
          Object.fromEntries(
            Object.entries(scale).map(([step, hex]) => [
              step,
              token(toDtcgColor(hex), `--or-palette-${family}-${step}`),
            ]),
          ),
        ]),
      ),
    },
    space: group('dimension', space, toDimension, (k) => `--or-space-${k}`),
    radius: group('dimension', radius, toDimension, (k) => `--or-radius-${k}`),
    font: {
      family: group('fontFamily', typography.fontFamily, toFontFamily, (k) => `--or-font-${k}`),
      size: group('dimension', typography.fontSize, toDimension, (k) => `--or-text-${k}`),
      weight: group('fontWeight', typography.fontWeight, Number, (k) => `--or-weight-${k}`),
      'line-height': group(
        'number',
        typography.lineHeight,
        Number,
        (k) => `--or-leading-${k}`,
        'Multiplicador do tamanho da fonte (sem unidade).',
      ),
      'letter-spacing': group(
        'number',
        typography.letterSpacing,
        (v: string) => parseFloat(v),
        (k) => `--or-tracking-${k}`,
        'Em em (fração do tamanho da fonte): o DTCG só aceita px e rem em dimension.',
      ),
    },
    motion: {
      duration: group('duration', motion.duration, toDuration, (k) => `--or-duration-${k}`),
      easing: group('cubicBezier', motion.easing, toCubicBezier, (k) => `--or-ease-${k}`),
      distance: group('dimension', motion.distance, toDimension, (k) => `--or-distance-${k}`),
      stagger: { $type: 'duration', ...token(toDuration(motion.stagger), '--or-stagger') },
    },
  }
}

const colorValue = (value: ColorValue) =>
  isPrimitiveName(value) ? `{${primitivePath(value)}}` : toDtcgColor(value)

/**
 * Tokens semânticos de um tema (um modo): cada `--or-color-*` como alias para a
 * primitiva de origem, ou como cor crua quando o tema usa transparência/ajuste fino.
 */
export function buildThemeTokens(name: ThemeName): DtcgGroup {
  const entries: [string, ColorValue][] = [
    ...(Object.entries(themeDefinitions[name]) as [string, ColorValue][]),
    ...(Object.entries(vizDefinition(vizPalettes[name])) as [string, ColorValue][]),
  ]
  return {
    color: {
      $type: 'color',
      ...Object.fromEntries(
        entries.map(([key, value]) => [key, token(colorValue(value), `--or-color-${key}`)]),
      ),
    },
  }
}

/** Todos os conjuntos, na ordem de resolução: primitivas primeiro, depois um por tema. */
export function buildTokenSets(): Record<string, DtcgGroup> {
  return {
    [dtcgSets.primitives]: buildPrimitiveTokens(),
    ...Object.fromEntries(themeNames.map((name) => [dtcgSets.theme(name), buildThemeTokens(name)])),
  }
}

/** `$themes` do Tokens Studio: grupo "Orange / Primitivas" (1 modo) e "Orange / Tema" (4 modos). */
export function buildTokensStudioThemes(): TokensStudioTheme[] {
  return [
    {
      id: 'orange-primitivas',
      name: primitivesMode,
      group: figmaCollections.primitives,
      selectedTokenSets: { [dtcgSets.primitives]: 'enabled' },
    },
    ...themeNames.map(
      (name): TokensStudioTheme => ({
        id: `orange-tema-${name}`,
        name,
        group: figmaCollections.theme,
        selectedTokenSets: { [dtcgSets.primitives]: 'source', [dtcgSets.theme(name)]: 'enabled' },
      }),
    ),
  ]
}

const metadata = () => ({ tokenSetOrder: Object.keys(buildTokenSets()) })

/**
 * Um arquivo DTCG por conjunto (`primitivas.json`, `tema/dark.json`…) mais o
 * `$themes.json` e o `$metadata.json` do Tokens Studio (sincronização em pasta).
 */
export function buildDtcgFiles(): Record<string, unknown> {
  return {
    ...Object.fromEntries(
      Object.entries(buildTokenSets()).map(([set, tokens]) => [`${set}.json`, tokens]),
    ),
    '$themes.json': buildTokensStudioThemes(),
    '$metadata.json': metadata(),
  }
}

/** Arquivo único (`tokens.dtcg.json`): os conjuntos lado a lado, mais `$themes` e `$metadata`. */
export function buildDtcgBundle(): Record<string, unknown> {
  return { ...buildTokenSets(), $themes: buildTokensStudioThemes(), $metadata: metadata() }
}

/* -------------------------------------------------------------------------- */
/* Leitura                                                                    */
/* -------------------------------------------------------------------------- */

const isToken = (node: unknown): node is DtcgToken =>
  typeof node === 'object' && node !== null && '$value' in node

/** Lista os tokens de um grupo com o caminho completo e o tipo (e a descrição) herdados. */
export function flattenTokens(
  root: DtcgGroup,
  path: string[] = [],
  inherited: { type?: DtcgType; description?: string } = {},
): FlatToken[] {
  const context = {
    type: root.$type ?? inherited.type,
    description: root.$description ?? inherited.description,
  }
  return Object.entries(root).flatMap(([key, node]): FlatToken[] => {
    if (key.startsWith('$') || typeof node !== 'object' || node === null) return []
    if (isToken(node)) {
      const type = node.$type ?? context.type
      if (!type) throw new Error(`Token sem $type: ${[...path, key].join('.')}`)
      const description = node.$description ?? context.description
      return [{ path: [...path, key], type, token: node, ...(description ? { description } : {}) }]
    }
    return flattenTokens(node as DtcgGroup, [...path, key], context)
  })
}
