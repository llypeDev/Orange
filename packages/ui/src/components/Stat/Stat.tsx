import {
  Children,
  createContext,
  forwardRef,
  isValidElement,
  useContext,
  type CSSProperties,
  type ElementType,
  type HTMLAttributes,
  type ReactNode,
} from 'react'
import { Icon } from '../../icons'
import { useLocale } from '../../providers'
import { cx } from '../../utils'
import { VisuallyHidden } from '../VisuallyHidden'
import './Stat.css'

export type StatTrend = 'increase' | 'decrease' | 'neutral'
export type StatDeltaTone = 'positive' | 'negative' | 'neutral'
export type StatSize = 'sm' | 'md' | 'lg'

const StatGroupContext = createContext<{ size?: StatSize } | null>(null)

export interface StatProps extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
  /** O que está sendo medido (vira o `<dt>`). */
  label: ReactNode
  /** A métrica, já formatada (ex.: "R$ 48,2 mil"). */
  value: ReactNode
  /** Variação exibida ao lado da seta (ex.: "12%"). */
  delta?: ReactNode
  /** Direção da variação: define a seta e o texto acessível. Padrão: `neutral`. */
  trend?: StatTrend
  /**
   * Se a variação é boa ou ruim. Padrão: aumento → `positive`, queda →
   * `negative`. Inverta para métricas como churn ou tempo de resposta.
   */
  deltaTone?: StatDeltaTone
  /** Contexto da métrica (ex.: "vs. mês anterior"). */
  help?: ReactNode
  /** Tamanho do número. Padrão: `md` (ou o do `StatGroup`). */
  size?: StatSize
}

function nodeText(node: ReactNode): string {
  if (node === null || node === undefined || typeof node === 'boolean') return ''
  if (typeof node === 'string' || typeof node === 'number') return String(node)
  if (Array.isArray(node)) return node.map(nodeText).join('')
  if (isValidElement<{ children?: ReactNode }>(node)) return nodeText(node.props.children)
  return ''
}

const TREND_ICON = { increase: 'arrow-up', decrease: 'arrow-down', neutral: 'minus' } as const
const TREND_MESSAGE = { increase: 'statIncrease', decrease: 'statDecrease', neutral: 'statChange' } as const
const DEFAULT_TONE: Record<StatTrend, StatDeltaTone> = { increase: 'positive', decrease: 'negative', neutral: 'neutral' }

/**
 * Métrica em destaque: rótulo, número grande e variação opcional, com
 * semântica de lista de definição (`dt`/`dd`).
 */
export const Stat = forwardRef<HTMLElement, StatProps>(function Stat(
  { label, value, delta, trend = 'neutral', deltaTone, help, size: sizeProp, className, ...rest },
  ref,
) {
  const { t } = useLocale()
  const group = useContext(StatGroupContext)
  const size = sizeProp ?? group?.size ?? 'md'
  const tone = deltaTone ?? DEFAULT_TONE[trend]
  const Root = (group ? 'div' : 'dl') as ElementType
  const hasDelta = delta !== undefined && delta !== null && delta !== ''

  return (
    <Root ref={ref} className={cx('or-stat', `or-stat--${size}`, className)} {...rest}>
      <dt className="or-stat__label">{label}</dt>
      <dd className="or-stat__value">{value}</dd>
      {(hasDelta || help) && (
        <dd className="or-stat__meta">
          {hasDelta && (
            <span className={cx('or-stat__delta', `or-stat__delta--${tone}`)}>
              <Icon name={TREND_ICON[trend]} size={14} strokeWidth={2.25} />
              <span aria-hidden="true">{delta}</span>
              <VisuallyHidden>{t(TREND_MESSAGE[trend], { value: nodeText(delta) })}</VisuallyHidden>
            </span>
          )}
          {help && <span className="or-stat__help">{help}</span>}
        </dd>
      )}
    </Root>
  )
})

export interface StatGroupProps extends HTMLAttributes<HTMLDListElement> {
  /** Número de colunas em telas largas. Padrão: quantidade de Stats (até 4). */
  columns?: number
  /** Tamanho aplicado a todos os Stats. */
  size?: StatSize
}

/**
 * Grade de métricas com divisórias de 1px entre as células. Renderiza um
 * único `<dl>`; cada `Stat` vira um grupo `dt`/`dd`. Reflui para 2 e 1
 * coluna conforme a largura disponível.
 */
export const StatGroup = forwardRef<HTMLDListElement, StatGroupProps>(function StatGroup(
  { columns, size, className, style, children, ...rest },
  ref,
) {
  const count = Children.toArray(children).filter(isValidElement).length
  const cols = Math.max(1, columns ?? Math.min(count || 1, 4))
  const gridStyle = {
    '--_cols': cols,
    '--_cols-md': Math.min(cols, 2),
    ...style,
  } as CSSProperties
  return (
    <StatGroupContext.Provider value={{ size }}>
      <div className="or-stat-group">
        <dl ref={ref} className={cx('or-stat-group__list', className)} style={gridStyle} {...rest}>
          {children}
        </dl>
      </div>
    </StatGroupContext.Provider>
  )
})
