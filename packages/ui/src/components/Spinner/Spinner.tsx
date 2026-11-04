import { forwardRef, type HTMLAttributes } from 'react'
import { useLocale } from '../../providers'
import { cx } from '../../utils'
import { VisuallyHidden } from '../VisuallyHidden'
import './Spinner.css'

export type SpinnerSize = 'sm' | 'md' | 'lg'
export type SpinnerTone = 'accent' | 'neutral' | 'current'

export interface SpinnerProps extends HTMLAttributes<HTMLSpanElement> {
  /** Diâmetro: `sm` 16px, `md` 24px, `lg` 40px. */
  size?: SpinnerSize
  /** Cor do arco: `accent` (laranja), `neutral` (texto) ou `current` (herda `color`). */
  tone?: SpinnerTone
  /** Texto anunciado a leitores de tela. Padrão: `t('loading')`. */
  label?: string
  /**
   * Esconde o indicador de tecnologias assistivas (`aria-hidden`). Use quando
   * outro elemento já anuncia o carregamento (ex.: um texto visível ao lado).
   */
  decorative?: boolean
}

/**
 * Indicador circular de carregamento para esperas curtas e de duração
 * desconhecida. Anuncia `role="status"` com um rótulo visualmente oculto.
 */
export const Spinner = forwardRef<HTMLSpanElement, SpinnerProps>(function Spinner(
  { size = 'md', tone = 'accent', label, decorative = false, className, ...rest },
  ref,
) {
  const { t } = useLocale()
  return (
    <span
      ref={ref}
      className={cx('or-spinner', `or-spinner--${size}`, `or-spinner--${tone}`, className)}
      {...(decorative ? { 'aria-hidden': true } : { role: 'status' })}
      {...rest}
    >
      <span className="or-spinner__ring" aria-hidden="true" />
      {!decorative && <VisuallyHidden>{label ?? t('loading')}</VisuallyHidden>}
    </span>
  )
})
