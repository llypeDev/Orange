import { forwardRef, type HTMLAttributes, type ReactNode } from 'react'
import { useId } from '../../hooks'
import { useLocale } from '../../providers'
import { clamp, cx, devWarning } from '../../utils'
import { displayPercent } from './percent'
import './ProgressBar.css'

export type ProgressBarTone = 'accent' | 'neutral' | 'info' | 'success' | 'warning' | 'danger'
export type ProgressBarSize = 'sm' | 'md'

export interface ProgressValueInfo {
  min: number
  max: number
  /** Percentual concluído, de 0 a 100. */
  percent: number
}

export interface ProgressBarProps extends HTMLAttributes<HTMLDivElement> {
  /** Valor atual. Sem valor (`undefined`/`null`), a barra fica indeterminada. */
  value?: number | null
  /** Valor mínimo. */
  min?: number
  /** Valor máximo. */
  max?: number
  /** Rótulo visível, associado à barra via `aria-labelledby`. */
  label?: ReactNode
  /** Texto de apoio abaixo da barra, associado via `aria-describedby`. */
  description?: ReactNode
  /** Mostra o valor formatado ao lado do rótulo (barras determinadas). */
  showValue?: boolean
  /**
   * Formata o valor exibido e anunciado (`aria-valuetext`).
   * Padrão: percentual no idioma do provider (ex.: "45%").
   */
  formatValue?: (value: number, info: ProgressValueInfo) => string
  /** Cor da barra. */
  tone?: ProgressBarTone
  /** Espessura: `sm` 4px, `md` 8px. */
  size?: ProgressBarSize
}

/**
 * Barra de progresso linear para tarefas com duração mensurável (upload,
 * importação, etapas). Sem `value`, indica atividade de duração desconhecida.
 */
export const ProgressBar = forwardRef<HTMLDivElement, ProgressBarProps>(function ProgressBar(
  {
    value,
    min = 0,
    max = 100,
    label,
    description,
    showValue = true,
    formatValue,
    tone = 'accent',
    size = 'md',
    className,
    id,
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledby,
    'aria-describedby': ariaDescribedby,
    ...rest
  },
  ref,
) {
  const { locale } = useLocale()
  const baseId = useId('or-progress', id)
  const labelId = `${baseId}-label`
  const descriptionId = `${baseId}-description`

  devWarning(
    !label && !ariaLabel && !ariaLabelledby,
    'ProgressBar precisa de `label`, `aria-label` ou `aria-labelledby`.',
  )

  const indeterminate = value === undefined || value === null || Number.isNaN(value)
  const current = indeterminate ? min : clamp(value, min, max)
  const percent = max > min ? ((current - min) / (max - min)) * 100 : 0
  const valueText = indeterminate
    ? undefined
    : formatValue
      ? formatValue(current, { min, max, percent })
      : new Intl.NumberFormat(locale, { style: 'percent', maximumFractionDigits: 0 }).format(
          displayPercent(current, min, max) / 100,
        )

  const labelledBy =
    [ariaLabelledby, label ? labelId : undefined].filter(Boolean).join(' ') || undefined
  const describedBy =
    [ariaDescribedby, description ? descriptionId : undefined].filter(Boolean).join(' ') ||
    undefined

  return (
    <div
      ref={ref}
      id={id}
      className={cx(
        'or-progress-bar',
        `or-progress-bar--${tone}`,
        `or-progress-bar--${size}`,
        indeterminate && 'or-progress-bar--indeterminate',
        className,
      )}
      {...rest}
    >
      {(label || (showValue && valueText)) && (
        <div className="or-progress-bar__header">
          {label && (
            <span id={labelId} className="or-progress-bar__label">
              {label}
            </span>
          )}
          {showValue && valueText && (
            // o valor já é anunciado por aria-valuetext; evita leitura duplicada
            <span className="or-progress-bar__value" aria-hidden="true">
              {valueText}
            </span>
          )}
        </div>
      )}
      <div
        className="or-progress-bar__track"
        role="progressbar"
        aria-label={ariaLabel}
        aria-labelledby={labelledBy}
        aria-describedby={describedBy}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={indeterminate ? undefined : current}
        aria-valuetext={valueText}
      >
        <div
          className="or-progress-bar__fill"
          // transform (scaleX) em vez de width: anima sem recalcular layout
          style={indeterminate ? undefined : { transform: `scaleX(${percent / 100})` }}
        />
      </div>
      {description && (
        <div id={descriptionId} className="or-progress-bar__description">
          {description}
        </div>
      )}
    </div>
  )
})
