import { forwardRef, type HTMLAttributes, type ReactNode } from 'react'
import { useId } from '../../hooks'
import { useLocale } from '../../providers'
import { clamp, cx, devWarning } from '../../utils'
import './Meter.css'

export type MeterTone = 'accent' | 'neutral' | 'info' | 'success' | 'warning' | 'danger'
export type MeterSize = 'sm' | 'md'
/** Faixa do valor em relação ao ótimo (mesmo algoritmo do `<meter>` nativo). */
export type MeterLevel = 'optimum' | 'suboptimum' | 'critical'

export interface MeterValueInfo {
  min: number
  max: number
  /** Posição do valor na escala, de 0 a 100. */
  percent: number
}

export interface MeterProps extends HTMLAttributes<HTMLDivElement> {
  /** Valor medido. */
  value: number
  /** Início da escala. */
  min?: number
  /** Fim da escala. */
  max?: number
  /** Limite superior da faixa "baixa". */
  low?: number
  /** Limite inferior da faixa "alta". */
  high?: number
  /**
   * Valor ideal. Define qual faixa é boa: se estiver abaixo de `low`, valores
   * baixos são ótimos (ex.: uso de disco); acima de `high`, valores altos são
   * ótimos (ex.: bateria). Padrão: o meio da escala.
   */
  optimum?: number
  /** Rótulo visível, associado via `aria-labelledby`. */
  label?: ReactNode
  /** Texto de apoio abaixo do medidor, associado via `aria-describedby`. */
  description?: ReactNode
  /** Mostra o valor formatado ao lado do rótulo. */
  showValue?: boolean
  /** Formata o valor exibido e anunciado (`aria-valuetext`). Padrão: percentual. */
  formatValue?: (value: number, info: MeterValueInfo) => string
  /**
   * Força uma cor. Sem esta prop, a cor vem das faixas: ótimo → `success`,
   * subótimo → `warning`, crítico → `danger` (ou `accent` sem `low`/`high`).
   */
  tone?: MeterTone
  /** Espessura: `sm` 4px, `md` 8px. */
  size?: MeterSize
  /** Mostra marcas nos limites `low` e `high`. */
  showThresholds?: boolean
}

/** Calcula a faixa do valor seguindo o algoritmo do elemento `<meter>` do HTML. */
function getMeterLevel(value: number, low: number, high: number, optimum: number): MeterLevel {
  const region = (v: number) => (v < low ? 'low' : v > high ? 'high' : 'medium')
  const valueRegion = region(value)
  const optimumRegion = region(optimum)
  if (valueRegion === optimumRegion) return 'optimum'
  if (optimumRegion === 'medium') return 'suboptimum'
  if (valueRegion === 'medium') return 'suboptimum'
  return 'critical'
}

const levelTone: Record<MeterLevel, MeterTone> = {
  optimum: 'success',
  suboptimum: 'warning',
  critical: 'danger',
}

/**
 * Medidor de um valor escalar dentro de uma faixa conhecida — uso de
 * armazenamento, cota de API, força de senha. Para o andamento de uma tarefa,
 * use `ProgressBar`.
 */
export const Meter = forwardRef<HTMLDivElement, MeterProps>(function Meter(
  {
    value,
    min = 0,
    max = 100,
    low: lowProp,
    high: highProp,
    optimum: optimumProp,
    label,
    description,
    showValue = true,
    formatValue,
    tone: toneProp,
    size = 'md',
    showThresholds = true,
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
  const baseId = useId('or-meter', id)
  const labelId = `${baseId}-label`
  const descriptionId = `${baseId}-description`

  devWarning(
    !label && !ariaLabel && !ariaLabelledby,
    'Meter precisa de `label`, `aria-label` ou `aria-labelledby`.',
  )

  const safeMax = Math.max(min, max)
  const current = clamp(value, min, safeMax)
  const low = clamp(lowProp ?? min, min, safeMax)
  const high = clamp(highProp ?? safeMax, low, safeMax)
  const optimum = clamp(optimumProp ?? (min + safeMax) / 2, min, safeMax)
  const hasRegions = lowProp !== undefined || highProp !== undefined
  const level = getMeterLevel(current, low, high, optimum)
  const tone = toneProp ?? (hasRegions ? levelTone[level] : 'accent')

  const toPercent = (v: number) => (safeMax > min ? ((v - min) / (safeMax - min)) * 100 : 0)
  const percent = toPercent(current)
  const valueText = formatValue
    ? formatValue(current, { min, max: safeMax, percent })
    : new Intl.NumberFormat(locale, { style: 'percent', maximumFractionDigits: 0 }).format(
        percent / 100,
      )

  const thresholds = showThresholds
    ? [lowProp !== undefined ? low : null, highProp !== undefined ? high : null].filter(
        (v, i, list): v is number => v !== null && v > min && v < safeMax && list.indexOf(v) === i,
      )
    : []

  const labelledBy =
    [ariaLabelledby, label ? labelId : undefined].filter(Boolean).join(' ') || undefined
  const describedBy =
    [ariaDescribedby, description ? descriptionId : undefined].filter(Boolean).join(' ') ||
    undefined

  return (
    <div
      ref={ref}
      id={id}
      className={cx('or-meter', `or-meter--${tone}`, `or-meter--${size}`, className)}
      data-level={hasRegions ? level : undefined}
      {...rest}
    >
      {(label || showValue) && (
        <div className="or-meter__header">
          {label && (
            <span id={labelId} className="or-meter__label">
              {label}
            </span>
          )}
          {showValue && (
            <span className="or-meter__value" aria-hidden="true">
              {valueText}
            </span>
          )}
        </div>
      )}
      <div
        className="or-meter__track"
        role="meter"
        aria-label={ariaLabel}
        aria-labelledby={labelledBy}
        aria-describedby={describedBy}
        aria-valuemin={min}
        aria-valuemax={safeMax}
        aria-valuenow={current}
        aria-valuetext={valueText}
      >
        {/* transform (scaleX) em vez de width: anima sem recalcular layout */}
        <div className="or-meter__fill" style={{ transform: `scaleX(${percent / 100})` }} />
        {thresholds.map((threshold) => (
          <span
            key={threshold}
            className="or-meter__threshold"
            style={{ left: `${toPercent(threshold)}%` }}
            aria-hidden="true"
          />
        ))}
      </div>
      {description && (
        <div id={descriptionId} className="or-meter__description">
          {description}
        </div>
      )}
    </div>
  )
})
