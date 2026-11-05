/**
 * Peças internas compartilhadas pelos gráficos (BarChart e LineChart): figura com
 * legenda, tabela de dados alternativa, dica, região de anúncio e os hooks de
 * largura, movimento e exploração por teclado. Não são exportadas pela biblioteca.
 */
import {
  forwardRef,
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type FocusEvent,
  type HTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
  type RefCallback,
} from 'react'
import { useEscapeKey, useId, useInView, useIsomorphicLayoutEffect, useReducedMotion } from '../../hooks'
import { Icon } from '../../icons'
import { useLocale } from '../../providers'
import { cx } from '../../utils'
import { VisuallyHidden } from '../VisuallyHidden'
import './ChartFrame.css'

/* --- Formas e traços ------------------------------------------------------ */

export type ChartMarkerShape = 'circle' | 'square' | 'triangle' | 'diamond' | 'triangle-down'

/** Marcador de cada série, na ordem: a forma reforça a cor (nunca só a cor). */
export const MARKER_SHAPES: ChartMarkerShape[] = ['circle', 'square', 'triangle', 'diamond', 'triangle-down']

/** Traço de cada série de linha, na ordem (a primeira é contínua). Pontas redondas: `0.1` vira um ponto. */
export const LINE_DASHES = ['', '6 5', '0.1 4.5', '10 5 0.1 5', '14 6']

/** Contorno do marcador como `path` (um só elemento, fácil de animar e de contornar). */
export function markerPath(shape: ChartMarkerShape, cx: number, cy: number, r: number): string {
  switch (shape) {
    case 'square': {
      const s = r * 1.8
      return `M${cx - s / 2} ${cy - s / 2}h${s}v${s}h${-s}Z`
    }
    case 'triangle':
      return `M${cx} ${cy - r * 1.25}L${cx + r * 1.2} ${cy + r * 0.85}H${cx - r * 1.2}Z`
    case 'triangle-down':
      return `M${cx} ${cy + r * 1.25}L${cx + r * 1.2} ${cy - r * 0.85}H${cx - r * 1.2}Z`
    case 'diamond':
      return `M${cx} ${cy - r * 1.3}L${cx + r * 1.3} ${cy}L${cx} ${cy + r * 1.3}L${cx - r * 1.3} ${cy}Z`
    default:
      return `M${cx - r} ${cy}a${r} ${r} 0 1 0 ${2 * r} 0a${r} ${r} 0 1 0 ${-2 * r} 0Z`
  }
}

/** Cor da série como custom property (`--_color`), lida pelo CSS das marcas. */
export const colorStyle = (color: string) => ({ '--_color': color }) as CSSProperties

/* --- Hooks ---------------------------------------------------------------- */

/**
 * Largura do elemento, acompanhada com ResizeObserver. Enquanto não há medida
 * (servidor, jsdom), usa `fallback`.
 */
export function useElementWidth<T extends HTMLElement>(fallback = 640): [RefCallback<T>, number] {
  const [node, setNode] = useState<T | null>(null)
  const [width, setWidth] = useState(0)
  useIsomorphicLayoutEffect(() => {
    if (!node) return
    setWidth(Math.floor(node.getBoundingClientRect().width))
    if (typeof ResizeObserver === 'undefined') return
    const observer = new ResizeObserver((entries) => {
      const next = entries[0]?.contentRect.width
      if (next !== undefined) setWidth(Math.floor(next))
    })
    observer.observe(node)
    return () => observer.disconnect()
  }, [node])
  return [setNode, width > 0 ? width : fallback]
}

/**
 * Estado da entrada dos gráficos:
 * - `static`: tudo desenhado, sem animação (servidor, movimento reduzido, sem IntersectionObserver);
 * - `pending`: marcas recolhidas, esperando o gráfico entrar na tela;
 * - `enter`: animação de entrada (uma vez).
 */
export type ChartMotionState = 'static' | 'pending' | 'enter'

