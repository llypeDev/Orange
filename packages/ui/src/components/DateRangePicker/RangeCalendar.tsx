import {
  forwardRef,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type HTMLAttributes,
  type KeyboardEvent,
} from 'react'
import { useControllableState, useId, useMediaQuery } from '../../hooks'
import { Icon } from '../../icons'
import { useLocale } from '../../providers'
import { cx, mergeRefs } from '../../utils'
import type { CalendarWeekDay } from '../DatePicker'
import {
  addMonths,
  capitalize,
  clampDate,
  compareDay,
  daysInMonth,
  getMonthGrid,
  isSameDay,
  startOfDay,
  toISODate,
} from '../DatePicker/dateUtils'
import {
  dayKey,
  differenceInDays,
  getKeyboardTarget,
  isDateUnavailable,
  startOfMonth,
  type CompleteDateRange,
  type DateRange,
} from './rangeUtils'
import '../DatePicker/Calendar.css'
import './RangeCalendar.css'

export interface RangeCalendarProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  'onChange' | 'defaultValue' | 'children'
> {
  /** Período selecionado (controlado). `null` = nenhum. */
  value?: DateRange | null
  /** Período inicial (não controlado). */
  defaultValue?: DateRange | null
  /**
   * Chamado quando o período fica completo: o 1º clique/Enter marca o início
   * e o 2º, o fim (se vier antes do início, as datas são trocadas).
   */
  onChange?: (range: CompleteDateRange) => void
  /** Mês exibido inicialmente quando não há valor. Padrão: mês atual. */
  defaultMonth?: Date
  /**
   * Meses lado a lado. Com `2`, telas estreitas (< 768px) continuam mostrando
   * um mês só — sem rolagem horizontal.
   */
  visibleMonths?: 1 | 2
  /** Primeira data selecionável. */
  min?: Date
  /** Última data selecionável. */
  max?: Date
  /** Desabilita datas específicas (feriados, fins de semana…). */
  isDateDisabled?: (date: Date) => boolean
  /**
   * Comprimento mínimo em dias entre início e fim (`fim − início`, como
   * noites). Depois de escolher o início, datas mais próximas ficam desabilitadas.
   */
  minLength?: number
  /** Comprimento máximo em dias entre início e fim. */
  maxLength?: number
  /** Primeiro dia da semana: 0 = domingo (padrão), 1 = segunda… */
  weekStartsOn?: CalendarWeekDay
  /** Foca o dia ativo ao montar. */
  autoFocus?: boolean
}

interface RangeView {
  /** Dia ativo (roving tabindex). */
  date: Date
  /** Primeiro mês visível. */
  first: Date
  /** Direção da última troca de mês (desliza a grade e o título). */
  direction: 'next' | 'prev' | null
  /** Primeiro mês visível antes da última troca (títulos que saem no crossfade). */
  from: Date | null
}

const monthIndex = (date: Date) => date.getFullYear() * 12 + date.getMonth()
const monthKey = (date: Date) => `${date.getFullYear()}-${date.getMonth()}`
const rangeKey = (start: number | null, end: number | null) => `${start}|${end}`

/** Primeiro mês visível ajustado para que `date` apareça entre os `count` meses. */
function fitView(first: Date, date: Date, count: number): Date {
  const diff = monthIndex(date) - monthIndex(first)
  if (diff < 0) return startOfMonth(date)
  if (diff >= count) return addMonths(startOfMonth(date), -(count - 1))
  return first
}

const isBetween = (date: Date, start: Date, end: Date) =>
  compareDay(date, start) >= 0 && compareDay(date, end) <= 0

/**
 * Calendário de período: o primeiro clique (ou Enter) marca o início, o
 * segundo marca o fim, com prévia da faixa ao passar o mouse ou mover o foco.
 * Mesma navegação por teclado do `Calendar` (padrão "grid" do WAI-ARIA).
 */
