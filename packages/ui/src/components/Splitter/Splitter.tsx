import {
  Children,
  createContext,
  forwardRef,
  isValidElement,
  useContext,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type FocusEvent as ReactFocusEvent,
  type HTMLAttributes,
  type KeyboardEvent as ReactKeyboardEvent,
  type MouseEvent as ReactMouseEvent,
  type PointerEvent as ReactPointerEvent,
  type ReactElement,
  type ReactNode,
} from 'react'
import { useControllableState, useId, useIsomorphicLayoutEffect } from '../../hooks'
import { Icon } from '../../icons'
import { useLocale } from '../../providers'
import { canUseDOM, clamp, composeEventHandlers, cx, devWarning, mergeRefs } from '../../utils'
import './Splitter.css'

export type SplitterOrientation = 'horizontal' | 'vertical'
export type SplitterStackBreakpoint = 'sm' | 'md'

export interface SplitterProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /**
   * `horizontal` (padrão): painéis lado a lado, separadores verticais.
   * `vertical`: painéis empilhados, separadores horizontais.
   */
  orientation?: SplitterOrientation
  /** Tamanhos dos painéis em % (somam 100), na ordem do DOM (controlado). */
  sizes?: number[]
  /**
   * Tamanhos iniciais em % (não controlado). Também é o destino do clique
   * duplo no separador. Padrão: divisão igual.
   */
  defaultSizes?: number[]
  /** Chamado a cada mudança de tamanho (inclusive durante o arraste). */
  onSizesChange?: (sizes: number[]) => void
  /** Chamado quando um redimensionamento termina (soltar o ponteiro, soltar a tecla, clique duplo). */
  onResizeEnd?: (sizes: number[]) => void
  /**
   * Guarda os tamanhos no `localStorage` (chave `or-splitter:<storageKey>`) ao fim
   * de cada redimensionamento e os restaura ao montar. Falhas de armazenamento
   * (modo privado, cota cheia) são ignoradas.
   */
  storageKey?: string
  /** Nome acessível do grupo de painéis (`role="group"`). */
  label?: string
  /** Passo das setas, em %. Padrão: 2. */
  step?: number
  /** Passo de Shift + seta, em %. Padrão: 10. */
  shiftStep?: number
  /**
   * Abaixo deste ponto de quebra (`sm` 640px, `md` 768px) os painéis empilham
   * na vertical, sem separadores. O conteúdo precisa fazer sentido empilhado.
   */
  stackBelow?: SplitterStackBreakpoint
  /** `SplitterPanel` e `SplitterHandle` como filhos diretos, intercalados. */
  children?: ReactNode
}

export interface SplitterPanelProps extends HTMLAttributes<HTMLDivElement> {
  /** Tamanho mínimo em %. Padrão: 0. */
  minSize?: number
  /** Tamanho máximo em %. Padrão: 100. */
  maxSize?: number
  /** Pode ser recolhido (Enter no separador ou arraste abaixo do mínimo). */
  collapsible?: boolean
  /** Tamanho em % quando recolhido. Padrão: 0 (o conteúdo sai da tela e do foco). */
  collapsedSize?: number
  /** Começa recolhido (requer `collapsible`). */
  defaultCollapsed?: boolean
  /** `id` do painel (alvo do `aria-controls` do separador). Padrão: gerado. */
  id?: string
  /** Nome do painel, usado no nome acessível do separador ("Redimensionar {label}"). */
  label?: string
}

export type SplitterHandleProps = HTMLAttributes<HTMLDivElement>

/* -------------------------------------------------------------------------- */
/* Modelo                                                                      */
/* -------------------------------------------------------------------------- */

interface PanelConfig {
  id: string
  label?: string
  minSize: number
  maxSize: number
  collapsible: boolean
  collapsedSize: number
  defaultCollapsed: boolean
}

interface HandleState {
  /** Índice do painel primário (anterior) e do secundário (seguinte); -1 se faltar. */
  before: number
  after: number
  valueNow?: number
  valueMin?: number
  valueMax?: number
  valueText?: string
  controls?: string
  name: string
  collapsed: boolean
  edge?: 'start' | 'end'
}

type ItemKind = 'panel' | 'handle' | 'other'

