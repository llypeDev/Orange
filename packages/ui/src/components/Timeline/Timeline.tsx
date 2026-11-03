import {
  createContext,
  forwardRef,
  useContext,
  useMemo,
  type ElementType,
  type LiHTMLAttributes,
  type OlHTMLAttributes,
  type ReactNode,
} from 'react'
import { useLocale } from '../../providers'
import { cx } from '../../utils'
import './Timeline.css'

export type TimelineVariant = 'default' | 'alternate'
export type TimelineTone = 'neutral' | 'accent' | 'success' | 'warning' | 'danger' | 'info'
export type TimelineDate = Date | string | number

export interface TimelineProps extends OlHTMLAttributes<HTMLOListElement> {
  /**
   * `default`: linha à esquerda. `alternate`: eventos alternam dos dois lados
   * da linha (vira `default` em contêineres estreitos).
   */
  variant?: TimelineVariant
  /** Formato das datas dos itens (`Intl.DateTimeFormat`). Padrão: `{ dateStyle: 'medium' }`. */
  dateFormat?: Intl.DateTimeFormatOptions
}

interface TimelineContextValue {
  dateFormat?: Intl.DateTimeFormatOptions
}

const TimelineContext = createContext<TimelineContextValue>({})

/**
 * Sequência cronológica de eventos — histórico de um pedido, changelog,
 * etapas de um processo. Renderiza um `<ol>` com datas em `<time>`.
 */
export const Timeline = forwardRef<HTMLOListElement, TimelineProps>(function Timeline(
  { variant = 'default', dateFormat, className, children, ...rest },
  ref,
) {
  const value = useMemo(() => ({ dateFormat }), [dateFormat])
  return (
    <TimelineContext.Provider value={value}>
      {/* `list-style: none` remove a semântica de lista no Safari/VoiceOver; o papel explícito a restaura. */}
      {/* eslint-disable-next-line jsx-a11y/no-redundant-roles */}
      <ol
        ref={ref}
        role="list"
        className={cx('or-timeline', `or-timeline--${variant}`, className)}
        {...rest}
      >
        {children}
      </ol>
    </TimelineContext.Provider>
  )
})

export interface TimelineItemProps extends Omit<LiHTMLAttributes<HTMLLIElement>, 'title'> {
  /** Título do evento. */
  title: ReactNode
  /** Texto de apoio abaixo do título. */
  description?: ReactNode
  /**
   * Data do evento. Strings `AAAA-MM-DD` são tratadas como data local (sem
   * deslocamento de fuso). Vira `<time dateTime>` formatado no idioma do provider.
   */
  date?: TimelineDate
  /** Texto exibido no lugar da data formatada (ex.: "Agora", "Previsto"). */
  dateLabel?: ReactNode
  /** Formato desta data; sobrescreve o `dateFormat` da `Timeline`. */
  dateFormat?: Intl.DateTimeFormatOptions
  /** Cor do marcador quadrado. Padrão: `neutral` (contorno). */
  tone?: TimelineTone
  /** Marca o evento atual: destaque visual e `aria-current="step"`. */
  current?: boolean
  /** Ícone dentro do marcador (marcador maior). */
  icon?: ReactNode
  /** Elemento do título. Padrão: `p`. Use `h3`/`h4` se os eventos forem seções. */
  titleAs?: ElementType
}

const DATE_ONLY = /^(\d{4})-(\d{2})(?:-(\d{2}))?$/

function parseDate(value: TimelineDate): { date: Date; dateTime: string } | null {
  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : { date: value, dateTime: value.toISOString() }
  }
  if (typeof value === 'string') {
    const match = DATE_ONLY.exec(value.trim())
    if (match) {
      const [, y, m, d] = match
      return { date: new Date(Number(y), Number(m) - 1, d ? Number(d) : 1), dateTime: value.trim() }
    }
  }
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? null : { date, dateTime: date.toISOString() }
}

/** Evento de uma `Timeline`. */
export const TimelineItem = forwardRef<HTMLLIElement, TimelineItemProps>(function TimelineItem(
  {
    title,
    description,
    date,
    dateLabel,
    dateFormat,
    tone = 'neutral',
    current = false,
    icon,
    titleAs: Title = 'p',
    className,
    children,
    ...rest
  },
  ref,
) {
  const { locale } = useLocale()
  const context = useContext(TimelineContext)
  const parsed = date !== undefined ? parseDate(date) : null
  const format = dateFormat ?? context.dateFormat ?? { dateStyle: 'medium' }
  let formatted: ReactNode = dateLabel
  if (formatted === undefined && parsed) {
    try {
      formatted = new Intl.DateTimeFormat(locale, format).format(parsed.date)
    } catch {
      formatted = parsed.date.toLocaleDateString()
    }
  }
  const hasDate = formatted !== undefined && formatted !== null

  return (
    <li
      ref={ref}
      className={cx(
        'or-timeline__item',
        `or-timeline__item--${tone}`,
        current && 'or-timeline__item--current',
        icon != null && icon !== false && 'or-timeline__item--with-icon',
        className,
      )}
      aria-current={current ? 'step' : undefined}
      {...rest}
    >
      <span className="or-timeline__marker" aria-hidden="true">
        {icon}
      </span>
      {hasDate &&
        (parsed ? (
          <time className="or-timeline__date" dateTime={parsed.dateTime}>
            {formatted}
          </time>
        ) : (
          <span className="or-timeline__date">{formatted}</span>
        ))}
      <div className="or-timeline__body">
        <Title className="or-timeline__title">{title}</Title>
        {description !== undefined && description !== null && (
          <div className="or-timeline__description">{description}</div>
        )}
        {children}
      </div>
    </li>
  )
})
