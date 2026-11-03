import { forwardRef, type ElementType, type HTMLAttributes } from 'react'
import { cx } from '../../utils'
import './Typography.css'

export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6
export type HeadingSize = 'display' | '5xl' | '4xl' | '3xl' | '2xl' | 'xl' | 'lg' | 'md'

export interface HeadingProps extends HTMLAttributes<HTMLHeadingElement> {
  /** Nível semântico (h1–h6). Defina pela hierarquia do documento, não pelo tamanho. */
  level?: HeadingLevel
  /** Tamanho visual, independente do nível semântico. */
  size?: HeadingSize
}

const defaultSize: Record<HeadingLevel, HeadingSize> = {
  1: '4xl',
  2: '3xl',
  3: '2xl',
  4: 'xl',
  5: 'lg',
  6: 'md',
}

/** Títulos em Space Grotesk com espaçamento negativo, a voz do Orange. */
export const Heading = forwardRef<HTMLHeadingElement, HeadingProps>(function Heading(
  { level = 2, size, className, ...rest },
  ref,
) {
  const Tag = `h${level}` as ElementType
  return (
    <Tag
      ref={ref}
      className={cx('or-heading', `or-heading--${size ?? defaultSize[level]}`, className)}
      {...rest}
    />
  )
})

export type TextSize = '2xs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl'
export type TextTone = 'default' | 'muted' | 'subtle' | 'accent' | 'success' | 'warning' | 'danger' | 'info' | 'inherit'
export type TextWeight = 'regular' | 'medium' | 'semibold' | 'bold'

export interface TextProps extends HTMLAttributes<HTMLElement> {
  /** Elemento renderizado. Padrão: `p`. */
  as?: ElementType
  size?: TextSize
  tone?: TextTone
  weight?: TextWeight
  /** Família tipográfica: `body` (Inter), `display` (Space Grotesk) ou `mono`. */
  font?: 'body' | 'display' | 'mono'
  /** Corta o texto em uma linha com reticências. */
  truncate?: boolean
}

/** Texto corrido com escala, tons e pesos do sistema. */
export const Text = forwardRef<HTMLElement, TextProps>(function Text(
  { as: Component = 'p', size = 'md', tone = 'default', weight, font = 'body', truncate, className, ...rest },
  ref,
) {
  return (
    <Component
      ref={ref}
      className={cx(
        'or-text',
        `or-text--${size}`,
        `or-text--tone-${tone}`,
        weight && `or-text--${weight}`,
        `or-text--font-${font}`,
        truncate && 'or-text--truncate',
        className,
      )}
      {...rest}
    />
  )
})

export interface EyebrowProps extends HTMLAttributes<HTMLElement> {
  as?: ElementType
  /** Mostra o marcador quadrado laranja antes do texto. */
  marker?: boolean
  tone?: 'subtle' | 'accent'
}

/** Rótulo curto em caixa alta (ex.: "COMPONENTES"), usado acima de títulos. */
export const Eyebrow = forwardRef<HTMLElement, EyebrowProps>(function Eyebrow(
  { as: Component = 'p', marker = false, tone = 'subtle', className, children, ...rest },
  ref,
) {
  return (
    <Component
      ref={ref}
      className={cx('or-eyebrow', 'or-eyebrow-text', `or-eyebrow-text--${tone}`, className)}
      {...rest}
    >
      {marker && <span className="or-eyebrow-text__marker" aria-hidden="true" />}
      {children}
    </Component>
  )
})
