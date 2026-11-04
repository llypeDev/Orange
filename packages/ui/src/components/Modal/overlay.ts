/*
 * Infraestrutura interna das sobreposições do Orange (Modal, Drawer, Popover,
 * Tooltip, Dropdown…). Não é exportada pela biblioteca.
 *
 * - Pilha de camadas: só a camada do topo reage a Escape; cliques/foco fora de
 *   uma camada fecham apenas as camadas não modais acima do ponto clicado.
 *   Eventos vindos de portais aninhados contam como "dentro" porque são
 *   marcados pelos handlers de captura do React (que seguem a árvore React,
 *   não a árvore DOM) — assim um Select dentro de um Modal não o fecha.
 * - z-index: uma camada aberta sobre outra recebe z-index maior que a de baixo
 *   (ex.: Dropdown dentro de Modal), mesmo que o token dela seja menor.
 */
import {
  useCallback,
  useRef,
  version,
  type ReactElement,
  type Ref,
  type SyntheticEvent,
} from 'react'
import { useIsomorphicLayoutEffect } from '../../hooks'
import { getFocusableElements } from '../../utils'

/* -------------------------------------------------------------------------- */
/* Pilha de camadas                                                           */
/* -------------------------------------------------------------------------- */

export interface LayerOptions {
  /** Camadas modais bloqueiam a propagação de Escape/clique fora para baixo. */
  modal?: boolean
  /** Chamado com Escape quando esta é a camada do topo. Sem handler, Escape é ignorado. */
  onEscape?: (event: KeyboardEvent) => void
  /** Clique/toque fora desta camada (e de qualquer camada acima dela). */
  onPointerDownOutside?: (event: PointerEvent) => void
  /** Foco movido para fora desta camada (e de qualquer camada acima dela). */
  onFocusOutside?: (event: FocusEvent) => void
  /** Elementos extras considerados "dentro" (ex.: o gatilho). */
  insideElements?: () => (Element | null | undefined)[]
}

interface LayerEntry {
  events: WeakSet<Event>
  options: { current: LayerOptions }
  node: HTMLElement | null
}

const stack: LayerEntry[] = []

function isInside(entry: LayerEntry, event: Event) {
  if (entry.events.has(event)) return true
  const target = event.target
  if (!(target instanceof Node)) return false
  if (entry.node?.contains(target)) return true
  return (entry.options.current.insideElements?.() ?? []).some((el) => el?.contains(target))
}

function highestHit(event: Event) {
  for (let i = stack.length - 1; i >= 0; i--) if (isInside(stack[i], event)) return i
  return -1
}

function handleKeyDown(event: KeyboardEvent) {
  if (event.key !== 'Escape' || event.defaultPrevented || event.isComposing) return
  for (let i = stack.length - 1; i >= 0; i--) {
    const { onEscape, modal } = stack[i].options.current
    if (onEscape) {
      event.preventDefault()
      onEscape(event)
      return
    }
    if (modal) return
  }
}

function handlePointerDown(event: PointerEvent) {
  const layers = stack.slice()
  const hit = highestHit(event)
  for (let i = layers.length - 1; i > hit; i--) {
    const { modal, onPointerDownOutside } = layers[i].options.current
    if (modal) break
    onPointerDownOutside?.(event)
  }
}

function handleFocusIn(event: FocusEvent) {
  const layers = stack.slice()
  const hit = highestHit(event)
  for (let i = layers.length - 1; i > hit; i--) {
    const { modal, onFocusOutside } = layers[i].options.current
    onFocusOutside?.(event)
    if (modal) break
  }
}

function attach() {
  document.addEventListener('keydown', handleKeyDown)
  document.addEventListener('pointerdown', handlePointerDown)
  document.addEventListener('focusin', handleFocusIn)
}

function detach() {
  document.removeEventListener('keydown', handleKeyDown)
  document.removeEventListener('pointerdown', handlePointerDown)
  document.removeEventListener('focusin', handleFocusIn)
}

function removeLayer(entry: LayerEntry) {
  const index = stack.indexOf(entry)
  if (index < 0) return
  stack.splice(index, 1)
  if (stack.length === 0) detach()
}

function zIndexOf(node: HTMLElement | null): number {
  if (!node) return Number.NaN
  return Number.parseInt(getComputedStyle(node).zIndex, 10)
}

