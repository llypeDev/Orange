import {
  Children,
  createContext,
  forwardRef,
  isValidElement,
  useContext,
  useMemo,
  type CSSProperties,
  type ElementType,
  type HTMLAttributes,
  type ReactNode,
} from 'react'
import { useCountUp, useInView, useReducedMotion } from '../../hooks'
import { Icon } from '../../icons'
import { useLocale } from '../../providers'
import { cx, mergeRefs } from '../../utils'
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
  /**
   * Conta de zero até o valor quando o Stat entra na tela. Funciona com
   * números e com textos já formatados ("R$ 48,2 mil", "1h 12min"). Leitores
   * de tela ouvem só o valor final. Sem efeito em movimento reduzido.
   */
  animate?: boolean
  /** Formata `value` quando ele é um número. Padrão: `Intl.NumberFormat` do idioma. */
  format?: (value: number) => string
}

function nodeText(node: ReactNode): string {
  if (node === null || node === undefined || typeof node === 'boolean') return ''
  if (typeof node === 'string' || typeof node === 'number') return String(node)
  if (Array.isArray(node)) return node.map(nodeText).join('')
  if (isValidElement<{ children?: ReactNode }>(node)) return nodeText(node.props.children)
  return ''
}

const COUNT_DURATION = 1200

interface NumberToken {
  start: number
  end: number
  value: number
  decimals: number
  grouped: boolean
}

function separators(locale: string) {
  try {
    const parts = new Intl.NumberFormat(locale).formatToParts(12345.6)
    return {
      group: parts.find((p) => p.type === 'group')?.value ?? ',',
      decimal: parts.find((p) => p.type === 'decimal')?.value ?? '.',
    }
  } catch {
    return { group: ',', decimal: '.' }
  }
}

const escapeRegExp = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

/** Encontra os números de um texto formatado, respeitando os separadores do idioma. */
function tokenize(text: string, locale: string): NumberToken[] {
  const { group, decimal } = separators(locale)
  const pattern = new RegExp(`\\d+(?:[${escapeRegExp(group)}${escapeRegExp(decimal)}]\\d+)*`, 'g')
  const tokens: NumberToken[] = []
  for (const match of text.matchAll(pattern)) {
    const raw = match[0]
    const decimalAt = raw.lastIndexOf(decimal)
    const integer = decimalAt >= 0 ? raw.slice(0, decimalAt) : raw
    const fraction = decimalAt >= 0 ? raw.slice(decimalAt + 1) : ''
    const value = Number(`${integer.split(group).join('')}${fraction ? `.${fraction}` : ''}`)
    if (Number.isNaN(value)) continue
    tokens.push({
      start: match.index ?? 0,
      end: (match.index ?? 0) + raw.length,
      value,
      decimals: fraction.length,
      grouped: integer.includes(group),
    })
  }
  return tokens
}

/** Reescreve o texto com cada número multiplicado por `progress` (0 → 1). */
function interpolateText(text: string, tokens: NumberToken[], progress: number, locale: string) {
  let out = ''
  let cursor = 0
  for (const token of tokens) {
    const formatter = new Intl.NumberFormat(locale, {
      minimumFractionDigits: token.decimals,
      maximumFractionDigits: token.decimals,
      useGrouping: token.grouped,
    })
    out += text.slice(cursor, token.start) + formatter.format(token.value * progress)
    cursor = token.end
  }
  return out + text.slice(cursor)
}

const TREND_ICON = { increase: 'arrow-up', decrease: 'arrow-down', neutral: 'minus' } as const
const TREND_MESSAGE = { increase: 'statIncrease', decrease: 'statDecrease', neutral: 'statChange' } as const
const DEFAULT_TONE: Record<StatTrend, StatDeltaTone> = { increase: 'positive', decrease: 'negative', neutral: 'neutral' }

/**
 * Métrica em destaque: rótulo, número grande e variação opcional, com
 * semântica de lista de definição (`dt`/`dd`).
 */
export const Stat = forwardRef<HTMLElement, StatProps>(function Stat(
  {
    label,
    value,
    delta,
    trend = 'neutral',
    deltaTone,
    help,
    size: sizeProp,
    animate = false,
    format,
    className,
    ...rest
  },
  ref,
) {
  const { t, locale } = useLocale()
  const group = useContext(StatGroupContext)
  const size = sizeProp ?? group?.size ?? 'md'
  const tone = deltaTone ?? DEFAULT_TONE[trend]
  const Root = (group ? 'div' : 'dl') as ElementType
  const hasDelta = delta !== undefined && delta !== null && delta !== ''

  // Texto final da métrica (números são formatados no idioma atual).
  const finalText = useMemo(() => {
    if (typeof value === 'number') return format ? format(value) : new Intl.NumberFormat(locale).format(value)
    return typeof value === 'string' ? value : null
  }, [value, format, locale])
  const tokens = useMemo(
    () => (animate && finalText ? tokenize(finalText, locale) : []),
    [animate, finalText, locale],
  )

  // Contagem: começa quando o Stat entra na tela.
  const reducedMotion = useReducedMotion()
  const [inViewRef, inView] = useInView<HTMLElement>()
  const canCount = animate && !reducedMotion && tokens.length > 0
  const rawProgress = useCountUp(inView ? 1 : 0, { from: 0, duration: COUNT_DURATION, enabled: canCount })
  // O timestamp do rAF pode vir antes do início da contagem: limita a [0, 1].
  const progress = Math.min(1, Math.max(0, rawProgress))
  const counting = canCount && progress < 1
  const composedRef = useMemo(() => mergeRefs(ref, inViewRef), [ref, inViewRef])

  return (
    <Root
      ref={animate ? composedRef : ref}
      className={cx('or-stat', `or-stat--${size}`, className)}
      data-animate={animate || undefined}
      data-inview={animate && (inView || reducedMotion) ? '' : undefined}
      {...rest}
    >
      <dt className="or-stat__label">{label}</dt>
      <dd className="or-stat__value" data-counting={counting || undefined}>
        {counting && finalText ? (
          <>
            {/* O valor final fica no lugar (transparente) para o leitor de tela e para reservar a largura. */}
            <span className="or-stat__value-final">{finalText}</span>
            <span className="or-stat__value-count" aria-hidden="true">
              {interpolateText(finalText, tokens, progress, locale)}
            </span>
          </>
        ) : (
          (finalText ?? value)
        )}
      </dd>
      {(hasDelta || help) && (
        <dd className="or-stat__meta">
          {hasDelta && (
            <span className={cx('or-stat__delta', `or-stat__delta--${tone}`, `or-stat__delta--${trend}`)}>
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
