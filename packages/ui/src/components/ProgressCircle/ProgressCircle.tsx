import { forwardRef, type CSSProperties, type HTMLAttributes } from 'react'
import { useLocale } from '../../providers'
import { clamp, cx } from '../../utils'
import './ProgressCircle.css'

export type ProgressCircleSize = 'sm' | 'md' | 'lg'
export type ProgressCircleTone = 'accent' | 'neutral' | 'info' | 'success' | 'warning' | 'danger'

export interface ProgressCircleValueInfo {
  min: number
  max: number
  /** Percentual concluído, de 0 a 100. */
  percent: number
}

export interface ProgressCircleProps extends HTMLAttributes<HTMLDivElement> {
  /** Valor atual. Sem valor (`undefined`/`null`), o círculo fica indeterminado. */
  value?: number | null
  min?: number
  max?: number
  /** Diâmetro: `sm` 24px, `md` 48px, `lg` 80px. */
  size?: ProgressCircleSize
  /** Cor do arco. */
  tone?: ProgressCircleTone
  /** Mostra o valor no centro (tamanhos `md` e `lg`, modo determinado). */
  showValue?: boolean
  /** Formata o valor exibido e anunciado (`aria-valuetext`). Padrão: percentual. */
  formatValue?: (value: number, info: ProgressCircleValueInfo) => string
  /**
   * Nome acessível (`aria-label`). Padrão: `t('loading')`. Prefira algo
   * específico: "Enviando foto", "Sincronizando agenda".
   */
  label?: string
}

const dimensions: Record<ProgressCircleSize, { size: number; stroke: number }> = {
  sm: { size: 24, stroke: 3 },
  md: { size: 48, stroke: 4 },
  lg: { size: 80, stroke: 6 },
}

/**
 * Indicador circular de progresso (`role="progressbar"`). Use em espaços
 * compactos — cartões, miniaturas de upload, botões — ou quando o valor
 * central for o destaque.
 */
export const ProgressCircle = forwardRef<HTMLDivElement, ProgressCircleProps>(
  function ProgressCircle(
    {
      value,
      min = 0,
      max = 100,
      size = 'md',
      tone = 'accent',
      showValue = false,
      formatValue,
      label,
      className,
      style,
      'aria-label': ariaLabel,
      'aria-labelledby': ariaLabelledby,
      ...rest
    },
    ref,
  ) {
    const { t, locale } = useLocale()
    const indeterminate = value === undefined || value === null || Number.isNaN(value)
    const current = indeterminate ? min : clamp(value, min, max)
    const percent = max > min ? ((current - min) / (max - min)) * 100 : 0
    const valueText = indeterminate
      ? undefined
      : formatValue
        ? formatValue(current, { min, max, percent })
        : new Intl.NumberFormat(locale, { style: 'percent', maximumFractionDigits: 0 }).format(
            percent / 100,
          )

    const { size: px, stroke } = dimensions[size]
    const radius = (px - stroke) / 2
    const circumference = 2 * Math.PI * radius
    const center = px / 2
    // a terminação quadrada avança meio traço em cada ponta: só desenha o arco quando há progresso
    const showArc = indeterminate || percent > 0
    const dashOffset = indeterminate ? circumference * 0.72 : circumference * (1 - percent / 100)

    return (
      <div
        ref={ref}
        role="progressbar"
        aria-label={ariaLabelledby ? ariaLabel : (ariaLabel ?? label ?? t('loading'))}
        aria-labelledby={ariaLabelledby}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={indeterminate ? undefined : current}
        aria-valuetext={valueText}
        className={cx(
          'or-progress-circle',
          `or-progress-circle--${size}`,
          `or-progress-circle--${tone}`,
          indeterminate && 'or-progress-circle--indeterminate',
          className,
        )}
        style={{ width: px, height: px, ...style }}
        {...rest}
      >
        <svg
          className="or-progress-circle__svg"
          width={px}
          height={px}
          viewBox={`0 0 ${px} ${px}`}
          fill="none"
          aria-hidden="true"
          focusable="false"
        >
          <circle
            className="or-progress-circle__track"
            cx={center}
            cy={center}
            r={radius}
            strokeWidth={stroke}
          />
          {showArc && (
            <circle
              className="or-progress-circle__arc"
              cx={center}
              cy={center}
              r={radius}
              strokeWidth={stroke}
              strokeLinecap="square"
              strokeDasharray={circumference}
              // via style (não atributo) para a transição de stroke-dashoffset ser garantida;
              // --_circumference alimenta o "desenho" de entrada
              style={
                {
                  strokeDashoffset: dashOffset,
                  '--_circumference': circumference,
                } as CSSProperties
              }
            />
          )}
        </svg>
        {showValue && valueText && size !== 'sm' && (
          <span className="or-progress-circle__value" aria-hidden="true">
            {valueText}
          </span>
        )}
      </div>
    )
  },
)