export function useChartMotion<T extends Element>(): [RefCallback<T>, ChartMotionState] {
  const reduced = useReducedMotion()
  const [ref, inView] = useInView<T>({ threshold: 0.15, rootMargin: '0px' })
  const [state, setState] = useState<ChartMotionState>('static')
  const armed = useRef(false)
  // Antes da primeira pintura: nada "pisca" (desenhado → recolhido → crescendo).
  useIsomorphicLayoutEffect(() => {
    if (armed.current || reduced || typeof IntersectionObserver === 'undefined') return
    armed.current = true
    setState(inView ? 'enter' : 'pending')
  }, [reduced, inView])
  useEffect(() => {
    if (inView) setState((s) => (s === 'pending' ? 'enter' : s))
  }, [inView])
  return [ref, reduced ? 'static' : state]
}

export interface ChartActive {
  /** Categoria (barra, ponto do eixo X). */
  index: number
  /** Série dentro da categoria. */
  series: number
  /** Quem moveu o destaque: teclado (anuncia) ou ponteiro (só a dica). */
  source: 'keyboard' | 'pointer'
}

export interface ChartExplorerOptions {
  count: number
  seriesCount: number
  /** Teclas que avançam/voltam a categoria e a série. */
  keys: { next: string; prev: string; seriesNext: string; seriesPrev: string }
  /** Texto anunciado ao mover pelo teclado ("mar · Vendas: R$ 12.400"). */
  describe: (index: number, series: number) => string
}

/**
 * Destaque compartilhado por teclado e ponteiro. As setas movem o destaque e a
 * região `status` anuncia o valor; Escape limpa. O ponteiro só mostra a dica.
 */
export function useChartExplorer({ count, seriesCount, keys, describe }: ChartExplorerOptions) {
  const [active, setActiveState] = useState<ChartActive | null>(null)
  // A dica continua com o último conteúdo enquanto some (transição de saída).
  const [last, setLast] = useState<ChartActive | null>(null)
  const [announcement, setAnnouncement] = useState('')

  const setActive = useCallback((next: ChartActive | null) => {
    setActiveState(next)
    if (next) setLast(next)
  }, [])

  // Dados mudaram (filtro): o destaque não pode apontar para fora.
  useEffect(() => {
    if (active && (active.index >= count || active.series >= seriesCount)) setActive(null)
  }, [active, count, seriesCount, setActive])

  const move = (index: number, series: number) => {
    setActive({ index, series, source: 'keyboard' })
    setAnnouncement(describe(index, series))
  }

  const onKeyDown = (event: KeyboardEvent<Element>) => {
    if (count === 0) return
    const index = active?.index
    const series = active?.series ?? 0
    const lastIndex = count - 1
    switch (event.key) {
      case keys.next:
        move(index === undefined ? 0 : Math.min(lastIndex, index + 1), series)
        break
      case keys.prev:
        move(index === undefined ? lastIndex : Math.max(0, index - 1), series)
        break
      case keys.seriesNext:
        move(index ?? 0, active ? Math.min(seriesCount - 1, series + 1) : 0)
        break
      case keys.seriesPrev:
        move(index ?? 0, active ? Math.max(0, series - 1) : 0)
        break
      case 'Home':
        move(0, series)
        break
      case 'End':
        move(lastIndex, series)
        break
      case 'Escape':
        if (!active) return
        setActive(null)
        setAnnouncement('')
        // Não fecha também o diálogo/painel em volta.
        event.stopPropagation()
        break
      default:
        return
    }
    event.preventDefault()
  }

  const onBlur = (_event: FocusEvent<Element>) => {
    if (active?.source === 'keyboard') setActive(null)
  }

  const onPointerLeave = () => {
    if (active?.source === 'pointer') setActive(null)
  }

  const point = (index: number, series: number) => {
    if (active?.source === 'pointer' && active.index === index && active.series === series) return
    setActive({ index, series, source: 'pointer' })
  }

  // WCAG 1.4.13: a dica do hover some com Escape sem mover o ponteiro.
  useEscapeKey(() => setActive(null), active?.source === 'pointer')

  return { active, last, announcement, point, handlers: { onKeyDown, onBlur, onPointerLeave } }
}

/* --- Legenda -------------------------------------------------------------- */

export interface ChartLegendItem {
  label: string
  color: string
  /** `bar`: quadrado; `line`: traço com o marcador da série. */
  mark: 'bar' | 'line'
  dash?: string
  shape?: ChartMarkerShape
}

