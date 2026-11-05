import {
  forwardRef,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type FocusEvent,
  type HTMLAttributes,
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent as ReactPointerEvent,
  type ReactElement,
  type ReactNode,
  type Ref,
  type RefCallback,
} from 'react'
import { useControllableState, useId, useIsomorphicLayoutEffect, useReducedMotion } from '../../hooks'
import { Icon, type IconName } from '../../icons'
import { useLocale, type MessageKey } from '../../providers'
import { clamp, cx, devWarning, mergeRefs } from '../../utils'
import { Dropdown, DropdownItem } from '../Dropdown'
import { IconButton } from '../IconButton'
import { VisuallyHidden } from '../VisuallyHidden'
import './SortableList.css'

export type SortableListOrientation = 'vertical' | 'horizontal'
export type SortableMoveControls = 'buttons' | 'menu' | 'none'
export type SortableKey = string | number

export interface SortableReorderDetails<T> {
  /** Posição original do item (base 0). */
  from: number
  /** Nova posição do item (base 0). */
  to: number
  /** O item movido. */
  item: T
}

export interface SortableItemState {
  /** Posição atual (base 0). Durante o arraste, é a posição prevista. */
  index: number
  /** Total de itens. */
  total: number
  /** O item está sendo movido (por ponteiro ou teclado). */
  isDragging: boolean
  /** O item não pode ser movido (`disabled` da lista ou do item). */
  disabled: boolean
}

export interface SortableAnnouncementContext {
  /** Nome do item (de `getItemLabel`). */
  label: string
  /** Posição atual (base 1). */
  position: number
  /** Total de itens. */
  total: number
  /** Posição (base 1) antes do movimento começar. */
  initialPosition: number
}

/** Textos anunciados no leitor de tela. Cada função substitui o texto padrão. */
export interface SortableAnnouncements {
  lifted?: (context: SortableAnnouncementContext) => string
  moved?: (context: SortableAnnouncementContext) => string
  dropped?: (context: SortableAnnouncementContext) => string
  cancelled?: (context: SortableAnnouncementContext) => string
}

export interface SortableListProps<T>
  extends Omit<HTMLAttributes<HTMLUListElement>, 'children' | 'defaultValue' | 'onChange'> {
  /** Itens na ordem atual (controlado). Use com `onReorder`. */
  items?: readonly T[]
  /** Itens iniciais (não controlado). */
  defaultItems?: readonly T[]
  /**
   * Chamado quando o usuário conclui uma reordenação (soltar, botão ou menu)
   * com a nova lista e `{ from, to, item }`. Não é chamado ao cancelar.
   */
  onReorder?: (items: T[], details: SortableReorderDetails<T>) => void
  /** Renderiza o conteúdo do item. A alça e os controles de mover são do componente. */
  renderItem: (item: T, state: SortableItemState) => ReactNode
  /** Chave estável de cada item. Padrão: `item.id` (ou o próprio item, se for texto/número). */
  getKey?: (item: T, index: number) => SortableKey
  /**
   * Nome do item usado na alça ("Reordenar …") e nos anúncios. Padrão:
   * `item.label`, `item.title` ou `item.name` (ou o próprio item, se for texto).
   */
  getItemLabel?: (item: T) => string
  /** Itens que não podem ser movidos. Padrão: `item.disabled === true`. */
  isItemDisabled?: (item: T) => boolean
  /** Nome acessível da lista (`aria-label`). */
  label?: string
  /** Desabilita a reordenação de todos os itens. */
  disabled?: boolean
  /** Direção da lista. Define também as setas do teclado. Padrão: `vertical`. */
  orientation?: SortableListOrientation
  /**
   * Alternativa ao arraste com um único clique (WCAG 2.5.7): botões "Mover
   * para cima/baixo" (`buttons`, padrão), um menu com topo/cima/baixo/fim
   * (`menu`) ou nenhuma (`none` — só quando a página oferece outra alternativa).
   */
  moveControls?: SortableMoveControls
  /** Substitui os textos anunciados ao levantar, mover, soltar e cancelar. */
  announcements?: SortableAnnouncements
}

/** Distância (px) que o ponteiro percorre antes de virar arraste: cliques simples não arrastam. */
const DRAG_THRESHOLD = 5
/** Faixa (px) junto às bordas do contêiner rolável que dispara a rolagem automática. */
const SCROLL_EDGE = 48
/** Velocidade máxima da rolagem automática (px por quadro). */
const SCROLL_SPEED = 16
/** Congela o transform durante as medições do FLIP sem cortar o esmaecer da sombra. */
const FREEZE_TRANSFORM = 'box-shadow var(--or-duration-fast) var(--or-ease-out)'