interface SplitterContextValue {
  orientation: SplitterOrientation
  panels: PanelConfig[]
  sizes: number[]
  handles: HandleState[]
  dragging: number | null
  onKeyDown: (index: number, event: ReactKeyboardEvent<HTMLDivElement>) => void
  onKeyUp: (event: ReactKeyboardEvent<HTMLDivElement>) => void
  onBlur: (event: ReactFocusEvent<HTMLDivElement>) => void
  onPointerDown: (index: number, event: ReactPointerEvent<HTMLDivElement>) => void
  onPointerMove: (event: ReactPointerEvent<HTMLDivElement>) => void
  onPointerEnd: (event: ReactPointerEvent<HTMLDivElement>) => void
  onDoubleClick: (event: ReactMouseEvent<HTMLDivElement>) => void
}

const SplitterContext = createContext<SplitterContextValue | null>(null)
/** Índice do painel ou separador na ordem do Splitter (null fora de um filho direto). */
const ItemContext = createContext<number | null>(null)

function useSplitterItem(component: string) {
  const ctx = useContext(SplitterContext)
  const index = useContext(ItemContext)
  if (!ctx || index === null) {
    throw new Error(`<${component}> precisa ser filho direto de <Splitter>.`)
  }
  return { ctx, index }
}

const EPSILON = 0.01
const STORAGE_PREFIX = 'or-splitter:'

const round = (value: number) => Math.round(value * 100) / 100
const finiteOr = (value: number | undefined, fallback: number) =>
  typeof value === 'number' && Number.isFinite(value) ? value : fallback
const sameSizes = (a: readonly number[], b: readonly number[]) =>
  a.length === b.length && a.every((v, i) => Math.abs(v - b[i]) < 0.005)
const isCollapsedAt = (panel: PanelConfig | undefined, size: number | undefined) =>
  !!panel && panel.collapsible && size !== undefined && size <= panel.collapsedSize + EPSILON

/** Valida e reescala uma lista de tamanhos para somar 100. `null` se inválida. */
function normalizeSizes(value: unknown, count: number): number[] | null {
  if (!Array.isArray(value) || value.length !== count || count === 0) return null
  if (!value.every((v) => typeof v === 'number' && Number.isFinite(v) && v >= 0)) return null
  const total = (value as number[]).reduce((sum, v) => sum + v, 0)
  if (total <= 0) return null
  return (value as number[]).map((v) => round((v * 100) / total))
}

function readPanel(props: SplitterPanelProps, id: string): PanelConfig {
  const minSize = clamp(finiteOr(props.minSize, 0), 0, 100)
  const maxSize = clamp(finiteOr(props.maxSize, 100), minSize, 100)
  const collapsible = Boolean(props.collapsible)
  return {
    id,
    label: props.label,
    minSize,
    maxSize,
    collapsible,
    collapsedSize: clamp(finiteOr(props.collapsedSize, 0), 0, minSize),
    defaultCollapsed: collapsible && Boolean(props.defaultCollapsed),
  }
}

/** Tamanhos padrão (com `defaultCollapsed` aplicado) e os tamanhos "abertos" de cada painel. */
function resolveDefaults(panels: PanelConfig[], defaultSizes?: number[]) {
  const count = panels.length
  const base =
    normalizeSizes(defaultSizes, count) ?? panels.map(() => round(100 / Math.max(count, 1)))
  const sizes = [...base]
  if (count > 1) {
    panels.forEach((panel, i) => {
      if (!panel.defaultCollapsed) return
      const partner = i + 1 < count ? i + 1 : i - 1
      sizes[partner] = round(sizes[partner] + sizes[i] - panel.collapsedSize)
      sizes[i] = panel.collapsedSize
    })
  }
  return { sizes, expanded: base }
}

interface StoredLayout {
  sizes: number[]
  expanded?: number[]
}

function readStorage(key: string, count: number): StoredLayout | null {
  if (!canUseDOM) return null
  try {
    const raw = window.localStorage.getItem(STORAGE_PREFIX + key)
    if (!raw) return null
    const data = JSON.parse(raw) as Partial<StoredLayout> | null
    const sizes = normalizeSizes(data?.sizes, count)
    if (!sizes) return null
    const expanded =
      Array.isArray(data?.expanded) &&
      data.expanded.length === count &&
      data.expanded.every((v) => typeof v === 'number' && Number.isFinite(v) && v >= 0)
        ? data.expanded
        : undefined
    return { sizes, expanded }
  } catch {
    return null
  }
}

