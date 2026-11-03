import { forwardRef, useRef, type HTMLAttributes, type KeyboardEvent, type ReactNode } from 'react'
import { useClickOutside, useControllableState, useId } from '../../hooks'
import { Icon } from '../../icons'
import { useLocale } from '../../providers'
import { cx, mergeRefs } from '../../utils'
import type { RenderLink } from '../Link'
import './AppHeader.css'

export interface AppHeaderNavItem {
  /** Texto do link. */
  label: ReactNode
  /** Destino. */
  href: string
  /** Marca o item como página atual. Padrão: `href === currentHref`. */
  active?: boolean
}

export type AppHeaderBreakpoint = 'sm' | 'md' | 'lg'

export interface AppHeaderProps extends HTMLAttributes<HTMLElement> {
  /** Área da marca (logo com link para o início). */
  brand?: ReactNode
  /** Links da navegação principal. */
  items?: AppHeaderNavItem[]
  /** `href` da página atual: o item correspondente recebe `aria-current="page"`. */
  currentHref?: string
  /** Renderiza os links com o componente do seu roteador. */
  renderLink?: RenderLink
  /** Área de ações à direita (busca, notificações, avatar). */
  actions?: ReactNode
  /** Conteúdo extra no fim do painel do menu em telas pequenas (ex.: botão "Entrar"). */
  menuFooter?: ReactNode
  /** Nome da navegação. Padrão: `t('mainNavigation')`. */
  navLabel?: string
  /** Fixa o cabeçalho no topo durante a rolagem. */
  sticky?: boolean
  /**
   * Largura do cabeçalho abaixo da qual a navegação vai para o menu
   * (`sm` 40rem, `md` 48rem, `lg` 64rem). Padrão: `md`.
   */
  collapseBelow?: AppHeaderBreakpoint
  /** Menu aberto em telas pequenas (controlado). */
  menuOpen?: boolean
  /** Menu aberto inicialmente (não controlado). */
  defaultMenuOpen?: boolean
  /** Chamado quando o menu abre ou fecha. */
  onMenuOpenChange?: (open: boolean) => void
}

/**
 * Cabeçalho da aplicação: marca, navegação principal e ações. Em telas
 * estreitas, a navegação vai para um painel aberto pelo botão de menu.
 */
export const AppHeader = forwardRef<HTMLElement, AppHeaderProps>(function AppHeader(
  {
    brand,
    items = [],
    currentHref,
    renderLink,
    actions,
    menuFooter,
    navLabel,
    sticky = false,
    collapseBelow = 'md',
    menuOpen: menuOpenProp,
    defaultMenuOpen = false,
    onMenuOpenChange,
    className,
    onKeyDown,
    ...rest
  },
  ref,
) {
  const { t } = useLocale()
  const navId = useId('or-app-header-nav')
  const headerRef = useRef<HTMLElement>(null)
  const menuButtonRef = useRef<HTMLButtonElement>(null)
  const [menuOpen, setMenuOpen] = useControllableState({
    value: menuOpenProp,
    defaultValue: defaultMenuOpen,
    onChange: onMenuOpenChange,
  })

  useClickOutside(headerRef, () => setMenuOpen(false), menuOpen)

  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    onKeyDown?.(event)
    if (event.defaultPrevented || event.key !== 'Escape' || !menuOpen) return
    setMenuOpen(false)
    menuButtonRef.current?.focus()
  }

  const hasNav = items.length > 0 || Boolean(menuFooter)

  return (
    <header
      ref={mergeRefs(ref, headerRef)}
      className={cx('or-app-header', sticky && 'or-app-header--sticky', className)}
      data-collapse={collapseBelow}
      data-menu-open={menuOpen || undefined}
      onKeyDown={handleKeyDown}
      {...rest}
    >
      <div className="or-app-header__bar">
        <div className="or-app-header__start">
          {hasNav && (
            <button
              ref={menuButtonRef}
              type="button"
              className="or-app-header__menu"
              aria-expanded={menuOpen}
              aria-controls={navId}
              aria-label={t('menu')}
              onClick={() => setMenuOpen((v) => !v)}
            >
              <Icon name={menuOpen ? 'close' : 'menu'} />
            </button>
          )}
          {brand && <div className="or-app-header__brand">{brand}</div>}
        </div>
        {hasNav && (
          <nav
            id={navId}
            className="or-app-header__nav"
            aria-label={navLabel ?? t('mainNavigation')}
            onClick={(event) => {
              if ((event.target as HTMLElement).closest('a[href]')) setMenuOpen(false)
            }}
          >
            <ul className="or-app-header__list">
              {items.map((item) => {
                const active = item.active ?? (currentHref !== undefined && item.href === currentHref)
                const linkProps = {
                  href: item.href,
                  className: 'or-app-header__link',
                  'aria-current': active ? ('page' as const) : undefined,
                  children: item.label,
                }
                return (
                  <li key={item.href} className="or-app-header__item">
                    {renderLink ? renderLink(linkProps) : <a {...linkProps} />}
                  </li>
                )
              })}
            </ul>
            {menuFooter && <div className="or-app-header__menu-footer">{menuFooter}</div>}
          </nav>
        )}
        {actions && <div className="or-app-header__actions">{actions}</div>}
      </div>
    </header>
  )
})
