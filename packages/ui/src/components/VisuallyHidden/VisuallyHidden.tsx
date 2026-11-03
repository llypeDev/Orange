import { forwardRef, type ElementType, type HTMLAttributes } from 'react'
import { cx } from '../../utils'

export interface VisuallyHiddenProps extends HTMLAttributes<HTMLElement> {
  /** Elemento renderizado. Padrão: `span`. */
  as?: ElementType
  /** Torna-se visível quando recebe foco (útil para links de atalho). */
  focusable?: boolean
}

/**
 * Esconde conteúdo visualmente mantendo-o acessível para leitores de tela.
 */
export const VisuallyHidden = forwardRef<HTMLElement, VisuallyHiddenProps>(function VisuallyHidden(
  { as: Component = 'span', focusable = false, className, ...rest },
  ref,
) {
  return (
    <Component
      ref={ref}
      className={cx(focusable ? 'or-visually-hidden-focusable' : 'or-visually-hidden', className)}
      {...rest}
    />
  )
})
