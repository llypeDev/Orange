import { forwardRef, useMemo, type HTMLAttributes } from 'react'
import { useControllableState } from '../../hooks'
import { Icon } from '../../icons'
import { useLocale } from '../../providers'
import { cx } from '../../utils'
import './MonthPaginator.css'

/** Um mês do calendário. `month` vai de 0 (janeiro) a 11 (dezembro), como em `Date#getMonth()`. */
export interface YearMonth {
  year: number
  month: number
}

export type MonthPaginatorSize = 'sm' | 'md' | 'lg'

export interface MonthPaginatorProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  'onChange' | 'defaultValue'
> {
  /** Mês exibido (controlado). */
  value?: YearMonth
  /** Mês inicial (não controlado). Padrão: mês atual. */
  defaultValue?: YearMonth
  /** Chamado com o novo mês ao clicar em anterior/próximo. */
  onChange?: (value: YearMonth) => void
  /** Primeiro mês permitido — o botão "Mês anterior" fica indisponível nele. */
  min?: YearMonth
  /** Último mês permitido — o botão "Próximo mês" fica indisponível nele. */
  max?: YearMonth
  /** Altura dos botões: `sm` 32px, `md` 40px, `lg` 48px. */
  size?: MonthPaginatorSize
  /** Formato do nome do mês. Padrão: `long` ("Março de 2026"). */
  monthFormat?: 'long' | 'short'
  disabled?: boolean
}

const toIndex = ({ year, month }: YearMonth) => year * 12 + month
const fromIndex = (index: number): YearMonth => ({
  year: Math.floor(index / 12),
  month: ((index % 12) + 12) % 12,
})

function currentMonth(): YearMonth {
  const now = new Date()
  return { year: now.getFullYear(), month: now.getMonth() }
}

/**
 * Navegação entre meses ("‹ Março de 2026 ›") para filtrar extratos,
 * agendas e relatórios mensais. O rótulo central é anunciado a leitores
 * de tela a cada mudança.
 */
export const MonthPaginator = forwardRef<HTMLDivElement, MonthPaginatorProps>(
  function MonthPaginator(
    {
      value: valueProp,
      defaultValue,
      onChange,
      min,
      max,
      size = 'md',
      monthFormat = 'long',
      disabled = false,
      className,
      'aria-label': ariaLabel,
      ...rest
    },
    ref,
  ) {
    const { t, locale } = useLocale()
    const [value, setValue] = useControllableState<YearMonth>({
      value: valueProp,
      defaultValue: defaultValue ?? currentMonth(),
      onChange,
    })

    const formatter = useMemo(() => {
      try {
        return new Intl.DateTimeFormat(locale, { month: monthFormat, year: 'numeric' })
      } catch {
        return new Intl.DateTimeFormat('pt-BR', { month: monthFormat, year: 'numeric' })
      }
    }, [locale, monthFormat])

    const index = toIndex(value)
    const atMin = !!min && index <= toIndex(min)
    const atMax = !!max && index >= toIndex(max)
    const raw = formatter.format(new Date(value.year, value.month, 1))
    const label = raw.charAt(0).toLocaleUpperCase(locale) + raw.slice(1)

    const go = (delta: number) => {
      if (disabled || (delta < 0 && atMin) || (delta > 0 && atMax)) return
      setValue(fromIndex(index + delta))
    }

    const renderButton = (direction: 'previous' | 'next') => {
      const unavailable = disabled || (direction === 'previous' ? atMin : atMax)
      return (
        <button
          type="button"
          className={cx('or-month-paginator__button', `or-month-paginator__button--${direction}`)}
          aria-label={t(direction === 'previous' ? 'previousMonth' : 'nextMonth')}
          // aria-disabled mantém o foco no botão ao chegar no limite.
          aria-disabled={unavailable || undefined}
          onClick={() => go(direction === 'previous' ? -1 : 1)}
        >
          <Icon name={direction === 'previous' ? 'chevron-left' : 'chevron-right'} size="sm" />
        </button>
      )
    }

    return (
      <div
        ref={ref}
        role="group"
        aria-label={ariaLabel ?? t('monthNavigation')}
        className={cx('or-month-paginator', `or-month-paginator--${size}`, className)}
        data-disabled={disabled || undefined}
        {...rest}
      >
        {renderButton('previous')}
        <span className="or-month-paginator__label" aria-live="polite" aria-atomic="true">
          <time
            dateTime={`${String(value.year).padStart(4, '0')}-${String(value.month + 1).padStart(2, '0')}`}
          >
            {label}
          </time>
        </span>
        {renderButton('next')}
      </div>
    )
  },
)