function writeStorage(key: string, layout: StoredLayout) {
  if (!canUseDOM) return
  try {
    window.localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(layout))
  } catch {
    // Armazenamento indisponível (modo privado, cota cheia, bloqueado): segue sem persistir.
  }
}

/** Trava cursor e seleção de texto no documento inteiro durante o arraste. */
function lockDocument(cursor: string) {
  const { style } = document.body
  const previous = {
    cursor: style.cursor,
    userSelect: style.userSelect,
    webkitUserSelect: style.getPropertyValue('-webkit-user-select'),
  }
  style.cursor = cursor
  style.userSelect = 'none'
  style.setProperty('-webkit-user-select', 'none')
  return () => {
    style.cursor = previous.cursor
    style.userSelect = previous.userSelect
    if (previous.webkitUserSelect) style.setProperty('-webkit-user-select', previous.webkitUserSelect)
    else style.removeProperty('-webkit-user-select')
  }
}

function formatPercent(value: number, locale: string) {
  try {
    return new Intl.NumberFormat(locale, { style: 'percent', maximumFractionDigits: 0 }).format(
      value / 100,
    )
  } catch {
    return `${Math.round(value)}%`
  }
}

interface DragState {
  handle: number
  a: number
  b: number
  pointerId: number
  origin: number
  /** px → %: tamanho útil do contêiner (sem os separadores). */
  available: number
  /** -1 em layouts horizontais da direita para a esquerda. */
  sign: number
  startSizes: number[]
  changed: boolean
}

/* -------------------------------------------------------------------------- */
/* Splitter                                                                    */
/* -------------------------------------------------------------------------- */

function isElementOfType<P>(node: ReactNode, type: unknown): node is ReactElement<P> {
  return isValidElement(node) && node.type === type
}

/**
 * Painéis redimensionáveis (lista/detalhe, editor/prévia, inspetores, consoles).
 * Implementa o padrão Window Splitter do WAI-ARIA: cada `SplitterHandle` é um
 * `separator` focável que se move com as setas, Home/End e recolhe com Enter.
 */