export function ChartLegend({ items }: { items: ChartLegendItem[] }) {
  const { t } = useLocale()
  return (
    <ul className="or-chart__legend" role="list" aria-label={t('chartLegend')}>
      {items.map((item, i) => (
        <li key={`${item.label}-${i}`} className="or-chart__legend-item" style={colorStyle(item.color)}>
          {item.mark === 'line' ? (
            <svg className="or-chart__swatch" width="28" height="14" viewBox="0 0 28 14" aria-hidden="true" focusable="false">
              <line className="or-chart__swatch-line" x1="1" x2="27" y1="7" y2="7" strokeDasharray={item.dash || undefined} />
              <path className="or-chart__swatch-marker" d={markerPath(item.shape ?? 'circle', 14, 7, 4)} />
            </svg>
          ) : (
            <svg className="or-chart__swatch" width="12" height="12" viewBox="0 0 12 12" aria-hidden="true" focusable="false">
              <rect className="or-chart__swatch-fill" width="12" height="12" />
            </svg>
          )}
          {item.label}
        </li>
      ))}
    </ul>
  )
}

/* --- Dica ----------------------------------------------------------------- */

export interface ChartTooltipRow {
  key: string
  label: string
  value: string
  color: string
  active?: boolean
}

export interface ChartTooltipProps {
  open: boolean
  /** Âncora em px, relativa à área do gráfico. */
  x: number
  y: number
  /** Largura da área do gráfico (para não vazar pelas bordas). */
  width: number
  title: string
  rows: ChartTooltipRow[]
  /** Linha extra no fim (ex.: total da pilha). */
  footer?: { label: string; value: string }
}

/** Dica visual (o leitor de tela ouve a região `status` e tem a tabela). */
export function ChartTooltip({ open, x, y, width, title, rows, footer }: ChartTooltipProps) {
  const edge = Math.min(88, width / 3)
  const align = x < edge ? 'start' : x > width - edge ? 'end' : 'center'
  return (
    <div
      className="or-chart__tooltip"
      data-state={open ? 'open' : 'closed'}
      data-align={align}
      aria-hidden="true"
      style={{ '--_x': `${Math.round(x)}px`, '--_y': `${Math.round(y)}px` } as CSSProperties}
    >
      <p className="or-chart__tooltip-title">{title}</p>
      <ul className="or-chart__tooltip-list">
        {rows.map((row) => (
          <li
            key={row.key}
            className="or-chart__tooltip-row"
            data-active={row.active || undefined}
            style={colorStyle(row.color)}
          >
            <span className="or-chart__tooltip-key" />
            <strong className="or-chart__tooltip-value">{row.value}</strong>
            <span className="or-chart__tooltip-label">{row.label}</span>
          </li>
        ))}
        {footer && (
          <li className="or-chart__tooltip-row or-chart__tooltip-row--footer">
            <span className="or-chart__tooltip-key" />
            <strong className="or-chart__tooltip-value">{footer.value}</strong>
            <span className="or-chart__tooltip-label">{footer.label}</span>
          </li>
        )}
      </ul>
    </div>
  )
}

/* --- Figura --------------------------------------------------------------- */

export interface ChartTableData {
  /** Cabeçalho da primeira coluna (as categorias). */
  categoryLabel: string
  columns: string[]
  rows: { label: string; cells: (number | null)[] }[]
  format: (value: number) => string
}

export type ChartVariant = 'outline' | 'plain'

/** Props comuns a BarChart e LineChart. */
export interface ChartBaseProps extends Omit<HTMLAttributes<HTMLElement>, 'title' | 'children'> {
  /** Título do gráfico: diz o quê. Vira o `<figcaption>` e o nome do gráfico. */
  title: string
  /** Subtítulo visível: quando e em que unidade ("R$ mil por mês · 2026"). */
  description?: ReactNode
  /** Resumo em texto para leitores de tela (a conclusão). Padrão: gerado a partir dos dados. */
  summary?: string
  /** Fonte dos dados, abaixo do gráfico. */
  source?: ReactNode
  /** Esconde o título e o subtítulo visualmente (continuam no `<figcaption>`). */
  hideCaption?: boolean
  /** `outline` (padrão): borda de 1px e respiro interno. `plain`: sem moldura, para cartões. */
  variant?: ChartVariant
  /** Altura da área do gráfico em px, incluindo os rótulos dos eixos. */
  height?: number
  /** Formato dos números: função ou opções do `Intl.NumberFormat` (ex.: `{ style: 'currency', currency: 'BRL' }`). */
  valueFormat?: ((value: number) => string) | Intl.NumberFormatOptions
  /** Cabeçalho da coluna de categorias na tabela de dados (ex.: "Mês"). */
  categoryLabel?: string
  /** Começa com a tabela de dados visível. */
  defaultShowData?: boolean
}

