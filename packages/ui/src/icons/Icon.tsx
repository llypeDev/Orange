import { forwardRef, type SVGProps } from 'react'
import { cx } from '../utils'
import { iconPaths, type IconName } from './paths'
import './Icon.css'

export type IconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number

export interface IconProps extends Omit<SVGProps<SVGSVGElement>, 'name' | 'ref'> {
  /** Nome do ícone na biblioteca do Orange. */
  name: IconName
  /** Tamanho: token (`xs`=12, `sm`=16, `md`=20, `lg`=24, `xl`=32) ou pixels. */
  size?: IconSize
  /**
   * Texto alternativo. Quando informado, o ícone é anunciado por leitores de
   * tela (`role="img"`). Sem `label`, o ícone é decorativo (`aria-hidden`).
   */
  label?: string
  /** Espessura do traço. Padrão 1.75. */
  strokeWidth?: number
}

const sizes = { xs: 12, sm: 16, md: 20, lg: 24, xl: 32 } as const

/**
 * Ícone SVG da biblioteca do Orange. Decorativo por padrão; informe `label`
 * quando o ícone transmitir significado sozinho.
 */
export const Icon = forwardRef<SVGSVGElement, IconProps>(function Icon(
  { name, size = 'md', label, strokeWidth = 1.75, className, ...rest },
  ref,
) {
  const px = typeof size === 'number' ? size : sizes[size]
  return (
    <svg
      ref={ref}
      xmlns="http://www.w3.org/2000/svg"
      width={px}
      height={px}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="square"
      strokeLinejoin="miter"
      className={cx('or-icon', className)}
      data-icon={name}
      focusable="false"
      {...(label ? { role: 'img', 'aria-label': label } : { 'aria-hidden': true })}
      {...rest}
    >
      {iconPaths[name]}
    </svg>
  )
})