type AnnouncementKind = keyof SortableAnnouncements
type Direction = 'prev' | 'next' | 'first' | 'last'
type FocusPart = 'handle' | 'prev' | 'next' | 'menu'

const announcementKeys: Record<AnnouncementKind, MessageKey> = {
  lifted: 'sortableLifted',
  moved: 'sortableMoved',
  dropped: 'sortableDropped',
  cancelled: 'sortableCancelled',
}

/** Posições medidas no início do movimento (relativas à lista, sem transformações). */
interface Layout {
  starts: number[]
  sizes: number[]
  cross: number[]
  crossSizes: number[]
  gap: number
}

interface DragState {
  key: SortableKey
  /** Índice original do item movido. */
  from: number
  /** `order[posição] = índice original` — a ordem prevista. */
  order: number[]
  mode: 'keyboard' | 'pointer'
  layout: Layout
}

interface PointerSession {
  key: SortableKey
  index: number
  id: number
  startX: number
  startY: number
  x: number
  y: number
  started: boolean
  listRect: DOMRect | null
  scrollX: number
  scrollY: number
  scroller: HTMLElement | null
  frame: number
  cleanup: () => void
}

interface FlipSnapshot {
  rects: Map<SortableKey, DOMRect>
  settle?: SortableKey
}

function defaultGetKey(item: unknown, index: number): SortableKey {
  if (typeof item === 'string' || typeof item === 'number') return item
  if (item && typeof item === 'object' && 'id' in item) {
    const id = (item as { id: unknown }).id
    if (typeof id === 'string' || typeof id === 'number') return id
  }
  return index
}

function defaultGetLabel(item: unknown, key: SortableKey): string {
  if (typeof item === 'string' || typeof item === 'number') return String(item)
  if (item && typeof item === 'object') {
    for (const field of ['label', 'title', 'name']) {
      const value = (item as Record<string, unknown>)[field]
      if (typeof value === 'string' && value) return value
    }
  }
  return String(key)
}

function defaultIsDisabled(item: unknown): boolean {
  return !!item && typeof item === 'object' && (item as { disabled?: unknown }).disabled === true
}

function identity(length: number): number[] {
  return Array.from({ length }, (_, i) => i)
}

/**
 * Move o elemento de `from` para `to` passando apenas pelas posições livres:
 * itens travados (desabilitados) nunca saem do lugar.
 */
function moveInSlots<V>(list: readonly V[], from: number, to: number, isLocked: (position: number) => boolean): V[] {
  const next = list.slice()
  if (from === to) return next
  const slots: number[] = []
  for (let p = 0; p < list.length; p++) if (p === from || !isLocked(p)) slots.push(p)
  const a = slots.indexOf(from)
  const b = slots.indexOf(to)
  if (a === -1 || b === -1) return next
  const sequence = slots.map((p) => list[p])
  const [moved] = sequence.splice(a, 1)
  sequence.splice(b, 0, moved)
  slots.forEach((p, k) => {
    next[p] = sequence[k]
  })
  return next
}

/** Próxima posição livre na direção pedida, ou `null` se não houver. */
function findSlot(from: number, direction: Direction, total: number, isLocked: (position: number) => boolean) {
  if (direction === 'prev') {
    for (let p = from - 1; p >= 0; p--) if (!isLocked(p)) return p
  } else if (direction === 'next') {
    for (let p = from + 1; p < total; p++) if (!isLocked(p)) return p
  } else if (direction === 'first') {
    for (let p = 0; p < from; p++) if (!isLocked(p)) return p
  } else {
    for (let p = total - 1; p > from; p--) if (!isLocked(p)) return p
  }
  return null
}

/** Posição livre mais próxima de `target` (empate: a mais próxima da origem). */
function nearestSlot(target: number, from: number, total: number, isLocked: (position: number) => boolean) {
  let best = from
  for (let p = 0; p < total; p++) {
    if (p !== from && isLocked(p)) continue
    const distance = Math.abs(p - target)
    const bestDistance = Math.abs(best - target)
    if (distance < bestDistance || (distance === bestDistance && Math.abs(p - from) < Math.abs(best - from))) best = p
  }
  return best
}

/** Início (px, relativo à lista) de cada posição para a ordem `order`. */
function slotStarts(layout: Layout, order: number[]): number[] {
  const starts: number[] = []
  let cursor = layout.starts[0] ?? 0
  for (const index of order) {
    starts.push(cursor)
    cursor += layout.sizes[index] + layout.gap
  }
  return starts
}

