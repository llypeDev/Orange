import { forwardRef, type ElementType, type HTMLAttributes } from 'react'
import { cx } from '../../utils'
import './Container.css'

export type ContainerSize = 'sm' | 'md' | 'lg' | 'xl' | 'full'

export interface ContainerProps extends HTMLAttributes<HTMLElement> {
  /**
   * Elemento renderizado. Padrão: `div`. Use `main` para o conteúdo principal
   * da página ou `section` com um título.
   */
  as?: ElementType
  /**
   * Largura máxima do conteúdo: `sm` 640px (formulários, texto), `md` 768px,
   * `lg` 1024px, `xl` 1200px (`--or-layout-max-width`, padrão) ou `full`
   * (sem limite, só com as margens laterais).
   */
  size?: ContainerSize
}

/**
 * Centraliza o conteúdo da página com largura máxima e margens laterais
 * (gutter) que encolhem no celular: 16px, 24px a partir de 768px e 32px
 * (`--or-layout-gutter`) a partir de 1024px.
 */
export const Container = forwardRef<HTMLElement, ContainerProps>(function Container(
  { as: Component = 'div', size = 'xl', className, ...rest },
  ref,
) {
  return (
    <Component
      ref={ref}
      className={cx('or-container', `or-container--${size}`, className)}
      {...rest}
    />
  )
})
