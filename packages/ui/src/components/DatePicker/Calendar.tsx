import {
  forwardRef,
  useEffect,
  useMemo,
  useRef,
  useState,
  type HTMLAttributes,
  type KeyboardEvent,
} from 'react'
import { useControllableState, useId } from '../../hooks'
import { Icon } from '../../icons'
import { useLocale } from '../../providers'
import { cx } from '../../utils'
import {
  addDays,
  addMonths,
  addYears,
  capitalize,
  clampDate,
  daysInMonth,
  endOfWeek,
  getMonthGrid,
  isOutOfRange,
  isSameDay,
  isSameMonth,
  startOfDay,
  startOfWeek,
  toISODate,
  type WeekDay,
} from './dateUtils'
import './Calendar.css'

export type CalendarWeekDay = WeekDay

export interface CalendarProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  'onChange' | 'defaultValue' | 'children'
> {
  /** Data selecionada (controlado). `null` = nenhuma. */
  value?: Date | null
  /** Data selecionada inicial (não controlado). */
  defaultValue?: Date | null
  /** Chamado quando o usuário escolhe um dia (clique, Enter ou Espaço). */
  onChange?: (date: Date) => void
  /** Mês exibido inicialmente quando não há valor. Padrão: mês atual. */
  defaultMonth?: Date
  /** Primeira data selecionável. */
  min?: Date
  /** Última data selecionável. */
  max?: Date
  /** Desabilita datas específicas (feriados, fins de semana…). */
  isDateDisabled?: (date: Date) => boolean
  /** Primeiro dia da semana: 0 = domingo (padrão), 1 = segunda… */
  weekStartsOn?: CalendarWeekDay
  /** Mostra o botão "Hoje" no rodapé. */
  showTodayButton?: boolean
  /** Foca o dia ativo ao montar. */
  autoFocus?: boolean
}

/** Props internas usadas pelo DatePicker (não fazem parte da API pública). */
interface CalendarInternalProps {
  /** Id do título "mês de ano" — o diálogo do DatePicker usa como rótulo. */
  headingId?: string
}

/**
 * Grade mensal de datas com navegação completa por teclado (padrão "grid"
 * do WAI-ARIA). Use sozinha em painéis de agenda ou dentro do `DatePicker`.
 */
