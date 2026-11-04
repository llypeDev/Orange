import { forwardRef, useEffect, useState, type TimeHTMLAttributes } from 'react'
import { useLocale } from '../../providers'
import { cx, devWarning } from '../../utils'
import './RelativeTime.css'

export type RelativeTimeFormat = 'relative' | 'absolute' | 'auto'
export type RelativeTimeDate = Date | string | number

export interface RelativeTimeProps extends Omit<TimeHTMLAttributes<HTMLTimeElement>, 'dateTime' | 'children'> {
  /** Data de referência (Date, string ISO ou timestamp em ms). */
  date: RelativeTimeDate
  /**
   * `relative` ("há 5 minutos"), `absolute` ("3 de nov. de 2026, 14:05") ou
   * `auto` (relativo até `threshold` dias, depois absoluto). Padrão: `auto`.
   */
  format?: RelativeTimeFormat
  /** No formato `auto`, quantos dias o texto continua relativo. Padrão: `7`. */
  threshold?: number
  /**
   * Intervalo de atualização do texto em ms. Padrão: automático (mais
   * frequente para datas recentes). Use `false` para não atualizar.
   */
  updateInterval?: number | false
  /** `auto` usa expressões como "ontem" e "agora"; `always` sempre usa números. Padrão: `auto`. */
  numeric?: 'auto' | 'always'
  /** Extensão do texto relativo: `long` ("há 5 minutos"), `short` ("há 5 min.") ou `narrow`. */
  relativeStyle?: 'long' | 'short' | 'narrow'
  /** Formato do texto absoluto. Padrão: `{ dateStyle: 'medium', timeStyle: 'short' }`. */
  absoluteFormat?: Intl.DateTimeFormatOptions
  /** Mostra a data completa no `title` (dica ao passar o mouse). Padrão: `true`. */
  showTitle?: boolean
}

const SECOND = 1000
const MINUTE = 60 * SECOND
const HOUR = 60 * MINUTE
const DAY = 24 * HOUR
const WEEK = 7 * DAY
const MONTH = 30.4375 * DAY
const YEAR = 365.25 * DAY

function parseDate(value: RelativeTimeDate): Date | null {
  if (value instanceof Date) return Number.isNaN(value.getTime()) ? null : value
  if (typeof value === 'string') {
    // AAAA-MM-DD é tratado como data local (new Date() assumiria UTC).
    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value.trim())
    if (match) return new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]))
  }
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? null : date
}

function selectUnit(diff: number, numeric: 'auto' | 'always'): [number, Intl.RelativeTimeFormatUnit] {
  const abs = Math.abs(diff)
  if (abs < 45 * SECOND) return [numeric === 'auto' ? 0 : Math.round(diff / SECOND), 'second']
  if (abs < 45 * MINUTE) return [Math.round(diff / MINUTE), 'minute']
  if (abs < 22 * HOUR) return [Math.round(diff / HOUR), 'hour']
  if (abs < 6.5 * DAY) return [Math.round(diff / DAY), 'day']
  if (abs < 26 * DAY) return [Math.round(diff / WEEK), 'week']
  if (abs < 320 * DAY) return [Math.round(diff / MONTH), 'month']
  return [Math.round(diff / YEAR), 'year']
}

/** Intervalo automático: atualiza mais vezes enquanto a data é recente. */
function autoInterval(diff: number): number {
  const abs = Math.abs(diff)
  if (abs < MINUTE) return 5 * SECOND
  if (abs < HOUR) return 30 * SECOND
  if (abs < DAY) return 5 * MINUTE
  return HOUR
}

/**
 * Data em formato relativo ("há 5 minutos", "em 3 dias") com `Intl` no idioma
 * do provider. Renderiza `<time dateTime>` e se atualiza sozinha.
 */
export const RelativeTime = forwardRef<HTMLTimeElement, RelativeTimeProps>(function RelativeTime(
  {
    date,
    format = 'auto',
    threshold = 7,
    updateInterval,
    numeric = 'auto',
    relativeStyle = 'long',
    absoluteFormat,
    showTitle = true,
    className,
    title,
    ...rest
  },
  ref,
) {
  const { locale } = useLocale()
  const [now, setNow] = useState(() => Date.now())
  const parsed = parseDate(date)
  const timestamp = parsed?.getTime() ?? NaN
  devWarning(parsed === null, `RelativeTime: data inválida (${String(date)}).`)

  const diff = timestamp - now
  const useRelative =
    format === 'relative' || (format === 'auto' && Math.abs(diff) < Math.max(0, threshold) * DAY)
  const interval = updateInterval === false ? null : (updateInterval ?? autoInterval(diff))
  const shouldUpdate = parsed !== null && interval !== null && interval > 0 && (useRelative || format === 'auto')

  useEffect(() => {
    if (!shouldUpdate) return
    const timer = setTimeout(() => setNow(Date.now()), interval!)
    return () => clearTimeout(timer)
  }, [shouldUpdate, interval, now])

  // Se a data mudar, recalcula a partir do instante atual.
  useEffect(() => {
    setNow(Date.now())
  }, [timestamp])

  let text: string | null = null
  if (parsed && useRelative) {
    const [value, unit] = selectUnit(diff, numeric)
    text = new Intl.RelativeTimeFormat(locale, { numeric, style: relativeStyle }).format(value, unit)
  } else if (parsed) {
    text = new Intl.DateTimeFormat(locale, absoluteFormat ?? { dateStyle: 'medium', timeStyle: 'short' }).format(parsed)
  }
  // Só as atualizações (não a primeira renderização) fazem o fade do texto.
  const [initialText] = useState(text)
  const updated = text !== null && text !== initialText

  if (!parsed || text === null) {
    return (
      <time ref={ref} className={cx('or-relative-time', className)} title={title} {...rest}>
        {String(date)}
      </time>
    )
  }

  const fullDate = showTitle
    ? new Intl.DateTimeFormat(locale, { dateStyle: 'full', timeStyle: 'short' }).format(parsed)
    : undefined

  return (
    <time
      ref={ref}
      className={cx('or-relative-time', className)}
      dateTime={parsed.toISOString()}
      title={title ?? fullDate}
      // o texto depende do relógio: servidor e cliente podem divergir por segundos
      suppressHydrationWarning
      {...rest}
    >
      {/* Texto novo remonta (key) com um fade sutil; sem aria-live, nada é anunciado. */}
      <span
        key={text}
        className={cx('or-relative-time__text', updated && 'or-relative-time__text--updated')}
        suppressHydrationWarning
      >
        {text}
      </span>
    </time>
  )
})
