import { forwardRef, type CSSProperties, type HTMLAttributes, type ReactNode } from 'react'
import { useReducedMotion } from '../../hooks'
import { Icon } from '../../icons'
import { cx } from '../../utils'
import type { RenderLink } from '../Link'
import './PageHeader.css'

export type PageHeaderHeadingLevel = 1 | 2 | 3

/** Link de volta para a página anterior na hierarquia. */
export interface PageHeaderBack {
  /** Destino do link. */
  href: string
  /** Texto do link — diga para onde ele leva ("Pedidos", "Voltar para pedidos"). */
  label: string
}

export interface PageHeaderProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Título da página. */
  title: ReactNode
  /** Nível do heading do título. Padrão: `1` (um `h1` por página). */
  headingLevel?: PageHeaderHeadingLevel
  /** Texto de apoio abaixo do título. */
  description?: ReactNode
  /** Rótulo curto em caixa alta acima do título (área, seção, contexto). */
  eyebrow?: ReactNode
  /** Trilha de navegação acima do título — normalmente um `<Breadcrumb>`. */
  breadcrumbs?: ReactNode
  /** Link de volta, com seta, acima do título. */
  back?: PageHeaderBack
  /** Renderiza o link de volta com o componente do seu roteador. */
  renderLink?: RenderLink
  /** Ações da página (botões), alinhadas à direita; quebram para baixo do título em telas estreitas. */
  actions?: ReactNode
  /** Selos ou status ao lado do título (Tag, Badge…). */
  meta?: ReactNode
  /** Navegação local sob o cabeçalho — normalmente uma `TabList`. */
  navigation?: ReactNode
  /** Linha de 1px na base do cabeçalho. */
  divider?: boolean
  /**
   * Entrada em sequência ao montar: eyebrow → título → descrição → ações
   * (sobem 24px com fade, 80ms entre eles). Desligada com movimento reduzido.
   */
  reveal?: boolean
}

/**
 * Topo de uma página da aplicação: trilha ou link de volta, eyebrow, título,
 * descrição, selos, ações e navegação local (abas).
 */
export const PageHeader = forwardRef<HTMLDivElement, PageHeaderProps>(function PageHeader(
  {
    title,
    headingLevel = 1,
    description,
    eyebrow,
    breadcrumbs,
    back,
    renderLink,
    actions,
    meta,
    navigation,
    divider = false,
    reveal = false,
    className,
    ...rest
  },
  ref,
) {
  const reducedMotion = useReducedMotion()
  const animate = reveal && !reducedMotion
  const Heading = `h${headingLevel}` as 'h1' | 'h2' | 'h3'
  // Índice de cada parte na sequência da revelação (eyebrow → título → descrição → ações).
  let step = 0
  const revealStyle = () => (animate ? ({ '--_i': step++ } as CSSProperties) : undefined)

  const backLink = back
    ? (() => {
        const linkProps = {
          href: back.href,
          className: 'or-page-header__back',
          children: (
            <>
              <Icon name="arrow-left" size="sm" className="or-page-header__back-icon" />
              <span>{back.label}</span>
            </>
          ),
        }
        return renderLink ? renderLink(linkProps) : <a {...linkProps} />
      })()
    : null

  return (
    <div
      ref={ref}
      className={cx(
        'or-page-header',
        `or-page-header--h${headingLevel}`,
        divider && 'or-page-header--divider',
        Boolean(navigation) && 'or-page-header--with-navigation',
        animate && 'or-page-header--reveal',
        className,
      )}
      {...rest}
    >
      {(breadcrumbs || backLink) && (
        <div className="or-page-header__context">
          {breadcrumbs && <div className="or-page-header__breadcrumbs">{breadcrumbs}</div>}
          {backLink}
        </div>
      )}
      <div className="or-page-header__main">
        <div className="or-page-header__heading">
          {eyebrow && (
            <p className="or-page-header__eyebrow or-eyebrow" style={revealStyle()}>
              {eyebrow}
            </p>
          )}
          <div className="or-page-header__title-row" style={revealStyle()}>
            <Heading className="or-page-header__title">{title}</Heading>
            {meta && <div className="or-page-header__meta">{meta}</div>}
          </div>
          {description && (
            <div className="or-page-header__description" style={revealStyle()}>
              {description}
            </div>
          )}
        </div>
        {actions && (
          <div className="or-page-header__actions" style={revealStyle()}>
            {actions}
          </div>
        )}
      </div>
      {navigation ? <div className="or-page-header__navigation">{navigation}</div> : null}
    </div>
  )
})