export const Splitter = forwardRef<HTMLDivElement, SplitterProps>(function Splitter(
  {
    orientation = 'horizontal',
    sizes: sizesProp,
    defaultSizes,
    onSizesChange,
    onResizeEnd,
    storageKey,
    label,
    step = 2,
    shiftStep = 10,
    stackBelow,
    className,
    style,
    children,
    ...rest
  },
  ref,
) {
  const { t, locale } = useLocale()
  const baseId = useId('or-splitter')
  const rootRef = useRef<HTMLDivElement>(null)
  const horizontal = orientation === 'horizontal'

  // Descobre painéis e separadores entre os filhos diretos (na ordem do DOM).
  const items = Children.toArray(children)
  const panels: PanelConfig[] = []
  const layout: { kind: ItemKind; index: number }[] = []
  const handleBefore: number[] = []
  items.forEach((child) => {
    if (isElementOfType<SplitterPanelProps>(child, SplitterPanel)) {
      const index = panels.length
      panels.push(readPanel(child.props, child.props.id ?? `${baseId}-panel-${index}`))
      layout.push({ kind: 'panel', index })
    } else if (isElementOfType<SplitterHandleProps>(child, SplitterHandle)) {
      layout.push({ kind: 'handle', index: handleBefore.length })
      handleBefore.push(panels.length - 1)
    } else {
      layout.push({ kind: 'other', index: -1 })
    }
  })
  const count = panels.length
  const handlePairs = handleBefore.map((before) => ({
    before,
    after: before + 1 < count ? before + 1 : -1,
  }))
  devWarning(
    handlePairs.some((pair) => pair.before < 0 || pair.after < 0),
    'Cada SplitterHandle precisa ficar entre dois SplitterPanel.',
  )
  devWarning(
    defaultSizes !== undefined && normalizeSizes(defaultSizes, count) === null,
    'Splitter: `defaultSizes` precisa ter um número (>= 0) por painel. Usando divisão igual.',
  )

  const defaults = resolveDefaults(panels, defaultSizes)
  const [rawSizes, setRawSizes] = useControllableState<number[]>({
    value: sizesProp,
    defaultValue: defaults.sizes,
    onChange: onSizesChange,
  })
  const sizes = normalizeSizes(rawSizes, count) ?? defaults.sizes

  const [animate, setAnimate] = useState(false)
  const [dragging, setDragging] = useState<number | null>(null)

  // Últimas versões para os handlers (eventos de ponteiro chegam entre renderizações).
  const sizesRef = useRef(sizes)
  sizesRef.current = sizes
  const panelsRef = useRef(panels)
  panelsRef.current = panels
  const defaultsRef = useRef(defaults)
  defaultsRef.current = defaults
  const onResizeEndRef = useRef(onResizeEnd)
  onResizeEndRef.current = onResizeEnd
  /** Último tamanho aberto de cada painel: destino de Enter ao restaurar. */
  const expandedRef = useRef<number[]>(defaults.expanded)
  const dragRef = useRef<DragState | null>(null)
  const unlockRef = useRef<(() => void) | null>(null)
  const pendingEndRef = useRef(false)

  useEffect(
    () => () => {
      unlockRef.current?.()
      unlockRef.current = null
    },
    [],
  )

  // Restaura o layout salvo antes da primeira pintura (no servidor, fica o padrão).
  useIsomorphicLayoutEffect(() => {
    if (!storageKey) return
    const stored = readStorage(storageKey, panelsRef.current.length)
    if (!stored) return
    if (stored.expanded) expandedRef.current = [...stored.expanded]
    if (sameSizes(stored.sizes, sizesRef.current)) return
    sizesRef.current = stored.sizes
    setRawSizes(stored.sizes)
  }, [storageKey])

  /** Atualiza a memória dos tamanhos abertos: quem acabou de recolher guarda o tamanho anterior. */
  const rememberExpanded = (next: number[], previous: number[]) => {
    const list = panelsRef.current
    expandedRef.current = list.map((panel, i) => {
      if (!isCollapsedAt(panel, next[i])) return next[i]
      if (!isCollapsedAt(panel, previous[i]) && previous[i] !== undefined) return previous[i]
      return expandedRef.current[i] ?? defaultsRef.current.expanded[i]
    })
  }

  const commit = (next: number[], options: { animated: boolean; remember: boolean }) => {
    if (sameSizes(next, sizesRef.current)) return false
    if (options.remember) rememberExpanded(next, sizesRef.current)
    setAnimate(options.animated)
    sizesRef.current = next
    setRawSizes(next)
    return true
  }

  const finish = () => {
    pendingEndRef.current = false
    const final = sizesRef.current
    onResizeEndRef.current?.(final)
    if (storageKey) writeStorage(storageKey, { sizes: final, expanded: expandedRef.current })
  }

  /** Faixa do painel primário sem recolher ninguém, respeitando os dois vizinhos. */
  const expandedRange = (a: number, b: number, total: number): [number, number] => {
    const pa = panelsRef.current[a]
    const pb = panelsRef.current[b]
    return [Math.max(pa.minSize, total - pb.maxSize), Math.min(pa.maxSize, total - pb.minSize)]
  }

  const resizePair = (current: number[], a: number, b: number, targetA: number) => {
    const total = current[a] + current[b]
    const [lo, hi] = expandedRange(a, b, total)
    if (lo > hi + EPSILON) return null
    const nextA = round(clamp(targetA, lo, hi))
    const next = [...current]
    next[a] = nextA
    next[b] = round(total - nextA)
    return next
  }

  const collapsePair = (current: number[], target: number, partner: number) => {
    const list = panelsRef.current
    const total = current[target] + current[partner]
    const partnerSize = total - list[target].collapsedSize
    if (partnerSize > list[partner].maxSize + EPSILON) return null
    const next = [...current]
    next[target] = list[target].collapsedSize
    next[partner] = round(partnerSize)
    return next
  }

  /** Arraste: abaixo da metade do caminho até o mínimo, um painel recolhível recolhe. */
  const resolveDrag = (start: number[], a: number, b: number, targetA: number) => {
    const pa = panelsRef.current[a]
    const pb = panelsRef.current[b]
    const total = start[a] + start[b]
    if (pa.collapsible && targetA < (pa.collapsedSize + pa.minSize) / 2) {
      const next = collapsePair(start, a, b)
      if (next) return next
    }
    if (pb.collapsible && total - targetA < (pb.collapsedSize + pb.minSize) / 2) {
      const next = collapsePair(start, b, a)
      if (next) return next
    }
    return resizePair(start, a, b, targetA)
  }

  const isRtl = () =>
    horizontal && !!rootRef.current && canUseDOM && getComputedStyle(rootRef.current).direction === 'rtl'

  const handleKeyDown = (index: number, event: ReactKeyboardEvent<HTMLDivElement>) => {
    const pair = handlePairs[index]
    if (!pair || pair.before < 0 || pair.after < 0) return
    const { before: a, after: b } = pair
    const list = panelsRef.current
    const current = sizesRef.current
    const collapsedA = isCollapsedAt(list[a], current[a])
    const collapsedB = isCollapsedAt(list[b], current[b])

    let direction = 0
    if (horizontal && (event.key === 'ArrowLeft' || event.key === 'ArrowRight')) {
      direction = event.key === 'ArrowRight' ? 1 : -1
      if (isRtl()) direction = -direction
    } else if (!horizontal && (event.key === 'ArrowUp' || event.key === 'ArrowDown')) {
      direction = event.key === 'ArrowDown' ? 1 : -1
    }

    let next: number[] | null = null
    let animated = false
    if (direction !== 0) {
      event.preventDefault()
      // Setas não recolhem nem "empurram" um painel já recolhido: só Enter (ou arraste).
      if ((direction < 0 && collapsedA) || (direction > 0 && collapsedB)) return
      const amount = event.shiftKey ? shiftStep : step
      next = resizePair(current, a, b, current[a] + direction * amount)
    } else if (event.key === 'Home' || event.key === 'End') {
      event.preventDefault()
      const isHome = event.key === 'Home'
      if ((isHome && collapsedA) || (!isHome && collapsedB)) return
      const [lo, hi] = expandedRange(a, b, current[a] + current[b])
      next = resizePair(current, a, b, isHome ? lo : hi)
      animated = true
    } else if (event.key === 'Enter') {
      // Recolhe o painel primário; se ele não for recolhível, o secundário (ex.: console embaixo).
      const target = list[a].collapsible ? a : list[b].collapsible ? b : -1
      if (target < 0) return
      event.preventDefault()
      const partner = target === a ? b : a
      if (isCollapsedAt(list[target], current[target])) {
        const remembered = expandedRef.current[target]
        const restore =
          remembered !== undefined && remembered > list[target].collapsedSize + EPSILON
            ? remembered
            : Math.max(defaultsRef.current.expanded[target] ?? 0, list[target].minSize)
        const total = current[a] + current[b]
        next = resizePair(current, a, b, target === a ? restore : total - restore)
      } else {
        next = collapsePair(current, target, partner)
      }
      animated = true
    } else {
      return
    }
    if (next && commit(next, { animated, remember: true })) pendingEndRef.current = true
  }

  const handleKeyUp = () => {
    if (pendingEndRef.current) finish()
  }

  const handlePointerDown = (index: number, event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.button !== 0 || dragRef.current) return
    const pair = handlePairs[index]
    const root = rootRef.current
    if (!root || !pair || pair.before < 0 || pair.after < 0) return
    const rect = root.getBoundingClientRect()
    const handlesSize = Array.from(root.children)
      .filter((el) => el.classList.contains('or-splitter__handle'))
      .reduce((sum, el) => {
        const r = el.getBoundingClientRect()
        return sum + (horizontal ? r.width : r.height)
      }, 0)
    const available = (horizontal ? rect.width : rect.height) - handlesSize
    if (available <= 0) return
    event.currentTarget.setPointerCapture?.(event.pointerId)
    dragRef.current = {
      handle: index,
      a: pair.before,
      b: pair.after,
      pointerId: event.pointerId,
      origin: horizontal ? event.clientX : event.clientY,
      available,
      sign: isRtl() ? -1 : 1,
      startSizes: sizesRef.current,
      changed: false,
    }
    unlockRef.current?.()
    unlockRef.current = canUseDOM ? lockDocument(horizontal ? 'col-resize' : 'row-resize') : null
    setAnimate(false)
    setDragging(index)
  }

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current
    if (!drag || event.pointerId !== drag.pointerId) return
    const position = horizontal ? event.clientX : event.clientY
    const delta = (((position - drag.origin) * drag.sign) / drag.available) * 100
    const next = resolveDrag(drag.startSizes, drag.a, drag.b, drag.startSizes[drag.a] + delta)
    if (next && commit(next, { animated: false, remember: false })) drag.changed = true
  }

  const handlePointerEnd = (event: ReactPointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current
    if (!drag || event.pointerId !== drag.pointerId) return
    dragRef.current = null
    const target = event.currentTarget
    if (target.hasPointerCapture?.(event.pointerId)) target.releasePointerCapture?.(event.pointerId)
    unlockRef.current?.()
    unlockRef.current = null
    setDragging(null)
    if (drag.changed) {
      rememberExpanded(sizesRef.current, drag.startSizes)
      finish()
    }
  }

  /** Clique duplo: volta aos tamanhos padrão (`defaultSizes`, com `defaultCollapsed`). */
  const handleDoubleClick = () => {
    const { sizes: initial, expanded } = defaultsRef.current
    const changed = commit(initial, { animated: true, remember: false })
    expandedRef.current = panelsRef.current.map((panel, i) =>
      isCollapsedAt(panel, initial[i]) ? expanded[i] : initial[i],
    )
    if (changed) finish()
  }

  // Estado de cada separador (valores ARIA em % do painel primário).
  const handles: HandleState[] = handlePairs.map(({ before: a, after: b }) => {
    const pa = panels[a]
    const pb = panels[b]
    const fallbackLabel = pa?.label ?? pb?.label
    const name = fallbackLabel ? t('splitterResize', { label: fallbackLabel }) : t('splitterResizePanels')
    if (!pa || !pb) return { before: a, after: b, name, collapsed: false }
    const total = sizes[a] + sizes[b]
    const lowA = pa.collapsible ? pa.collapsedSize : pa.minSize
    const lowB = pb.collapsible ? pb.collapsedSize : pb.minSize
    const collapsedA = isCollapsedAt(pa, sizes[a])
    const collapsedB = isCollapsedAt(pb, sizes[b])
    const collapsedPanel = collapsedA ? pa : collapsedB ? pb : undefined
    const offset = sizes.slice(0, a + 1).reduce((sum, v) => sum + v, 0)
    return {
      before: a,
      after: b,
      valueNow: Math.round(sizes[a]),
      valueMin: Math.round(Math.max(lowA, total - pb.maxSize)),
      valueMax: Math.round(Math.min(pa.maxSize, total - lowB)),
      valueText: collapsedPanel
        ? collapsedPanel.label
          ? t('splitterCollapsed', { label: collapsedPanel.label })
          : t('splitterPanelCollapsed')
        : formatPercent(sizes[a], locale),
      controls: pa.id,
      name,
      collapsed: Boolean(collapsedPanel),
      edge: offset <= EPSILON ? 'start' : offset >= 100 - EPSILON ? 'end' : undefined,
    }
  })

  // Trilhas da grade: painéis em fr (dividem o espaço sem os separadores), separadores com 1px.
  const tracks = layout
    .map((item) =>
      item.kind === 'panel'
        ? `minmax(0, ${sizes[item.index]}fr)`
        : item.kind === 'handle'
          ? 'var(--or-border-thin)'
          : 'auto',
    )
    .join(' ')

  const ctx: SplitterContextValue = {
    orientation,
    panels,
    sizes,
    handles,
    dragging,
    onKeyDown: handleKeyDown,
    onKeyUp: handleKeyUp,
    onBlur: handleKeyUp,
    onPointerDown: handlePointerDown,
    onPointerMove: handlePointerMove,
    onPointerEnd: handlePointerEnd,
    onDoubleClick: handleDoubleClick,
  }

  const named = Boolean(label || rest['aria-label'] || rest['aria-labelledby'])

  return (
    <SplitterContext.Provider value={ctx}>
      <div
        ref={mergeRefs(ref, rootRef)}
        role={named ? 'group' : undefined}
        aria-label={label}
        className={cx('or-splitter', `or-splitter--${orientation}`, className)}
        data-orientation={orientation}
        data-stack-below={stackBelow}
        data-animate={animate || undefined}
        data-dragging={dragging !== null || undefined}
        style={{ ...style, '--_tracks': tracks } as CSSProperties}
        {...rest}
      >
        {items.map((child, i) => {
          const item = layout[i]
          if (item.kind === 'other') return child
          return (
            <ItemContext.Provider
              key={isValidElement(child) && child.key !== null ? child.key : i}
              value={item.index}
            >
              {child}
            </ItemContext.Provider>
          )
        })}
      </div>
    </SplitterContext.Provider>
  )
})