export const Calendar = forwardRef<HTMLDivElement, CalendarProps & CalendarInternalProps>(
  function Calendar(
    {
      value: valueProp,
      defaultValue = null,
      onChange,
      defaultMonth,
      min,
      max,
      isDateDisabled,
      weekStartsOn = 0,
      showTodayButton = false,
      autoFocus = false,
      headingId: headingIdProp,
      className,
      ...rest
    },
    ref,
  ) {
    const { t, locale } = useLocale()
    const generatedId = useId('or-calendar')
    const headingId = headingIdProp ?? `${generatedId}-heading`
    const gridRef = useRef<HTMLTableElement>(null)
    const shouldFocusRef = useRef(autoFocus)

    const [value, setValue] = useControllableState<Date | null>({
      value: valueProp,
      defaultValue,
      onChange: onChange as ((date: Date | null) => void) | undefined,
    })

    const today = startOfDay(new Date())
    const [focusedDate, setFocusedDate] = useState<Date>(() =>
      clampDate(startOfDay(value ?? defaultMonth ?? today), min, max),
    )

    // Quando o valor muda por fora (ex.: digitado no campo), acompanha o mês.
    const valueKey = value ? startOfDay(value).getTime() : null
    useEffect(() => {
      if (valueKey === null) return
      setFocusedDate((prev) => (prev.getTime() === valueKey ? prev : new Date(valueKey)))
    }, [valueKey])

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
        weekdayShort: make({ weekday: 'short' }),
        weekdayLong: make({ weekday: 'long' }),
      }
    }, [locale])

    const isDisabled = (date: Date) => isOutOfRange(date, min, max) || !!isDateDisabled?.(date)

    const year = focusedDate.getFullYear()
    const month = focusedDate.getMonth()
    const weeks = useMemo(
      () => getMonthGrid(year, month, weekStartsOn),
      [year, month, weekStartsOn],
    )
    const weekdays = weeks[0]

    // Foca a célula ativa depois de navegar pelo teclado.
    useEffect(() => {
      if (!shouldFocusRef.current) return
      shouldFocusRef.current = false
      const cell = gridRef.current?.querySelector<HTMLElement>(
        `[data-date="${toISODate(focusedDate)}"]`,
      )
      cell?.focus({ preventScroll: true })
    }, [focusedDate])

    const moveFocus = (next: Date, focus = true) => {
      shouldFocusRef.current = focus
      setFocusedDate(clampDate(startOfDay(next), min, max))
    }

    const select = (date: Date) => {
      if (isDisabled(date)) return
      moveFocus(date, false)
      // Sempre um novo objeto Date: o onChange dispara mesmo ao reescolher o dia.
      setValue(startOfDay(date))
    }

    // Um mês é navegável se tiver ao menos um dia dentro de [min, max].
    const canShowMonth = (target: Date) => {
      const first = new Date(target.getFullYear(), target.getMonth(), 1)
      const last = new Date(
        target.getFullYear(),
        target.getMonth(),
        daysInMonth(target.getFullYear(), target.getMonth()),
      )
      return !(min && last < startOfDay(min)) && !(max && first > startOfDay(max))
    }

    const navigation = [
      {
        key: 'prev-year',
        label: t('previousYear'),
        icon: 'chevrons-left' as const,
        target: addYears(focusedDate, -1),
      },
      {
        key: 'prev-month',
        label: t('previousMonth'),
        icon: 'chevron-left' as const,
        target: addMonths(focusedDate, -1),
      },
      {
        key: 'next-month',
        label: t('nextMonth'),
        icon: 'chevron-right' as const,
        target: addMonths(focusedDate, 1),
      },
      {
        key: 'next-year',
        label: t('nextYear'),
        icon: 'chevrons-right' as const,
        target: addYears(focusedDate, 1),
      },
    ].map((item) => ({ ...item, disabled: !canShowMonth(item.target) }))

    const renderNavButton = (item: (typeof navigation)[number]) => (
      <button
        key={item.key}
        type="button"
        className={cx('or-calendar__nav', `or-calendar__nav--${item.key}`)}
        aria-label={item.label}
        aria-disabled={item.disabled || undefined}
        onClick={() => {
          if (!item.disabled) moveFocus(item.target, false)
        }}
      >
        <Icon name={item.icon} size="sm" />
      </button>
    )

    const onDayKeyDown = (event: KeyboardEvent<HTMLTableCellElement>) => {
      let next: Date | null = null
      switch (event.key) {
        case 'ArrowLeft':
          next = addDays(focusedDate, -1)
          break
        case 'ArrowRight':
          next = addDays(focusedDate, 1)
          break
        case 'ArrowUp':
          next = addDays(focusedDate, -7)
          break
        case 'ArrowDown':
          next = addDays(focusedDate, 7)
          break
        case 'Home':
          next = startOfWeek(focusedDate, weekStartsOn)
          break
        case 'End':
          next = endOfWeek(focusedDate, weekStartsOn)
          break
        case 'PageUp':
          next = event.shiftKey ? addYears(focusedDate, -1) : addMonths(focusedDate, -1)
          break
        case 'PageDown':
          next = event.shiftKey ? addYears(focusedDate, 1) : addMonths(focusedDate, 1)
          break
        case 'Enter':
        case ' ':
          event.preventDefault()
          select(focusedDate)
          return
        default:
          return
      }
      event.preventDefault()
      moveFocus(next)
    }

    const todayDisabled = isDisabled(today)
    const title = capitalize(formatters.monthYear.format(focusedDate), locale)

    return (
      <div
        ref={ref}
        role="group"
        aria-labelledby={headingId}
        className={cx('or-calendar', className)}
        {...rest}
      >
        <div className="or-calendar__header">
          <div className="or-calendar__nav-group">
            {navigation.slice(0, 2).map(renderNavButton)}
          </div>
          <div id={headingId} className="or-calendar__title" aria-live="polite" aria-atomic="true">
            {title}
          </div>
          <div className="or-calendar__nav-group">{navigation.slice(2).map(renderNavButton)}</div>
        </div>

        <table ref={gridRef} role="grid" aria-labelledby={headingId} className="or-calendar__grid">
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
          <tbody>
            {weeks.map((week) => (
              <tr key={toISODate(week[0])} role="row">
                {week.map((date) => {
                  const iso = toISODate(date)
                  const selected = isSameDay(date, value)
                  const focused = isSameDay(date, focusedDate)
                  const disabled = isDisabled(date)
                  const outside = !isSameMonth(date, focusedDate)
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
                      className={cx(
                        'or-calendar__day',
                        selected && 'or-calendar__day--selected',
                        isToday && 'or-calendar__day--today',
                        outside && 'or-calendar__day--outside',
                        disabled && 'or-calendar__day--disabled',
                      )}
                      onClick={() => select(date)}
                      onKeyDown={onDayKeyDown}
                    >
                      <span aria-hidden="true">{date.getDate()}</span>
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>

        {showTodayButton && (
          <div className="or-calendar__footer">
            <button
              type="button"
              className="or-calendar__today"
              aria-disabled={todayDisabled || undefined}
              onClick={() => select(today)}
            >
              {t('today')}
            </button>
          </div>
        )}
      </div>
    )
  },
)