export const RangeCalendar = forwardRef<HTMLDivElement, RangeCalendarProps>(
  function RangeCalendar(
    {
      value: valueProp,
      defaultValue = null,
      onChange,
      defaultMonth,
      visibleMonths = 1,
      min,
      max,
      isDateDisabled,
      minLength,
      maxLength,
      weekStartsOn = 0,
      autoFocus = false,
      className,
      ...rest
    },
    ref,
  ) {
    const { t, locale } = useLocale()
    const baseId = useId('or-range-calendar')
    const startDescriptionId = `${baseId}-start`
    const endDescriptionId = `${baseId}-end`
    const rootRef = useRef<HTMLDivElement>(null)
    const shouldFocusRef = useRef(autoFocus)
    // Último período emitido por este calendário: não reposiciona a visão no eco do valor.
    const emittedRef = useRef<string | undefined>(undefined)

    const wide = useMediaQuery('(min-width: 48rem)')
    const monthCount = visibleMonths === 2 && wide ? 2 : 1

    const [value, setValue] = useControllableState<DateRange | null>({
      value: valueProp,
      defaultValue,
      onChange: onChange as ((range: DateRange | null) => void) | undefined,
    })

    const today = startOfDay(new Date())
    // Início já escolhido, aguardando o fim. Um valor parcial (só início,
    // ex.: digitado no DateRangePicker) já abre aguardando a data final.
    const [anchor, setAnchor] = useState<Date | null>(() =>
      value?.start && !value.end ? startOfDay(value.start) : null,
    )
    const [hovered, setHovered] = useState<Date | null>(null)
    // Ponta escolhida nesta sessão: ganha o "pop" ao ser marcada.
    const [popped, setPopped] = useState<string | null>(null)
    const [announcement, setAnnouncement] = useState('')
    const [view, setView] = useState<RangeView>(() => {
      const date = clampDate(
        startOfDay(value?.start ?? value?.end ?? defaultMonth ?? today),
        min,
        max,
      )
      return { date, first: startOfMonth(date), direction: null, from: null }
    })
    const focusedDate = view.date
    const first = fitView(view.first, view.date, monthCount)

    const updateView = useCallback(
      (next: Date, firstOverride?: Date) =>
        setView((prev) => {
          const prevFirst = fitView(prev.first, prev.date, monthCount)
          const nextFirst = fitView(firstOverride ?? prevFirst, next, monthCount)
          const diff = monthIndex(nextFirst) - monthIndex(prevFirst)
          if (diff === 0) {
            if (
              prev.date.getTime() === next.getTime() &&
              prev.first.getTime() === nextFirst.getTime()
            )
              return prev
            return { ...prev, date: next, first: nextFirst }
          }
          return {
            date: next,
            first: nextFirst,
            direction: diff > 0 ? 'next' : 'prev',
            from: prevFirst,
          }
        }),
      [monthCount],
    )

    // Valor alterado por fora (digitado no campo, atalho, controlado): acompanha.
    const startKey = dayKey(value?.start)
    const endKey = dayKey(value?.end)
    const valueKey = rangeKey(startKey, endKey)
    useEffect(() => {
      if (emittedRef.current === valueKey) {
        emittedRef.current = undefined
        return
      }
      emittedRef.current = undefined
      const nextAnchor = startKey !== null && endKey === null ? startKey : null
      setAnchor((prev) =>
        dayKey(prev) === nextAnchor ? prev : nextAnchor === null ? null : new Date(nextAnchor),
      )
      setHovered(null)
      const target = startKey ?? endKey
      if (target === null) return
      setPopped(null)
      updateView(clampDate(new Date(target), min, max))
      // min/max entram só no clamp do momento da troca.
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [valueKey, updateView])

    const formatters = useMemo(() => {
      const make = (options: Intl.DateTimeFormatOptions) => {
        try {
          return new Intl.DateTimeFormat(locale, options)
        } catch {
          return new Intl.DateTimeFormat('pt-BR', options)
        }
      }
      return {
        monthYear: make({ month: 'long', year: 'numeric' }),
        day: make({ weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }),
        long: make({ day: 'numeric', month: 'long', year: 'numeric' }),
        weekdayShort: make({ weekday: 'short' }),
        weekdayLong: make({ weekday: 'long' }),
      }
    }, [locale])

    const isUnavailable = (date: Date) => isDateUnavailable(date, { min, max, isDateDisabled })
    /** Com o início escolhido, o fim precisa respeitar minLength/maxLength. */
    const breaksLength = (date: Date) => {
      if (!anchor) return false
      const length = Math.abs(differenceInDays(date, anchor))
      return (
        (minLength !== undefined && length < minLength) ||
        (maxLength !== undefined && length > maxLength)
      )
    }
    const isDisabled = (date: Date) =>
      isUnavailable(date) || (breaksLength(date) && !isSameDay(date, anchor))

    // Foca a célula ativa depois de navegar pelo teclado.
    useEffect(() => {
      if (!shouldFocusRef.current) return
      shouldFocusRef.current = false
      const cell = rootRef.current?.querySelector<HTMLElement>(
        `[data-date="${toISODate(focusedDate)}"]`,
      )
      cell?.focus({ preventScroll: true })
    }, [focusedDate])

    const months = Array.from({ length: monthCount }, (_, i) => addMonths(first, i))
    const lastMonth = months[months.length - 1]
    const isVisible = (date: Date) =>
      monthIndex(date) >= monthIndex(first) && monthIndex(date) <= monthIndex(lastMonth)

    const moveFocus = (next: Date, focus = true, firstOverride?: Date) => {
      const target = clampDate(startOfDay(next), min, max)
      shouldFocusRef.current = focus
      if (firstOverride || !isVisible(target)) setPopped(null)
      updateView(target, firstOverride)
    }

    const select = (date: Date) => {
      const day = startOfDay(date)
      if (isUnavailable(day)) return
      if (!anchor) {
        setAnchor(day)
        setHovered(null)
        setPopped(toISODate(day))
        moveFocus(day, false)
        setAnnouncement(t('dateRangeStartSelected', { date: formatters.long.format(day) }))
        return
      }
      if (breaksLength(day)) return
      const [start, end] = compareDay(day, anchor) < 0 ? [day, anchor] : [anchor, day]
      setAnchor(null)
      setHovered(null)
      setPopped(toISODate(day))
      moveFocus(day, false)
      emittedRef.current = rangeKey(start.getTime(), end.getTime())
      setValue({ start, end })
      setAnnouncement(
        t('dateRangeSelected', {
          start: formatters.long.format(start),
          end: formatters.long.format(end),
        }),
      )
    }

    // Um mês é navegável se tiver ao menos um dia dentro de [min, max].
    const canShowMonth = (target: Date) => {
      const firstDay = new Date(target.getFullYear(), target.getMonth(), 1)
      const lastDay = new Date(
        target.getFullYear(),
        target.getMonth(),
        daysInMonth(target.getFullYear(), target.getMonth()),
      )
      return !(min && lastDay < startOfDay(min)) && !(max && firstDay > startOfDay(max))
    }

    const navigation = [
      { key: 'prev-year', label: t('previousYear'), icon: 'chevrons-left' as const, shift: -12 },
      { key: 'prev-month', label: t('previousMonth'), icon: 'chevron-left' as const, shift: -1 },
      { key: 'next-month', label: t('nextMonth'), icon: 'chevron-right' as const, shift: 1 },
      { key: 'next-year', label: t('nextYear'), icon: 'chevrons-right' as const, shift: 12 },
    ].map((item) => ({
      ...item,
      disabled: !canShowMonth(addMonths(item.shift < 0 ? first : lastMonth, item.shift)),
    }))

    const renderNavButton = (item: (typeof navigation)[number]) => (
      <button
        key={item.key}
        type="button"
        className={cx('or-calendar__nav', `or-calendar__nav--${item.key}`)}
        aria-label={item.label}
        aria-disabled={item.disabled || undefined}
        onClick={() => {
          if (!item.disabled)
            moveFocus(addMonths(focusedDate, item.shift), false, addMonths(first, item.shift))
        }}
      >
        <Icon name={item.icon} size="sm" />
      </button>
    )

    const onDayKeyDown = (event: KeyboardEvent<HTMLTableCellElement>) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault()
        select(focusedDate)
        return
      }
      if (event.key === 'Escape' && anchor) {
        // Cancela o início pendente (no DateRangePicker, Escape fecha o diálogo).
        event.preventDefault()
        event.stopPropagation()
        setAnchor(null)
        setHovered(null)
        setAnnouncement('')
        return
      }
      const next = getKeyboardTarget(event.key, event.shiftKey, focusedDate, weekStartsOn)
      if (!next) return
      event.preventDefault()
      setHovered(null)
      moveFocus(next)
    }

    // Pontas e faixa exibidas: prévia (início pendente → dia sob o mouse/foco)
    // ou o período confirmado.
    const previewTarget = anchor ? (hovered ?? focusedDate) : null
    const previewEdge =
      anchor && previewTarget && !isSameDay(previewTarget, anchor) && !isDisabled(previewTarget)
        ? previewTarget
        : null
    let rangeStart: Date | null
    let rangeEnd: Date | null
    if (anchor) {
      const other = previewEdge ?? anchor
      ;[rangeStart, rangeEnd] = compareDay(other, anchor) < 0 ? [other, anchor] : [anchor, other]
    } else {
      rangeStart = value?.start ?? null
      rangeEnd = value?.end ?? null
      if (rangeStart && rangeEnd && compareDay(rangeEnd, rangeStart) < 0)
        [rangeStart, rangeEnd] = [rangeEnd, rangeStart]
    }
    const previewing = !!anchor
    const backward = !!anchor && !!previewEdge && compareDay(previewEdge, anchor) < 0
    const weekdays = getMonthGrid(first.getFullYear(), first.getMonth(), weekStartsOn)[0]
    const headingIds = months.map((_, i) => `${baseId}-heading-${i}`)
    const direction = view.direction

    const renderDay = (date: Date) => {
      const iso = toISODate(date)
      const inBand = !!rangeStart && !!rangeEnd && isBetween(date, rangeStart, rangeEnd)
      const isAnchor = isSameDay(date, anchor)
      const isPreviewEdge = isSameDay(date, previewEdge)
      // Pontas preenchidas: o início pendente ou as datas confirmadas.
      const filled = previewing
        ? isAnchor
        : isSameDay(date, rangeStart) || isSameDay(date, rangeEnd)
      const isStart = filled && isSameDay(date, rangeStart)
      const isEnd = filled && isSameDay(date, rangeEnd) && !(previewing && !previewEdge)
      const selected = previewing ? isAnchor : inBand || filled
      const describedBy = previewing
        ? isAnchor
          ? startDescriptionId
          : undefined
        : [
            isSameDay(date, value?.start) && startDescriptionId,
            isSameDay(date, value?.end) && endDescriptionId,
          ]
            .filter(Boolean)
            .join(' ') || undefined
      const focused = isSameDay(date, focusedDate)
      const disabled = isDisabled(date)
      const isToday = isSameDay(date, today)
      return (
        <td
          key={iso}
          role="gridcell"
          data-date={iso}
          tabIndex={focused ? 0 : -1}
          aria-selected={selected}
          aria-disabled={disabled || undefined}
          aria-current={isToday ? 'date' : undefined}
          aria-label={formatters.day.format(date)}
          aria-describedby={describedBy}
          className={cx(
            'or-calendar__day',
            'or-range-calendar__day',
            isToday && 'or-calendar__day--today',
            disabled && 'or-calendar__day--disabled',
            inBand && 'or-range-calendar__day--in-range',
            inBand && previewing && 'or-range-calendar__day--preview',
            isStart && 'or-range-calendar__day--start',
            isEnd && 'or-range-calendar__day--end',
            isPreviewEdge && 'or-range-calendar__day--preview-edge',
          )}
          onClick={() => select(date)}
          onKeyDown={onDayKeyDown}
          onFocus={() => {
            // Foco vindo de fora do teclado da grade (clique, script): vira o dia ativo.
            if (!focused) moveFocus(date, false)
          }}
          onMouseEnter={() => {
            if (anchor) setHovered(date)
          }}
        >
          <span
            className={cx(
              'or-range-calendar__mark',
              filled && popped === iso && 'or-range-calendar__mark--pop',
            )}
            aria-hidden="true"
          >
            {date.getDate()}
          </span>
        </td>
      )
    }

    const renderMonth = (month: Date, index: number) => {
      const key = monthKey(month)
      const from = view.from && direction ? addMonths(view.from, index) : null
      const weeks = getMonthGrid(month.getFullYear(), month.getMonth(), weekStartsOn)
      const isFirst = index === 0
      const isLast = index === months.length - 1
      return (
        <div key={index} className="or-range-calendar__month">
          <div className="or-calendar__header">
            {isFirst ? (
              <div className="or-calendar__nav-group">
                {navigation.slice(0, 2).map(renderNavButton)}
              </div>
            ) : (
              <span className="or-range-calendar__nav-spacer" />
            )}
            <div
              id={headingIds[index]}
              className="or-calendar__title"
              aria-live="polite"
              aria-atomic="true"
            >
              {from && (
                <span
                  key={`out-${monthKey(from)}-${key}`}
                  className={cx(
                    'or-calendar__title-text',
                    `or-calendar__title-text--out-${direction}`,
                  )}
                  aria-hidden="true"
                >
                  {capitalize(formatters.monthYear.format(from), locale)}
                </span>
              )}
              <span
                key={`in-${key}`}
                className={cx(
                  'or-calendar__title-text',
                  direction && `or-calendar__title-text--in-${direction}`,
                )}
              >
                {capitalize(formatters.monthYear.format(month), locale)}
              </span>
            </div>
            {isLast ? (
              <div className="or-calendar__nav-group">
                {navigation.slice(2).map(renderNavButton)}
              </div>
            ) : (
              <span className="or-range-calendar__nav-spacer" />
            )}
          </div>

          <table
            role="grid"
            aria-labelledby={headingIds[index]}
            aria-multiselectable="true"
            className="or-calendar__grid"
          >
            <thead>
              <tr role="row">
                {weekdays.map((day) => {
                  const long = formatters.weekdayLong.format(day)
                  return (
                    <th
                      key={day.getDay()}
                      scope="col"
                      role="columnheader"
                      abbr={long}
                      className="or-calendar__weekday"
                    >
                      <span aria-hidden="true">
                        {formatters.weekdayShort.format(day).replace(/\.$/, '')}
                      </span>
                      <span className="or-visually-hidden">{long}</span>
                    </th>
                  )
                })}
              </tr>
            </thead>
            <tbody
              key={key}
              className={cx('or-calendar__body', direction && `or-calendar__body--${direction}`)}
            >
              {weeks.map((week) => (
                <tr key={toISODate(week[0])} role="row">
                  {week.map((date) =>
                    date.getMonth() === month.getMonth() ? (
                      renderDay(date)
                    ) : (
                      // Dias de outros meses ficam vazios: cada data aparece uma vez só.
                      <td key={toISODate(date)} className="or-range-calendar__blank" />
                    ),
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )
    }

    return (
      <div
        ref={mergeRefs(rootRef, ref)}
        role="group"
        aria-labelledby={rest['aria-label'] ? undefined : headingIds.join(' ')}
        className={cx('or-calendar', 'or-range-calendar', className)}
        data-months={monthCount}
        data-preview={backward ? 'backward' : previewing ? 'forward' : undefined}
        {...rest}
      >
        <div className="or-range-calendar__months" onMouseLeave={() => setHovered(null)}>
          {months.map(renderMonth)}
        </div>
        <span id={startDescriptionId} hidden>
          {t('dateRangeStartMarker')}
        </span>
        <span id={endDescriptionId} hidden>
          {t('dateRangeEndMarker')}
        </span>
        <div role="status" className="or-visually-hidden">
          {announcement}
        </div>
      </div>
    )
  },
)