/* -------------------------------------------------------------------------- */
/* SplitterPanel                                                               */
/* -------------------------------------------------------------------------- */

/**
 * Painel do `Splitter`. Os limites (`minSize`, `maxSize`) e o recolhimento são
 * lidos pelo Splitter — o painel precisa ser filho direto dele.
 */
export const SplitterPanel = forwardRef<HTMLDivElement, SplitterPanelProps>(function SplitterPanel(
  {
    minSize: _minSize,
    maxSize: _maxSize,
    collapsible: _collapsible,
    collapsedSize: _collapsedSize,
    defaultCollapsed: _defaultCollapsed,
    label: _label,
    id: _id,
    className,
    children,
    ...rest
  },
  ref,
) {
  const { ctx, index } = useSplitterItem('SplitterPanel')
  const panel = ctx.panels[index]
  const collapsed = isCollapsedAt(panel, ctx.sizes[index])
  return (
    <div
      ref={ref}
      id={panel?.id}
      className={cx('or-splitter__panel', className)}
      data-collapsed={collapsed || undefined}
      // Recolhido em 0%: o conteúdo sai da tela, do foco e da árvore de acessibilidade (CSS).
      data-hidden={(collapsed && panel?.collapsedSize === 0) || undefined}
      {...rest}
    >
      {/* Um Splitter aninhado começa uma contagem nova. */}
      <ItemContext.Provider value={null}>{children}</ItemContext.Provider>
    </div>
  )
})

