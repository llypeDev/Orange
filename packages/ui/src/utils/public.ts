/**
 * Utilitários exportados por `@orangesys/ui`.
 *
 * Ficam na API pública os que ajudam a compor com os componentes: `cx` (classes),
 * `mergeRefs` e `composeEventHandlers` (envolver um componente sem perder a ref nem o
 * handler interno). Os genéricos abaixo saem da API pública na v1.0: a biblioteca
 * continua usando as versões internas de `./index`, e só o export público avisa.
 */
import type { Ref } from 'react'
import {
  clamp as clampInternal,
  deprecate,
  getFocusableElements as getFocusableElementsInternal,
  range as rangeInternal,
  setRef as setRefInternal,
} from './index'

export { composeEventHandlers, cx, mergeRefs } from './index'
export type { ClassValue } from './index'

/** @deprecated Sai da API pública na v1.0. Use `Math.min(Math.max(value, min), max)`. */
export function clamp(value: number, min: number, max: number): number {
  deprecate(
    '`clamp` sai da API pública de @orangesys/ui na v1.0. Use `Math.min(Math.max(value, min), max)`.',
    'utils.clamp',
  )
  return clampInternal(value, min, max)
}

/**
 * @deprecated Sai da API pública na v1.0. Use
 * `Array.from({ length: end - start + 1 }, (_, i) => start + i)`.
 */
export function range(start: number, end: number): number[] {
  deprecate(
    '`range` sai da API pública de @orangesys/ui na v1.0. Use `Array.from({ length: end - start + 1 }, (_, i) => start + i)`.',
    'utils.range',
  )
  return rangeInternal(start, end)
}

/** @deprecated Sai da API pública na v1.0. Use `mergeRefs`, que já atribui a qualquer tipo de ref. */
export function setRef<T>(ref: Ref<T> | undefined, value: T | null): void {
  deprecate(
    '`setRef` sai da API pública de @orangesys/ui na v1.0. Use `mergeRefs`, que já atribui a qualquer tipo de ref.',
    'utils.setRef',
  )
  setRefInternal(ref, value)
}

/**
 * @deprecated Sai da API pública na v1.0. Para prender o foco, use `useFocusTrap`; para outros
 * casos, consulte os elementos focáveis no próprio projeto.
 */
export function getFocusableElements(root: HTMLElement | null): HTMLElement[] {
  deprecate(
    '`getFocusableElements` sai da API pública de @orangesys/ui na v1.0. Para prender o foco, use `useFocusTrap`.',
    'utils.getFocusableElements',
  )
  return getFocusableElementsInternal(root)
}
