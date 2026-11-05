import type { Ref, RefCallback, SyntheticEvent } from 'react'

export type ClassValue = string | number | false | null | undefined | Record<string, unknown>

/** Junta classes CSS condicionalmente: `cx('a', cond && 'b', { c: true })`. */
export function cx(...values: ClassValue[]): string {
  const out: string[] = []
  for (const v of values) {
    if (!v) continue
    if (typeof v === 'string' || typeof v === 'number') out.push(String(v))
    else for (const [k, on] of Object.entries(v)) if (on) out.push(k)
  }
  return out.join(' ')
}

/** Atribui um valor a qualquer tipo de ref. */
export function setRef<T>(ref: Ref<T> | undefined, value: T | null) {
  if (typeof ref === 'function') ref(value)
  else if (ref && typeof ref === 'object') (ref as { current: T | null }).current = value
}

/** Combina várias refs em uma única ref callback. */
export function mergeRefs<T>(...refs: (Ref<T> | undefined)[]): RefCallback<T> {
  return (value) => {
    for (const ref of refs) setRef(ref, value)
  }
}

/**
 * Compõe handlers de evento: chama o do usuário primeiro e só executa o interno
 * se `event.defaultPrevented` não tiver sido marcado.
 */
export function composeEventHandlers<E extends SyntheticEvent | Event>(
  external: ((event: E) => void) | undefined,
  internal: (event: E) => void,
) {
  return (event: E) => {
    external?.(event)
    if (!event.defaultPrevented) internal(event)
  }
}

const FOCUSABLE = [
  'a[href]',
  'area[href]',
  'button:not([disabled])',
  'input:not([disabled]):not([type="hidden"])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  'iframe',
  'audio[controls]',
  'video[controls]',
  '[contenteditable]:not([contenteditable="false"])',
  '[tabindex]:not([tabindex="-1"])',
].join(',')

/** Lista elementos focáveis visíveis dentro de `root`, na ordem do DOM. */
export function getFocusableElements(root: HTMLElement | null): HTMLElement[] {
  if (!root) return []
  return Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
    (el) => !el.hasAttribute('inert') && !el.closest('[inert]') && el.getAttribute('aria-hidden') !== 'true',
  )
}

/** Mantém `value` dentro do intervalo [min, max]. */
export function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

/** Verdadeiro quando o código roda no navegador. */
export const canUseDOM = typeof window !== 'undefined' && typeof document !== 'undefined'

/** Gera um array [start, ..., end]. */
export function range(start: number, end: number): number[] {
  const length = end - start + 1
  return Array.from({ length: Math.max(0, length) }, (_, i) => start + i)
}

const warned = new Set<string>()

/**
 * Verdadeiro fora de produção. Bundlers (Vite, webpack, Next…) substituem
 * `process.env.NODE_ENV` por uma string, então a checagem vira constante e o
 * código de aviso some do bundle de produção. Sem bundler e sem `process`
 * (ex.: `<script type="module">` direto no navegador), fica em silêncio.
 */
function isDevelopment(): boolean {
  try {
    return process.env.NODE_ENV !== 'production'
  } catch {
    return false
  }
}

/** Escreve `[Orange] mensagem` no console uma única vez por chave. */
function warnOnce(key: string, message: string) {
  if (warned.has(key)) return
  warned.add(key)
  console.warn(`[Orange] ${message}`)
}

/**
 * Emite um aviso de uso incorreto apenas em desenvolvimento (uma vez por
 * mensagem). Em produção, bundlers substituem `process.env.NODE_ENV` e o
 * código é eliminado.
 */
export function devWarning(condition: boolean, message: string) {
  if (!condition || !isDevelopment()) return
  warnOnce(message, message)
}

/**
 * Avisa, só em desenvolvimento e uma única vez por `id`, que uma API pública
 * está depreciada. Chame quando a API antiga for **usada** — não no import:
 *
 * ```ts
 * if (variant === 'ghost') {
 *   deprecate(
 *     'Button: `variant="ghost"` está depreciado e sai na v1.0. Use `variant="text"`.',
 *     'button.variant.ghost',
 *   )
 * }
 * ```
 *
 * A mensagem diz o que trocar e em qual versão a API sai. `id` estável
 * (`componente.prop.valor`) evita repetir o aviso a cada render; sem ele, a
 * própria mensagem vira o id. Política completa: /usage/versioning.
 */
export function deprecate(message: string, id: string = message) {
  if (!isDevelopment()) return
  warnOnce(`deprecate:${id}`, `Depreciado: ${message}`)
}