/* -------------------------------------------------------------------------- */
/* SplitterHandle                                                              */
/* -------------------------------------------------------------------------- */

/**
 * Separador entre dois `SplitterPanel` (`role="separator"`, focável). Arraste
 * com mouse, caneta ou toque; setas, Shift + setas, Home/End e Enter pelo teclado;
 * clique duplo volta aos tamanhos padrão.
 */
export const SplitterHandle = forwardRef<HTMLDivElement, SplitterHandleProps>(function SplitterHandle(
  {
    className,
    onKeyDown,
    onKeyUp,
    onBlur,
    onPointerDown,
    onPointerMove,
    onPointerUp,
    onPointerCancel,
    onLostPointerCapture,
    onDoubleClick,
    'aria-label': ariaLabel,
    ...rest
  },
  ref,
) {
  const { ctx, index } = useSplitterItem('SplitterHandle')
  const state = ctx.handles[index]
  const usable = !!state && state.before >= 0 && state.after >= 0
  const labelledBy = rest['aria-labelledby']
  return (
    // Um separador focável é um widget (WAI-ARIA 1.2, padrão Window Splitter): o plugin o trata como estático.
    // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
    <div
      ref={ref}
      role="separator"
      // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex -- separador focável (ver acima)
      tabIndex={usable ? 0 : undefined}
      aria-orientation={ctx.orientation === 'horizontal' ? 'vertical' : 'horizontal'}
      aria-valuenow={state?.valueNow}
      aria-valuemin={state?.valueMin}
      aria-valuemax={state?.valueMax}
      aria-valuetext={state?.valueText}
      aria-controls={state?.controls}
      aria-label={labelledBy ? undefined : (ariaLabel ?? state?.name)}
      className={cx('or-splitter__handle', className)}
      data-dragging={ctx.dragging === index || undefined}
      data-collapsed={state?.collapsed || undefined}
      data-edge={state?.edge}
      onKeyDown={composeEventHandlers(onKeyDown, (event) => ctx.onKeyDown(index, event))}
      onKeyUp={composeEventHandlers(onKeyUp, ctx.onKeyUp)}
      onBlur={composeEventHandlers(onBlur, ctx.onBlur)}
      onPointerDown={composeEventHandlers(onPointerDown, (event) => ctx.onPointerDown(index, event))}
      onPointerMove={composeEventHandlers(onPointerMove, ctx.onPointerMove)}
      onPointerUp={composeEventHandlers(onPointerUp, ctx.onPointerEnd)}
      onPointerCancel={composeEventHandlers(onPointerCancel, ctx.onPointerEnd)}
      onLostPointerCapture={composeEventHandlers(onLostPointerCapture, ctx.onPointerEnd)}
      onDoubleClick={composeEventHandlers(onDoubleClick, ctx.onDoubleClick)}
      {...rest}
    >
      <span className="or-splitter__grip" aria-hidden="true">
        <Icon name="grip" size={16} />
      </span>
    </div>
  )
})
