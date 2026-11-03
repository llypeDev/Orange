import { cloneElement, forwardRef, isValidElement, type HTMLAttributes, type ReactElement, type ReactNode } from 'react'
import { useId } from '../../hooks'
import { cx } from '../../utils'
import { VisuallyHidden } from '../VisuallyHidden'
import './Badge.css'

export type BadgeTone = 'neutral' | 'accent' | 'success' | 'warning' | 'danger' | 'info'
export type BadgeSize = 'sm' | 'md'

export interface BadgeProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'children'> {
  /** Número exibido. Com `0`, o badge some (a menos que `showZero`). */
  count?: number
  /** Valor máximo exibido; acima dele mostra `max+`. Padrão: 99. */
  max?: number
  /** Mostra apenas um ponto (sem número). */
  dot?: boolean
  /** Cor semântica. Padrão: `accent`. */
  tone?: BadgeTone
  /** Tamanho: `sm` ou `md` (padrão). */
  size?: BadgeSize
  /**
   * Texto acessível completo (ex.: "3 notificações não lidas"). Sem ele, o
   * leitor de tela ouve apenas o número; pontos sem `label` são decorativos.
   */
  label?: string
  /** Mantém o badge visível quando `count` é 0. */
  showZero?: boolean
  /** Forma do elemento ancorado, para ajustar a posição do badge. */
  overlap?: 'square' | 'circle'
  /**
   * Elemento sobre o qual o badge é posicionado (canto superior direito).
   * O `label` é ligado a ele via `aria-describedby`.
   */
  children?: ReactNode
}

/**
 * Indicador numérico ou ponto, inline ou sobreposto a outro elemento
 * (ícone, botão, avatar).
 */
export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(function Badge(
  {
    count,
    max = 99,
    dot = false,
    tone = 'accent',
    size = 'md',
    label,
    showZero = false,
    overlap = 'square',
    className,
    children,
    ...rest
  },
  ref,
) {
  const descriptionId = useId('or-badge')
  const hasCount = typeof count === 'number' && !Number.isNaN(count)
  const visible = dot || (hasCount && (count > 0 || showZero))
  const display = dot || !hasCount ? '' : count > max ? `${max}+` : String(count)
  const anchored = children !== undefined && children !== null
  const anchorElement = anchored && isValidElement<{ 'aria-describedby'?: string }>(children) ? children : null

  const classes = cx(
    'or-badge',
    `or-badge--${tone}`,
    `or-badge--${size}`,
    dot && 'or-badge--dot',
    anchored && 'or-badge--overlay',
    anchored && `or-badge--overlap-${overlap}`,
    className,
  )

  // Badge sobre um elemento interativo: a informação vira descrição dele.
  if (anchorElement) {
    const description = label ?? display
    const describedBy = [anchorElement.props['aria-describedby'], visible && description ? descriptionId : undefined]
      .filter(Boolean)
      .join(' ')
    return (
      <span className="or-badge-anchor">
        {cloneElement(anchorElement as ReactElement<{ 'aria-describedby'?: string }>, {
          'aria-describedby': describedBy || undefined,
        })}
        {visible && (
          <>
            <span ref={ref} className={classes} aria-hidden="true" {...rest}>
              {display}
            </span>
            {description && (
              <span id={descriptionId} hidden>
                {description}
              </span>
            )}
          </>
        )}
      </span>
    )
  }

  const indicator = visible ? (
    <span ref={ref} className={classes} aria-hidden={!label && dot ? true : undefined} {...rest}>
      {label ? (
        <>
          {display && <span aria-hidden="true">{display}</span>}
          <VisuallyHidden>{label}</VisuallyHidden>
        </>
      ) : (
        display
      )}
    </span>
  ) : null

  if (anchored) {
    return (
      <span className="or-badge-anchor">
        {children}
        {indicator}
      </span>
    )
  }
  return indicator
})
