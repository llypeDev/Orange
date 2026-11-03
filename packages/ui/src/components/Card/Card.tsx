import {
  forwardRef,
  type AnchorHTMLAttributes,
  type CSSProperties,
  type ElementType,
  type HTMLAttributes,
  type ReactNode,
} from 'react'
import { cx } from '../../utils'
import type { HeadingLevel } from '../Typography'
import './Card.css'

export type CardVariant = 'outline' | 'raised' | 'accent'
export type CardSize = 'sm' | 'md' | 'lg'

export interface CardProps extends HTMLAttributes<HTMLElement> {
  /** Elemento raiz. Use `article` para conteúdo independente e `li` dentro de listas. */
  as?: ElementType
  /** `outline` (borda 1px, padrão), `raised` (superfície elevada) ou `accent` (borda superior laranja). */
  variant?: CardVariant
  /** Espaçamento interno: `sm` 16px, `md` 24px, `lg` 32px. */
  size?: CardSize
  /**
   * Torna o cartão inteiro clicável. O alvo é o `CardLink` do título, que
   * ganha uma área estendida sobre o cartão (o título continua sendo o link).
   */
  interactive?: boolean
}

/** Contêiner de conteúdo relacionado: título, texto, mídia e ações. */
export const Card = forwardRef<HTMLElement, CardProps>(function Card(
  { as: Component = 'div', variant = 'outline', size = 'md', interactive = false, className, ...rest },
  ref,
) {
  return (
    <Component
      ref={ref}
      className={cx(
        'or-card',
        `or-card--${variant}`,
        `or-card--${size}`,
        interactive && 'or-card--interactive',
        className,
      )}
      {...rest}
    />
  )
})

export interface CardLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  /** Componente de link do roteador (ex.: `Link` do React Router). Padrão: `a`. */
  as?: ElementType
  /** Repassado ao componente de roteador. */
  to?: string
}

/**
 * Link do título do cartão. Em um `Card interactive`, sua área se estende por
 * todo o cartão (padrão "stretched link").
 */
export const CardLink = forwardRef<HTMLAnchorElement, CardLinkProps>(function CardLink(
  { as: Component = 'a', className, ...rest },
  ref,
) {
  return <Component ref={ref} className={cx('or-card__link', className)} {...rest} />
})

export interface CardHeaderProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Rótulo curto em caixa alta acima do título. */
  eyebrow?: ReactNode
  /** Título do cartão (renderizado como heading). */
  title?: ReactNode
  /** Nível semântico do título. Padrão: 3. */
  headingLevel?: HeadingLevel
  /** Transforma o título em link (`CardLink`). */
  href?: string
  /** Atributos extras do link do título. */
  linkProps?: Omit<CardLinkProps, 'href' | 'children'>
  /** Texto de apoio abaixo do título. */
  description?: ReactNode
  /** Ações à direita do título (botões de ícone, menus). */
  actions?: ReactNode
}

/** Cabeçalho do cartão: eyebrow, título (opcionalmente link), descrição e ações. */
export const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(function CardHeader(
  { eyebrow, title, headingLevel = 3, href, linkProps, description, actions, className, children, ...rest },
  ref,
) {
  const Heading = `h${headingLevel}` as ElementType
  return (
    <div ref={ref} className={cx('or-card__header', className)} {...rest}>
      <div className="or-card__heading">
        {eyebrow && <p className="or-card__eyebrow or-eyebrow">{eyebrow}</p>}
        {title && (
          <Heading className="or-card__title">
            {href || linkProps?.to ? (
              <CardLink href={href} {...linkProps}>
                {title}
              </CardLink>
            ) : (
              title
            )}
          </Heading>
        )}
        {description && <p className="or-card__description">{description}</p>}
        {children}
      </div>
      {actions && <div className="or-card__actions">{actions}</div>}
    </div>
  )
})

export type CardBodyProps = HTMLAttributes<HTMLDivElement>

/** Conteúdo principal do cartão. */
export const CardBody = forwardRef<HTMLDivElement, CardBodyProps>(function CardBody({ className, ...rest }, ref) {
  return <div ref={ref} className={cx('or-card__body', className)} {...rest} />
})

export interface CardFooterProps extends HTMLAttributes<HTMLDivElement> {
  /** Mostra uma linha divisória acima do rodapé. */
  divider?: boolean
}

/** Rodapé com ações ou metadados, sempre alinhado à base do cartão. */
export const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(function CardFooter(
  { divider = false, className, ...rest },
  ref,
) {
  return <div ref={ref} className={cx('or-card__footer', divider && 'or-card__footer--divider', className)} {...rest} />
})

export interface CardMediaProps extends HTMLAttributes<HTMLDivElement> {
  /** URL da imagem. Alternativamente, passe a mídia como `children`. */
  src?: string
  /** Texto alternativo da imagem. Use `""` se for decorativa. */
  alt?: string
  /** Proporção da área de mídia (ex.: `16/9`, `4/3`, `1`). Padrão: `16/9`. */
  ratio?: string | number
}

/** Imagem ou mídia de borda a borda (no topo ou na base do cartão). */
export const CardMedia = forwardRef<HTMLDivElement, CardMediaProps>(function CardMedia(
  { src, alt = '', ratio = '16/9', className, style, children, ...rest },
  ref,
) {
  const mediaStyle: CSSProperties = { aspectRatio: String(ratio), ...style }
  return (
    <div ref={ref} className={cx('or-card__media', className)} style={mediaStyle} {...rest}>
      {children ?? (src ? <img src={src} alt={alt} /> : null)}
    </div>
  )
})