/** Garante que `entry` fique acima de todas as camadas já abertas. */
function raise(entry: LayerEntry) {
  const node = entry.node
  if (!node) return
  node.style.removeProperty('z-index')
  const below = stack.reduce((max, layer) => {
    const z = zIndexOf(layer.node)
    return Number.isNaN(z) ? max : Math.max(max, z)
  }, Number.NEGATIVE_INFINITY)
  const own = zIndexOf(node)
  if (Number.isFinite(below) && (Number.isNaN(own) || own <= below))
    node.style.zIndex = String(below + 1)
}

/**
 * Registra uma camada de sobreposição enquanto `active` for verdadeiro.
 * Espalhe `layerProps` no elemento raiz da camada e passe `setNode` como ref.
 */
export function useLayer(active: boolean, options: LayerOptions) {
  const optionsRef = useRef(options)
  optionsRef.current = options
  const entryRef = useRef<LayerEntry | null>(null)
  if (!entryRef.current)
    entryRef.current = { events: new WeakSet(), options: optionsRef, node: null }

  useIsomorphicLayoutEffect(() => {
    if (!active) return
    const entry = entryRef.current!
    raise(entry)
    stack.push(entry)
    if (stack.length === 1) attach()
    return () => removeLayer(entry)
  }, [active])

  const mark = useCallback((event: SyntheticEvent) => {
    entryRef.current!.events.add(event.nativeEvent)
  }, [])

  const setNode = useCallback((node: HTMLElement | null) => {
    entryRef.current!.node = node
  }, [])

  const isTop = useCallback(() => stack[stack.length - 1] === entryRef.current, [])

  /** Remove a camada da pilha já (antes de devolver o foco ao fechar). */
  const release = useCallback(() => removeLayer(entryRef.current!), [])

  return {
    setNode,
    isTop,
    release,
    layerProps: { onPointerDownCapture: mark, onFocusCapture: mark },
  }
}

/* -------------------------------------------------------------------------- */
/* Presença (animação de saída)                                               */
/* -------------------------------------------------------------------------- */

// A implementação vive em src/hooks (pública); reexportada para os overlays.
export { usePresence } from '../../hooks'

/* -------------------------------------------------------------------------- */
/* Utilitários                                                                */
/* -------------------------------------------------------------------------- */

/**
 * Tema do ponto de origem da sobreposição. Conteúdo em portal sai da árvore
 * de `[data-theme]`; reaplicar o tema mantém, por exemplo, um Popover claro
 * aberto a partir de uma área com tema claro dentro de uma página escura.
 */
export function getThemeScope(origin: Element | null | undefined): string | undefined {
  return origin?.closest('[data-theme]')?.getAttribute('data-theme') ?? undefined
}

const reactMajor = Number.parseInt(version, 10)

/** Lê a ref de um elemento React (React 19: `props.ref`; anteriores: `element.ref`). */
export function getElementRef(element: ReactElement): Ref<unknown> | undefined {
  if (reactMajor >= 19) return (element.props as { ref?: Ref<unknown> }).ref
  return (element as unknown as { ref?: Ref<unknown> }).ref
}

/** Foca o elemento sem rolar a página. */
export function focusElement(el: HTMLElement | null | undefined) {
  el?.focus({ preventScroll: true })
}

/**
 * Elemento focável (via Tab) que vem logo depois de `anchor` na ordem do
 * documento, ignorando os que estão dentro de `exclude`.
 */
export function getTabbableAfter(
  anchor: HTMLElement,
  exclude?: HTMLElement | null,
): HTMLElement | null {
  const all = getFocusableElements(document.body).filter(
    (el) => el.tabIndex >= 0 && !exclude?.contains(el) && !el.closest('[hidden]'),
  )
  const index = all.findIndex((el) => el === anchor || el.contains(anchor))
  if (index >= 0) return all[index + 1] ?? null
  // âncora não focável: primeiro elemento posterior a ela
  return (
    all.find((el) => anchor.compareDocumentPosition(el) & Node.DOCUMENT_POSITION_FOLLOWING) ?? null
  )
}

/** `true` quando o foco atual veio do teclado (`:focus-visible`). */
export function isFocusVisible(el: Element): boolean {
  try {
    return el.matches(':focus-visible')
  } catch {
    return true
  }
}
