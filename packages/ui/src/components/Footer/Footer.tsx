import { forwardRef, type HTMLAttributes, type ReactNode } from 'react'
import { useId } from '../../hooks'
import { Icon } from '../../icons'
import { useLocale } from '../../providers'
import { cx } from '../../utils'
import type { RenderLink } from '../Link'
import { VisuallyHidden } from '../VisuallyHidden'
import './Footer.css'

/** Um link de uma coluna do rodapé. */
export interface FooterLinkItem {
  /** Texto do link. */
  label: string
  /** Destino. */
  href: string
  /**
   * Link para outro site: abre em nova aba (`rel="noopener noreferrer"`),
   * mostra o ícone ↗ colado à última palavra e avisa leitores de tela.
   */
  external?: boolean
}

/** Uma coluna do mapa do site: título curto em caixa alta e a lista de links. */
export interface FooterColumn {
  /** Título da coluna (vira um heading). */
  title: string
  links: FooterLinkItem[]
}

export type FooterHeadingLevel = 2 | 3 | 4 | 5 | 6

export interface FooterProps extends HTMLAttributes<HTMLElement> {
  /** Marca (logo com link para o início). */
  brand?: ReactNode
  /** Frase curta sob a marca. */
  description?: ReactNode
  /** Colunas do mapa do site (até 5 por linha em telas largas). */
  columns?: FooterColumn[]
  /** Barra inferior: copyright, termos, versão. */
  bottom?: ReactNode
  /** Nome da navegação do mapa do site. Padrão: `t('footerNavLabel')` ("Mapa do site"). */
  navLabel?: string
  /** Nível dos headings das colunas. Padrão: `2`. */
  headingLevel?: FooterHeadingLevel
  /**
   * Renderiza os links internos com o componente do seu roteador:
   * `renderLink={({ href, ...p }) => <RouterLink to={href} {...p} />}`.
   * Links `external` continuam sendo `<a>` nativos.
   */
  renderLink?: RenderLink
}

/** Separa a última palavra para que o ↗ nunca vá sozinho para a linha de baixo. */
function splitLastWord(label: string): [string, string] {
  const trimmed = label.trimEnd()
  const index = trimmed.lastIndexOf(' ')
  return index === -1 ? ['', trimmed] : [trimmed.slice(0, index + 1), trimmed.slice(index + 1)]
}

/**
 * Rodapé do site no formato do zop.dev: marca e frase, mapa do site em
 * colunas com títulos em caixa alta e uma barra inferior.
 */
export const Footer = forwardRef<HTMLElement, FooterProps>(function Footer(
  { brand, description, columns = [], bottom, navLabel, headingLevel = 2, renderLink, className, children, ...rest },
  ref,
) {
  const { t } = useLocale()
  const baseId = useId('or-footer')
  const Heading = `h${headingLevel}` as 'h2'
  const hasBrand = Boolean(brand || description)

  return (
    <footer ref={ref} className={cx('or-footer', className)} {...rest}>
      {(hasBrand || columns.length > 0) && (
        <div className="or-footer__top">
          {hasBrand && (
            <div className="or-footer__brand">
              {brand && <div className="or-footer__logo">{brand}</div>}
              {description && <div className="or-footer__description">{description}</div>}
            </div>
          )}
          {columns.length > 0 && (
            <nav className="or-footer__sitemap" aria-label={navLabel ?? t('footerNavLabel')}>
              {columns.map((column, columnIndex) => {
                const headingId = `${baseId}-${columnIndex}`
                return (
                  <div key={`${column.title}-${columnIndex}`} className="or-footer__column">
                    <Heading id={headingId} className="or-footer__heading">
                      {column.title}
                    </Heading>
                    {/* role="list": o Safari remove a semântica de listas com list-style: none. */}
                    <ul role="list" className="or-footer__links" aria-labelledby={headingId}>
                      {column.links.map((link) => (
                        <li key={link.href} className="or-footer__item">
                          {link.external ? (
                            <ExternalLink link={link} label={t('opensInNewTab')} />
                          ) : (
                            <InternalLink link={link} renderLink={renderLink} />
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                )
              })}
            </nav>
          )}
        </div>
      )}
      {children}
      {bottom && <div className="or-footer__bottom">{bottom}</div>}
    </footer>
  )
})

function InternalLink({ link, renderLink }: { link: FooterLinkItem; renderLink?: RenderLink }) {
  const linkProps = {
    href: link.href,
    className: 'or-footer__link',
    children: (
      <>
        {link.label}
        {/* Seta laranja que surge no hover/foco (decorativa). */}
        <Icon name="arrow-right" size="sm" className="or-footer__arrow" />
      </>
    ),
  }
  return renderLink ? <>{renderLink(linkProps)}</> : <a {...linkProps} />
}

function ExternalLink({ link, label }: { link: FooterLinkItem; label: string }) {
  const [start, lastWord] = splitLastWord(link.label)
  return (
    <a href={link.href} target="_blank" rel="noopener noreferrer" className="or-footer__link or-footer__link--external">
      {start}
      <span className="or-footer__nowrap">
        {lastWord}
        <Icon name="arrow-up-right" size="sm" className="or-footer__external-icon" />
      </span>
      <VisuallyHidden> {label}</VisuallyHidden>
    </a>
  )
}