interface ChartFigureProps extends Omit<HTMLAttributes<HTMLElement>, 'title' | 'children'> {
  title: string
  description?: ReactNode
  source?: ReactNode
  hideCaption?: boolean
  variant: ChartVariant
  motion: ChartMotionState
  legend?: ChartLegendItem[]
  table: ChartTableData
  announcement?: string
  /** Id da instrução de teclado (referenciada pelo `aria-describedby` do gráfico). */
  hintId?: string
  defaultShowData?: boolean
  children: ReactNode
}

/**
 * `<figure>` com título/subtítulo no `<figcaption>`, legenda acima do gráfico
 * (2+ séries), fonte, botão "Ver dados" e a tabela alternativa — sempre no DOM
 * para leitores de tela; o botão só a mostra visualmente.
 */
export const ChartFigure = forwardRef<HTMLElement, ChartFigureProps>(function ChartFigure(
  {
    title,
    description,
    source,
    hideCaption,
    variant,
    motion,
    legend,
    table,
    announcement,
    hintId,
    defaultShowData = false,
    className,
    children,
    ...rest
  },
  ref,
) {
  const { t } = useLocale()
  const dataId = useId('or-chart-data')
  const titleId = useId('or-chart-title')
  const [showData, setShowData] = useState(defaultShowData)
  const caption = t('chartDataCaption', { title })

  return (
    <figure
      ref={ref}
      className={cx('or-chart', `or-chart--${variant}`, className)}
      data-motion={motion}
      aria-labelledby={titleId}
      {...rest}
    >
      <figcaption className={cx('or-chart__caption', hideCaption && 'or-visually-hidden')}>
        <span id={titleId} className="or-chart__title">
          {title}
        </span>
        {description && <span className="or-chart__description">{description}</span>}
      </figcaption>
      {legend && legend.length > 1 && <ChartLegend items={legend} />}
      <div className="or-chart__body">{children}</div>
      {hintId && (
        <VisuallyHidden id={hintId} className="or-chart__hint">
          {t('chartKeyboardHint')}
        </VisuallyHidden>
      )}
      <VisuallyHidden role="status" className="or-chart__live">
        {announcement}
      </VisuallyHidden>
      {source && <p className="or-chart__source">{source}</p>}
      <button
        type="button"
        className="or-chart__toggle"
        aria-expanded={showData}
        aria-controls={dataId}
        onClick={() => setShowData((v) => !v)}
      >
        <span>{showData ? t('chartHideData') : t('chartShowData')}</span>
        <Icon name="chevron-down" size={16} className="or-chart__toggle-icon" />
      </button>
      {/* Recolhida, a tabela fica com altura 0 mas continua na árvore de acessibilidade. */}
      <div id={dataId} className="or-collapse or-chart__data" data-state={showData ? 'open' : 'closed'}>
        <div>
          <div
            className="or-chart__table-scroll"
            {...(showData ? { tabIndex: 0, role: 'region', 'aria-label': caption } : null)}
          >
            <table className="or-chart__table">
              <caption className="or-visually-hidden">{caption}</caption>
              <thead>
                <tr>
                  <th scope="col">{table.categoryLabel}</th>
                  {table.columns.map((column, i) => (
                    <th key={`${column}-${i}`} scope="col" className="or-chart__num">
                      {column}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {table.rows.map((row, ri) => (
                  <tr key={`${row.label}-${ri}`}>
                    <th scope="row">{row.label}</th>
                    {row.cells.map((cell, ci) => (
                      <td key={ci} className="or-chart__num">
                        {cell === null ? (
                          <>
                            <span aria-hidden="true">—</span>
                            <VisuallyHidden>{t('chartNoData')}</VisuallyHidden>
                          </>
                        ) : (
                          table.format(cell)
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </figure>
  )
})
