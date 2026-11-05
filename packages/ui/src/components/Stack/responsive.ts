/**
 * Utilitários internos dos componentes de layout (Stack, Grid, Container).
 * Não são exportados pela biblioteca — só os tipos `ResponsiveValue` e
 * `LayoutGap` são públicos (via `Stack/index.ts`).
 */

/** Breakpoints de `@orangesys/tokens` (`breakpoints`), do menor para o maior. */
const BREAKPOINTS = ['sm', 'md', 'lg', 'xl'] as const

/**
 * Valor que pode mudar conforme a largura da janela. Mobile-first: `base` vale
 * sempre e cada breakpoint vale daquela largura para cima (sm 640px, md 768px,
 * lg 1024px, xl 1280px), até o próximo breakpoint definido.
 *
 * `direction={{ base: 'vertical', md: 'horizontal' }}`
 */
export type ResponsiveValue<T> = T | BreakpointMap<T>

type BreakpointMap<T> = { base?: T; sm?: T; md?: T; lg?: T; xl?: T }

/** Escala de espaço dos componentes de layout: `4` = `--or-space-4` (1rem). */
export type LayoutGap = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12 | 16

/** Custom properties inline e classes de presença geradas pelas props responsivas. */
export interface ResponsiveStyles {
  style: Record<string, string>
  classes: string[]
}

export const createResponsiveStyles = (): ResponsiveStyles => ({ style: {}, classes: [] })

export const gapToCss = (gap: LayoutGap) => `var(--or-space-${gap})`

/** Inteiro ≥ 1 (colunas e spans). */
export const toTrackCount = (value: number) => String(Math.max(1, Math.round(value)))

function isBreakpointMap<T>(value: ResponsiveValue<T>): value is BreakpointMap<T> {
  return typeof value === 'object' && value !== null
}

/**
 * Registra uma prop responsiva:
 * - o valor base vira `<varName>` (o CSS do componente o reseta para `initial`
 *   na raiz, então valores de um ancestral nunca vazam para dentro);
 * - cada breakpoint vira `<varName>-<bp>` + a classe `<classPrefix>-<bp>`,
 *   que liga a regra `@media (min-width: …)` correspondente no CSS.
 *
 * Breakpoints omitidos herdam o anterior (mobile-first), sem JavaScript de mídia.
 */
export function addResponsive<T>(
  out: ResponsiveStyles,
  value: ResponsiveValue<T> | undefined,
  varName: string,
  classPrefix: string,
  toCss: (value: T) => string,
) {
  if (value === undefined || value === null) return
  if (!isBreakpointMap(value)) {
    out.style[varName] = toCss(value as T)
    return
  }
  if (value.base !== undefined) out.style[varName] = toCss(value.base)
  for (const bp of BREAKPOINTS) {
    const v = value[bp]
    if (v === undefined) continue
    out.style[`${varName}-${bp}`] = toCss(v)
    out.classes.push(`${classPrefix}-${bp}`)
  }
}

/** Elementos de lista: o `list-style: none` do CSS tira a semântica no Safari, então ganham `role="list"`. */
export const isListElement = (as: unknown) => as === 'ul' || as === 'ol' || as === 'menu'