/** Primeiro ancestral (incluindo o próprio elemento) que rola no eixo da lista. */
function getScrollParent(node: HTMLElement, vertical: boolean): HTMLElement | null {
  let current: HTMLElement | null = node
  while (current && current !== document.body && current !== document.documentElement) {
    const style = getComputedStyle(current)
    const overflow = vertical ? style.overflowY : style.overflowX
    const scrollable = vertical
      ? current.scrollHeight > current.clientHeight
      : current.scrollWidth > current.clientWidth
    if (/(auto|scroll|overlay)/.test(overflow) && scrollable) return current
    current = current.parentElement
  }
  return null
}

function SortableListInner<T>(
  {
    items: itemsProp,
    defaultItems,
    onReorder,
    renderItem,
    getKey = defaultGetKey,
    getItemLabel,
    isItemDisabled = defaultIsDisabled,
    label,
    disabled = false,
    orientation = 'vertical',
    moveControls = 'buttons',
    announcements,
    className,
    ...rest
  }: SortableListProps<T>,
  ref: Ref<HTMLUListElement>,
) {
  const { t } = useLocale()
  const reducedMotion = useReducedMotion()
  const instructionsId = useId('or-sortable-instructions')
  const [list, setList] = useControllableState<readonly T[]>({
    value: itemsProp,
    defaultValue: defaultItems ?? [],
  })
  const [drag, setDragState] = useState<DragState | null>(null)
  const [message, setMessage] = useState('')
  const [, setRenderTick] = useState(0)

  const listRef = useRef<HTMLUListElement>(null)
  const composedRef = useMemo(() => mergeRefs(ref, listRef), [ref])
  const nodes = useRef(new Map<SortableKey, HTMLLIElement>())
  const nodeRefs = useRef(new Map<SortableKey, RefCallback<HTMLLIElement>>())
  const dragRef = useRef<DragState | null>(null)
  const pointerRef = useRef<PointerSession | null>(null)
  const flipRef = useRef<FlipSnapshot | null>(null)
  const focusRef = useRef<
    { key: SortableKey; part: FocusPart; reveal: boolean } | { element: HTMLElement } | null
  >(null)

  devWarning(
    !label && !rest['aria-label'] && !rest['aria-labelledby'],
    'SortableList precisa de `label` (ou `aria-labelledby`) para dar nome à lista.',
  )

  const vertical = orientation !== 'horizontal'
  const total = list.length
  const keys = list.map((item, index) => getKey(item, index))
  const labels = list.map((item, index) => getItemLabel?.(item) ?? defaultGetLabel(item, keys[index]))
  const locked = list.map((item) => disabled || isItemDisabled(item))
  const isLockedAt = (position: number) => locked[position]

  // Itens que mudam durante o arraste (dados chegando do servidor, por exemplo) encerram o arraste.
  const activeDrag = drag && drag.order.length === total && keys[drag.from] === drag.key ? drag : null

  // Valores atuais para os ouvintes registrados em `window` durante o arraste.
  const latest = useRef({ list, keys, labels, locked, total, vertical, reducedMotion, announcements, onReorder, setList, t })
  latest.current = { list, keys, labels, locked, total, vertical, reducedMotion, announcements, onReorder, setList, t }

  const setDrag = (next: DragState | null) => {
    dragRef.current = next
    setDragState(next)
  }

  const nodeRef = (key: SortableKey) => {
    let callback = nodeRefs.current.get(key)
    if (!callback) {
      callback = (el) => {
        if (el) nodes.current.set(key, el)
        else nodes.current.delete(key)
      }
      nodeRefs.current.set(key, callback)
    }
    return callback
  }

  const announce = (kind: AnnouncementKind, index: number, position: number) => {
    const L = latest.current
    const context: SortableAnnouncementContext = {
      label: L.labels[index] ?? '',
      position: position + 1,
      total: L.total,
      initialPosition: index + 1,
    }
    const custom = L.announcements?.[kind]
    setMessage(
      custom
        ? custom(context)
        : L.t(announcementKeys[kind], { label: context.label, position: context.position, total: context.total }),
    )
  }

  /** Mede os itens pelo layout (offset*), que ignora transformações em andamento. */
  const measure = (): Layout => {
    const L = latest.current
    const layout: Layout = { starts: [], sizes: [], cross: [], crossSizes: [], gap: 0 }
    for (const key of L.keys) {
      const el = nodes.current.get(key)
      layout.starts.push(el ? (L.vertical ? el.offsetTop : el.offsetLeft) : 0)
      layout.sizes.push(el ? (L.vertical ? el.offsetHeight : el.offsetWidth) : 0)
      layout.cross.push(el ? (L.vertical ? el.offsetLeft : el.offsetTop) : 0)
      layout.crossSizes.push(el ? (L.vertical ? el.offsetWidth : el.offsetHeight) : 0)
    }
    if (layout.starts.length > 1) layout.gap = layout.starts[1] - (layout.starts[0] + layout.sizes[0])
    return layout
  }

  /** Rola o contêiner (ou a página) até a posição `start` (relativa à lista) ficar visível. */
  const ensureVisible = (start: number, size: number) => {
    const listEl = listRef.current
    if (!listEl || !size) return
    const V = latest.current.vertical
    const rect = listEl.getBoundingClientRect()
    const begin = (V ? rect.top + listEl.clientTop - listEl.scrollTop : rect.left + listEl.clientLeft - listEl.scrollLeft) + start
    const end = begin + size
    const scroller = getScrollParent(listEl, V)
    const view = scroller?.getBoundingClientRect()
    const viewStart = view ? (V ? view.top : view.left) : 0
    const viewEnd = view ? (V ? view.bottom : view.right) : V ? window.innerHeight : window.innerWidth
    const margin = 8
    let delta = 0
    if (begin < viewStart + margin) delta = begin - viewStart - margin
    else if (end > viewEnd - margin) delta = Math.min(end - viewEnd + margin, begin - viewStart - margin)
    if (!delta) return
    if (scroller) {
      if (V) scroller.scrollTop += delta
      else scroller.scrollLeft += delta
    } else {
      window.scrollTo(window.scrollX + (V ? 0 : delta), window.scrollY + (V ? delta : 0))
    }
  }

  /** Guarda a posição visual de cada item antes de uma reordenação (FLIP: "First"). */
  const prepareFlip = (settle?: SortableKey) => {
    // Garante um novo commit mesmo que o pai ignore `onReorder`.
    setRenderTick((n) => n + 1)
    if (latest.current.reducedMotion) {
      flipRef.current = null
      return
    }
    const rects = new Map<SortableKey, DOMRect>()
    nodes.current.forEach((el, key) => {
      rects.set(key, el.getBoundingClientRect())
      // Sem transição de transform até o layout final ser medido no efeito abaixo.
      el.style.transition = FREEZE_TRANSFORM
    })
    flipRef.current = { rects, settle }
  }

  // FLIP ("Last, Invert, Play") e devolução do foco depois de cada reordenação.
  useIsomorphicLayoutEffect(() => {
    const flip = flipRef.current
    if (flip) {
      flipRef.current = null
      const elements = Array.from(nodes.current.entries())
      const deltas = elements.map(([key, el]) => {
        el.style.transition = FREEZE_TRANSFORM
        const before = flip.rects.get(key)
        if (!before) return null
        const after = el.getBoundingClientRect()
        const dx = before.left - after.left
        const dy = before.top - after.top
        return Math.abs(dx) < 0.5 && Math.abs(dy) < 0.5 ? null : { dx, dy }
      })
      elements.forEach(([key, el], i) => {
        const delta = deltas[i]
        if (!delta) return
        el.style.transform = `translate(${delta.dx}px, ${delta.dy}px)`
        if (key === flip.settle) {
          el.setAttribute('data-settling', '')
          const done = (event?: TransitionEvent) => {
            if (event && (event.target !== el || event.propertyName !== 'transform')) return
            el.removeAttribute('data-settling')
            el.removeEventListener('transitionend', done)
          }
          el.addEventListener('transitionend', done)
          window.setTimeout(done, 1000)
        }
      })
      // Força o reflow para fixar o ponto de partida antes de liberar a transição.
      if (deltas.some(Boolean)) void listRef.current?.offsetWidth
      for (const [, el] of elements) {
        el.style.transition = ''
        el.style.transform = ''
      }
    }

    const focus = focusRef.current
    focusRef.current = null
    if (focus && 'element' in focus) {
      // O usuário saiu da alça: mantém o foco onde ele foi, mesmo que o DOM tenha sido reordenado.
      if (focus.element.isConnected && document.activeElement !== focus.element) {
        focus.element.focus({ preventScroll: true })
      }
    } else if (focus) {
      const li = nodes.current.get(focus.key)
      if (li) {
        const order: FocusPart[] =
          focus.part === 'prev'
            ? ['prev', 'next', 'handle']
            : focus.part === 'next'
              ? ['next', 'prev', 'handle']
              : [focus.part, 'handle']
        for (const part of order) {
          const target = li.querySelector<HTMLButtonElement>(`[data-sortable-part="${part}"]`)
          if (target && !target.disabled) {
            target.focus({ preventScroll: true })
            break
          }
        }
        if (focus.reveal) {
          const V = latest.current.vertical
          ensureVisible(V ? li.offsetTop : li.offsetLeft, V ? li.offsetHeight : li.offsetWidth)
        }
      }
    }
  })

  const clearDragOffset = (key: SortableKey) => {
    const el = nodes.current.get(key)
    el?.style.removeProperty('--_drag-x')
    el?.style.removeProperty('--_drag-y')
  }

  /**
   * Solta (`commit`) ou cancela o item levantado. O foco volta para a alça, a
   * menos que `focusTarget` indique para onde o usuário levou o foco.
   */
  const finish = (commit: boolean, focusTarget?: HTMLElement | null) => {
    const d = dragRef.current
    if (!d) return
    const L = latest.current
    const position = d.order.indexOf(d.from)
    prepareFlip(d.key)
    clearDragOffset(d.key)
    setDrag(null)
    focusRef.current =
      focusTarget === undefined
        ? { key: d.key, part: 'handle', reveal: false }
        : focusTarget
          ? { element: focusTarget }
          : null
    if (commit && position !== d.from) {
      const next = d.order.map((i) => L.list[i])
      L.setList(next)
      L.onReorder?.(next, { from: d.from, to: position, item: L.list[d.from] })
    }
    announce(commit ? 'dropped' : 'cancelled', d.from, commit ? position : d.from)
  }

  // Teclado --------------------------------------------------------------------

  const lift = (index: number) => {
    const L = latest.current
    if (L.locked[index]) return
    setDrag({ key: L.keys[index], from: index, order: identity(L.total), mode: 'keyboard', layout: measure() })
    announce('lifted', index, index)
  }

  const moveLifted = (direction: Direction) => {
    const d = dragRef.current
    if (!d) return
    const L = latest.current
    const isLocked = (p: number) => L.locked[p]
    const position = d.order.indexOf(d.from)
    const target = findSlot(position, direction, L.total, isLocked)
    if (target === null) return
    const order = moveInSlots(d.order, position, target, isLocked)
    setDrag({ ...d, order })
    announce('moved', d.from, target)
    ensureVisible(slotStarts(d.layout, order)[target], d.layout.sizes[d.from])
  }

  const handleKeyDown = (event: ReactKeyboardEvent<HTMLButtonElement>, index: number) => {
    const d = dragRef.current
    const key = event.key
    if (!d) {
      if ((key === ' ' || key === 'Enter') && !event.repeat) {
        event.preventDefault()
        lift(index)
      }
      return
    }
    if (d.mode !== 'keyboard' || d.key !== latest.current.keys[index]) return
    const V = latest.current.vertical
    if (key === (V ? 'ArrowUp' : 'ArrowLeft')) moveLifted('prev')
    else if (key === (V ? 'ArrowDown' : 'ArrowRight')) moveLifted('next')
    else if (key === 'Home') moveLifted('first')
    else if (key === 'End') moveLifted('last')
    else if (key === ' ' || key === 'Enter') {
      if (!event.repeat) finish(true)
    } else if (key === 'Escape') {
      // Não deixa o Escape fechar um Modal/Drawer em volta.
      event.stopPropagation()
      finish(false)
    } else return
    event.preventDefault()
  }

  const handleBlur = (event: FocusEvent<HTMLButtonElement>, key: SortableKey) => {
    const d = dragRef.current
    // Sair da alça (Tab, clique fora) solta o item onde ele está.
    if (d?.mode === 'keyboard' && d.key === key) finish(true, event.relatedTarget as HTMLElement | null)
  }

  // Ponteiro (mouse, caneta, toque) ---------------------------------------------

  const updatePointerDrag = () => {
    const session = pointerRef.current
    const d = dragRef.current
    const listEl = listRef.current
    if (!session?.started || !session.listRect || d?.mode !== 'pointer' || !listEl) return
    const L = latest.current
    const V = L.vertical
    const now = listEl.getBoundingClientRect()
    // Quanto o conteúdo da lista se deslocou na tela desde o início (rolagem da página ou da lista).
    const scrolled = V
      ? session.listRect.top - now.top + listEl.scrollTop - session.scrollY
      : session.listRect.left - now.left + listEl.scrollLeft - session.scrollX
    const { starts, sizes } = d.layout
    const from = d.from
    const lastEnd = Math.max(...starts.map((start, i) => start + sizes[i]))
    const raw = (V ? session.y - session.startY : session.x - session.startX) + scrolled
    const offset = clamp(raw, starts[0] - starts[from], lastEnd - starts[from] - sizes[from])
    nodes.current.get(d.key)?.style.setProperty(V ? '--_drag-y' : '--_drag-x', `${offset}px`)

    const center = starts[from] + offset + sizes[from] / 2
    let target = 0
    for (let i = 0; i < L.total; i++) if (i !== from && starts[i] + sizes[i] / 2 < center) target++
    const isLocked = (p: number) => L.locked[p]
    target = nearestSlot(target, from, L.total, isLocked)
    if (target === d.order.indexOf(from)) return
    setDrag({ ...d, order: moveInSlots(identity(L.total), from, target, isLocked) })
    announce('moved', from, target)
  }

  const autoScroll = () => {
    const session = pointerRef.current
    if (!session?.started) return
    session.frame = 0
    const V = latest.current.vertical
    const scroller = session.scroller
    const rect = scroller?.getBoundingClientRect()
    const start = rect ? (V ? rect.top : rect.left) : 0
    const end = rect ? (V ? rect.bottom : rect.right) : V ? window.innerHeight : window.innerWidth
    const edge = Math.min(SCROLL_EDGE, (end - start) / 4)
    if (edge <= 0) return
    const pos = V ? session.y : session.x
    let speed = 0
    if (pos < start + edge) speed = -SCROLL_SPEED * Math.min(1, (start + edge - pos) / edge)
    else if (pos > end - edge) speed = SCROLL_SPEED * Math.min(1, (pos - (end - edge)) / edge)
    if (!speed) return
    speed = Math.round(speed) || Math.sign(speed)
    if (scroller) {
      if (V) scroller.scrollTop += speed
      else scroller.scrollLeft += speed
    } else {
      window.scrollTo(window.scrollX + (V ? 0 : speed), window.scrollY + (V ? speed : 0))
    }
    updatePointerDrag()
    session.frame = requestAnimationFrame(autoScroll)
  }

  const startPointerDrag = (session: PointerSession) => {
    const listEl = listRef.current
    if (!listEl) return
    const L = latest.current
    // A lista pode ter mudado desde o pointerdown (ex.: um item levantado pelo teclado foi solto).
    const index = L.keys.indexOf(session.key)
    if (index === -1 || L.locked[index]) {
      endPointer(false)
      return
    }
    session.started = true
    session.index = index
    session.listRect = listEl.getBoundingClientRect()
    session.scrollX = listEl.scrollLeft
    session.scrollY = listEl.scrollTop
    session.scroller = getScrollParent(listEl, L.vertical)
    setDrag({ key: session.key, from: index, order: identity(L.total), mode: 'pointer', layout: measure() })
  }

  const pointerMove = (x: number, y: number) => {
    const session = pointerRef.current
    if (!session) return
    session.x = x
    session.y = y
    if (!session.started) {
      if (Math.hypot(x - session.startX, y - session.startY) < DRAG_THRESHOLD) return
      startPointerDrag(session)
      if (!session.started) return
    }
    updatePointerDrag()
    if (!session.frame) autoScroll()
  }

  const endPointer = (commit: boolean) => {
    const session = pointerRef.current
    if (!session) return
    pointerRef.current = null
    session.cleanup()
    if (session.started && dragRef.current?.mode === 'pointer') finish(commit)
  }

  const handlePointerDown = (event: ReactPointerEvent<HTMLButtonElement>, index: number) => {
    const L = latest.current
    if (event.button !== 0 || event.isPrimary === false || L.locked[index] || pointerRef.current) return
    if (dragRef.current) {
      if (dragRef.current.mode !== 'keyboard') return
      finish(true, null)
    }
    const handle = event.currentTarget
    // O Safari não foca botões no clique; o foco acompanha o item depois de soltar.
    handle.focus({ preventScroll: true })
    const id = event.pointerId
    try {
      handle.setPointerCapture?.(id)
    } catch {
      // ponteiro já liberado (eventos sintéticos)
    }
    const session: PointerSession = {
      key: L.keys[index],
      index,
      id,
      startX: event.clientX,
      startY: event.clientY,
      x: event.clientX,
      y: event.clientY,
      started: false,
      listRect: null,
      scrollX: 0,
      scrollY: 0,
      scroller: null,
      frame: 0,
      cleanup: () => {},
    }
    const onMove = (e: PointerEvent) => {
      if (e.pointerId === id) pointerMove(e.clientX, e.clientY)
    }
    const onUp = (e: PointerEvent) => {
      if (e.pointerId === id) endPointer(true)
    }
    const onCancel = (e: PointerEvent) => {
      if (e.pointerId === id) endPointer(false)
    }
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Escape' || !session.started) return
      e.preventDefault()
      e.stopPropagation()
      endPointer(false)
    }
    const onScroll = () => updatePointerDrag()
    const onWindowBlur = () => endPointer(false)
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
    window.addEventListener('pointercancel', onCancel)
    window.addEventListener('keydown', onKeyDown, true)
    window.addEventListener('scroll', onScroll, true)
    window.addEventListener('blur', onWindowBlur)
    session.cleanup = () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
      window.removeEventListener('pointercancel', onCancel)
      window.removeEventListener('keydown', onKeyDown, true)
      window.removeEventListener('scroll', onScroll, true)
      window.removeEventListener('blur', onWindowBlur)
      if (session.frame) cancelAnimationFrame(session.frame)
      try {
        if (handle.hasPointerCapture?.(id)) handle.releasePointerCapture(id)
      } catch {
        // nada a liberar
      }
    }
    pointerRef.current = session
  }

  // Alternativa de clique único (botões ou menu) -------------------------------

  const moveByControl = (index: number, direction: Direction, part: FocusPart) => {
    const L = latest.current
    if (dragRef.current || L.locked[index]) return
    const isLocked = (p: number) => L.locked[p]
    const target = findSlot(index, direction, L.total, isLocked)
    if (target === null) return
    const next = moveInSlots(L.list, index, target, isLocked)
    prepareFlip()
    focusRef.current = { key: L.keys[index], part, reveal: true }
    L.setList(next)
    L.onReorder?.(next, { from: index, to: target, item: L.list[index] })
    announce('moved', index, target)
  }

  // Ciclo de vida ----------------------------------------------------------------

  useEffect(() => {
    if (!drag || activeDrag) return
    pointerRef.current?.cleanup()
    pointerRef.current = null
    clearDragOffset(drag.key)
    dragRef.current = null
    setDragState(null)
  }, [drag, activeDrag])

  useEffect(() => {
    const sessions = pointerRef
    return () => sessions.current?.cleanup()
  }, [])

  // Renderização -----------------------------------------------------------------

  const positions = new Array<number>(total)
  activeDrag?.order.forEach((original, position) => {
    positions[original] = position
  })
  const starts = activeDrag ? slotStarts(activeDrag.layout, activeDrag.order) : null
  const isPointerDrag = activeDrag?.mode === 'pointer'

  let placeholder: ReactNode = null
  if (activeDrag && starts && isPointerDrag) {
    const { layout, from } = activeDrag
    const slot = starts[positions[from]]
    const style: CSSProperties = vertical
      ? { width: layout.crossSizes[from], height: layout.sizes[from], transform: `translate(${layout.cross[from]}px, ${slot}px)` }
      : { width: layout.sizes[from], height: layout.crossSizes[from], transform: `translate(${slot}px, ${layout.cross[from]}px)` }
    placeholder = <li aria-hidden="true" className="or-sortable__placeholder" style={style} />
  }

  const prevIcon: IconName = vertical ? 'arrow-up' : 'arrow-left'
  const nextIcon: IconName = vertical ? 'arrow-down' : 'arrow-right'
  const firstIcon: IconName = vertical ? 'arrow-up-to-line' : 'chevrons-left'
  const lastIcon: IconName = vertical ? 'arrow-down-to-line' : 'chevrons-right'
  const prevText = t(vertical ? 'sortableMoveUp' : 'sortableMoveLeft')
  const nextText = t(vertical ? 'sortableMoveDown' : 'sortableMoveRight')
  const firstText = t(vertical ? 'sortableMoveTop' : 'sortableMoveStart')
  const lastText = t('sortableMoveEnd')

  return (
    <>
      <ul
        ref={composedRef}
        // `list-style: none` remove a semântica de lista no Safari/VoiceOver; o papel explícito a restaura.
        role="list"
        aria-label={label}
        className={cx('or-sortable', `or-sortable--${orientation}`, className)}
        data-active={activeDrag?.mode}
        data-disabled={disabled || undefined}
        {...rest}
      >
        {list.map((item, index) => {
          const key = keys[index]
          const itemLabel = labels[index]
          const itemLocked = locked[index]
          const position = activeDrag ? positions[index] : index
          const isDragging = activeDrag?.key === key
          const canPrev = !itemLocked && findSlot(index, 'prev', total, isLockedAt) !== null
          const canNext = !itemLocked && findSlot(index, 'next', total, isLockedAt) !== null
          let style: CSSProperties | undefined
          if (starts && activeDrag && !(isDragging && isPointerDrag)) {
            const shift = starts[position] - activeDrag.layout.starts[index]
            style = { [vertical ? '--_shift-y' : '--_shift-x']: `${shift}px` } as CSSProperties
          }

          return (
            <li
              key={key}
              ref={nodeRef(key)}
              className="or-sortable__item"
              data-dragging={isDragging || undefined}
              data-disabled={itemLocked || undefined}
              style={style}
            >
              <button
                type="button"
                className="or-sortable__handle"
                data-sortable-part="handle"
                aria-label={t('sortableHandle', { label: itemLabel, position: position + 1, total })}
                aria-describedby={instructionsId}
                disabled={itemLocked}
                onKeyDown={(event) => handleKeyDown(event, index)}
                onPointerDown={(event) => handlePointerDown(event, index)}
                onBlur={(event) => handleBlur(event, key)}
              >
                <Icon name={itemLocked && !disabled ? 'lock' : 'grip'} size="sm" />
              </button>
              <div className="or-sortable__content">
                {renderItem(item, { index: position, total, isDragging, disabled: itemLocked })}
              </div>
              {moveControls === 'buttons' && (
                <div className="or-sortable__controls">
                  <IconButton
                    size="sm"
                    icon={prevIcon}
                    label={t('sortableMoveItem', { action: prevText, label: itemLabel })}
                    disabled={!canPrev}
                    data-sortable-part="prev"
                    onClick={() => moveByControl(index, 'prev', 'prev')}
                  />
                  <IconButton
                    size="sm"
                    icon={nextIcon}
                    label={t('sortableMoveItem', { action: nextText, label: itemLabel })}
                    disabled={!canNext}
                    data-sortable-part="next"
                    onClick={() => moveByControl(index, 'next', 'next')}
                  />
                </div>
              )}
              {moveControls === 'menu' && (
                <div className="or-sortable__controls">
                  <Dropdown
                    placement="bottom-end"
                    trigger={
                      <IconButton
                        size="sm"
                        icon={vertical ? 'arrows-up-down' : 'more-horizontal'}
                        label={t('sortableMoveMenu', { label: itemLabel })}
                        disabled={!canPrev && !canNext}
                        data-sortable-part="menu"
                      />
                    }
                  >
                    <DropdownItem icon={firstIcon} disabled={!canPrev} onSelect={() => moveByControl(index, 'first', 'menu')}>
                      {firstText}
                    </DropdownItem>
                    <DropdownItem icon={prevIcon} disabled={!canPrev} onSelect={() => moveByControl(index, 'prev', 'menu')}>
                      {prevText}
                    </DropdownItem>
                    <DropdownItem icon={nextIcon} disabled={!canNext} onSelect={() => moveByControl(index, 'next', 'menu')}>
                      {nextText}
                    </DropdownItem>
                    <DropdownItem icon={lastIcon} disabled={!canNext} onSelect={() => moveByControl(index, 'last', 'menu')}>
                      {lastText}
                    </DropdownItem>
                  </Dropdown>
                </div>
              )}
            </li>
          )
        })}
        {placeholder}
      </ul>
      <VisuallyHidden id={instructionsId}>{t('sortableInstructions')}</VisuallyHidden>
      <VisuallyHidden role="status" aria-live="polite" aria-atomic="true">
        {message}
      </VisuallyHidden>
    </>
  )
}

/**
 * Lista que o usuário reordena: prioridades, ordem de categorias, etapas.
 * Arraste pela alça (mouse, caneta ou toque), use o teclado na alça
 * (Espaço levanta, setas movem, Espaço solta, Esc cancela) ou os botões/menu
 * de mover — a alternativa de clique único exigida pela WCAG 2.5.7.
 */
const ForwardedSortableList = forwardRef(SortableListInner)
ForwardedSortableList.displayName = 'SortableList'

export const SortableList = ForwardedSortableList as <T>(
  props: SortableListProps<T> & { ref?: Ref<HTMLUListElement> },
) => ReactElement | null
