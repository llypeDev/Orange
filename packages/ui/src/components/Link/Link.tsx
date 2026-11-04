import {
  forwardRef,
  type AnchorHTMLAttributes,
  type ComponentPropsWithoutRef,
  type ElementType,
  type ReactElement,
  type ReactNode,
  type Ref,
} from 'react'
import { Icon } from '../../icons'
import { useLocale } from '../../providers'
import { cx } from '../../utils'
import { VisuallyHidden } from '../VisuallyHidden'
import './Link.css'

export type LinkVariant = 'default' | 'subtle' | 'standalone'

/**
 * Props entregues a uma função `renderLink` (Breadcrumb, SideNav, AppHeader,
 * BottomNavigation…). Repasse-as ao link do seu roteador:
 * `renderLink={({ href, ...props }) => <RouterLink to={href} {...props} />}`.
 */
export type RenderLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string
  children?: ReactNode
}

/** Renderiza um link customizado (ex.: o `Link` do React Router ou do Next.js). */
export type RenderLink = (props: RenderLinkProps) => ReactNode

interface LinkOwnProps {
  /** Estilo visual. `standalone` é para links isolados, fora de um parágrafo. */
  variant?: LinkVariant
  /**
   * Link para outro site: abre em nova aba (`target="_blank"`,
   * `rel="noopener noreferrer"`), mostra o ícone ↗ e avisa leitores de tela.
   */
  external?: boolean
  /**
   * Componente renderizado no lugar do `<a>` — use para integrar com roteadores:
   * `<Link as={RouterLink} to="/conta">`.
   */
  as?: ElementType
  children?: ReactNode
  className?: string
}

export type LinkProps<C extends ElementType = 'a'> = LinkOwnProps &
  Omit<ComponentPropsWithoutRef<C>, keyof LinkOwnProps> & { as?: C }

/** Gera as classes do link — útil para estilizar o link de um roteador. */
export function linkClassName({ variant = 'default' }: { variant?: LinkVariant } = {}) {
  return cx('or-link', `or-link--${variant}`)
}

function LinkImpl(
  { as: Component = 'a', variant = 'default', external = false, className, children, target, rel, ...rest }: LinkProps<ElementType>,
  ref: Ref<HTMLAnchorElement>,
) {
  const { t } = useLocale()
  const showArrow = variant === 'standalone' && !external
  return (
    <Component
      ref={ref}
      className={cx(linkClassName({ variant }), external && 'or-link--external', className)}
      target={external ? (target ?? '_blank') : target}
      rel={external ? cx('noopener noreferrer', rel as string) : rel}
      {...rest}
    >
      <span className="or-link__label">{children}</span>
      {external && (
        <>
          <Icon name="arrow-up-right" className="or-link__icon or-link__icon--external" />
          <VisuallyHidden> {t('opensInNewTab')}</VisuallyHidden>
        </>
      )}
      {showArrow && <Icon name="arrow-right" className="or-link__icon or-link__icon--arrow" />}
    </Component>
  )
}

/**
 * Links levam a outra página ou a outro ponto da página. Para disparar
 * ações (salvar, abrir um diálogo), use `Button`.
 *
 * Polimórfico: `as` aceita o link do seu roteador.
 */
export const Link = forwardRef(LinkImpl) as (<C extends ElementType = 'a'>(
  props: LinkProps<C> & { ref?: Ref<HTMLAnchorElement> },
) => ReactElement | null) & { displayName?: string }

Link.displayName = 'Link'
