import { forwardRef, type HTMLAttributes, type ReactNode, type Ref } from 'react'
import { useId } from '../../hooks'
import { cx } from '../../utils'
import './Divider.css'

export type DividerOrientation = 'horizontal' | 'vertical'
export type DividerTone = 'subtle' | 'default' | 'strong' | 'accent'
export type DividerSpacing = 0 | 1 | 2 | 3 | 4 | 6 | 8

export interface DividerProps extends HTMLAttributes<HTMLElement> {
  /** Direção da linha. Na vertical, o divisor ocupa a altura do contêiner flex. */
  orientation?: DividerOrientation
  /** Intensidade da linha: `subtle`, `default`, `strong` ou `accent` (laranja). */
  tone?: DividerTone
  /** Espessura: `thin` (1px, padrão) ou `thick` (2px). */
  thickness?: 'thin' | 'thick'
  /** Margem ao redor da linha, na escala de espaço (`4` = 1rem). Padrão: `4`. */
  spacing?: DividerSpacing
  /**
   * Rótulo curto exibido sobre a linha em caixa alta (ex.: "ou", "Hoje").
   * Só para divisores horizontais.
   */
  label?: ReactNode
  /** Posição do rótulo. Padrão: `center`. */
  labelPosition?: 'start' | 'center' | 'end'
  /**
   * Divisor puramente visual: fica oculto para leitores de tela. Use quando a
   * separação já é clara pela estrutura (títulos, listas, landmarks).
   */
  decorative?: boolean
}

/**
 * Separa visualmente grupos de conteúdo. Usa `<hr>` (ou `role="separator"`)
 * para que a separação também seja percebida por leitores de tela, a menos que
 * seja marcado como `decorative`.
 */
export const Divider = forwardRef<HTMLElement, DividerProps>(function Divider(
  {
    orientation = 'horizontal',
    tone = 'default',
    thickness = 'thin',
    spacing = 4,
    label,
    labelPosition = 'center',
    decorative = false,
    className,
    ...rest
  },
  ref,
) {
  const labelId = useId('or-divider-label')
  const hasLabel = label !== undefined && label !== null && label !== false && orientation === 'horizontal'
  const classes = cx(
    'or-divider',
    `or-divider--${orientation}`,
    `or-divider--${tone}`,
    `or-divider--${thickness}`,
    `or-divider--spacing-${spacing}`,
    hasLabel && 'or-divider--labelled',
    hasLabel && `or-divider--label-${labelPosition}`,
    className,
  )

  if (hasLabel) {
    // Linhas desenhadas por pseudo-elementos; o rótulo é o conteúdo lido.
    return (
      <div
        ref={ref as Ref<HTMLDivElement>}
        className={classes}
        {...(decorative
          ? {}
          : { role: 'separator', 'aria-orientation': 'horizontal' as const, 'aria-labelledby': labelId })}
        {...rest}
      >
        <span id={labelId} className="or-divider__label">
          {label}
        </span>
      </div>
    )
  }

  if (orientation === 'vertical') {
    return (
      <div
        ref={ref as Ref<HTMLDivElement>}
        className={classes}
        {...(decorative ? { 'aria-hidden': true } : { role: 'separator', 'aria-orientation': 'vertical' as const })}
        {...rest}
      />
    )
  }

  return (
    <hr
      ref={ref as Ref<HTMLHRElement>}
      className={classes}
      {...(decorative ? { 'aria-hidden': true } : {})}
      {...rest}
    />
  )
})
