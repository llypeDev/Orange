import {
  forwardRef,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type FocusEvent,
  type HTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
} from 'react'
import { useClickOutside, useControllableState, useId, usePresence, useScrollDirection } from '../../hooks'
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
   * Esconde o cabeçalho ao rolar a página para baixo (depois de 120px) e o
   * mostra de novo ao rolar para cima. Implica `sticky`. Nunca esconde com o
   * foco dentro do cabeçalho ou com o menu aberto.
   */
  hideOnScroll?: boolean
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
    hideOnScroll = false,
    collapseBelow = 'md',
    menuOpen: menuOpenProp,
    defaultMenuOpen = false,
    onMenuOpenChange,
    className,
    onKeyDown,
    onFocus,
    onBlur,
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

  // Painel móvel com entrada e saída animadas: continua montado até a saída terminar.
  const panel = usePresence<HTMLElement>(menuOpen)

  // O ícone do botão de menu só anima depois da primeira troca (não ao montar).
  const [prevMenuOpen, setPrevMenuOpen] = useState(menuOpen)
  const [iconMotion, setIconMotion] = useState(false)
  if (prevMenuOpen !== menuOpen) {
    setPrevMenuOpen(menuOpen)
    setIconMotion(true)
  }

  // Esconder ao rolar: nunca com foco dentro do cabeçalho ou com o menu aberto.
  const [scrolledDown, setScrolledDown] = useState(false)
  const [focusWithin, setFocusWithin] = useState(false)
  const scrollHidden = hideOnScroll && scrolledDown && !focusWithin && !menuOpen

  const handleFocus = (event: FocusEvent<HTMLElement>) => {
    onFocus?.(event)
    setFocusWithin(true)
  }
  const handleBlur = (event: FocusEvent<HTMLElement>) => {
    onBlur?.(event)
    const next = event.relatedTarget as Node | null
    if (!next || !event.currentTarget.contains(next)) setFocusWithin(false)
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    onKeyDown?.(event)
    if (event.defaultPrevented || event.key !== 'Escape' || !menuOpen) return
    setMenuOpen(false)
    menuButtonRef.current?.focus()
  }

  const hasNav = items.length > 0 || Boolean(menuFooter)

  return (
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions -- onKeyDown delegado trata Escape do painel móvel
    <header
      ref={mergeRefs(ref, headerRef)}
      className={cx(
        'or-app-header',
        (sticky || hideOnScroll) && 'or-app-header--sticky',
        hideOnScroll && 'or-app-header--hide-on-scroll',
        className,
      )}
      data-collapse={collapseBelow}
      data-menu-open={menuOpen || undefined}
      data-menu-present={panel.present || undefined}
      data-scroll-hidden={scrollHidden || undefined}
      onKeyDown={handleKeyDown}
      onFocus={handleFocus}
      onBlur={handleBlur}
      {...rest}
    >
      {hideOnScroll && <ScrollWatcher onChange={setScrolledDown} />}
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
              <span
                key={menuOpen ? 'close' : 'menu'}
                className={cx('or-app-header__menu-icon', iconMotion && 'or-app-header__menu-icon--enter')}
              >
                <Icon name={menuOpen ? 'close' : 'menu'} />
              </span>
            </button>
          )}
          {brand && <div className="or-app-header__brand">{brand}</div>}
        </div>
        {hasNav && (
          // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions -- clique delegado fecha o painel ao escolher um link nativo
          <nav
            ref={panel.nodeRef}
            id={navId}
            className="or-app-header__nav"
            data-state={panel.state}
            aria-label={navLabel ?? t('mainNavigation')}
            onClick={(event) => {
              if ((event.target as HTMLElement).closest('a[href]')) setMenuOpen(false)
            }}
          >
            <ul className="or-app-header__list">
              {items.map((item, index) => {
                const active = item.active ?? (currentHref !== undefined && item.href === currentHref)
                const linkProps = {
                  href: item.href,
                  className: 'or-app-header__link',
                  'aria-current': active ? ('page' as const) : undefined,
                  children: item.label,
                }
                return (
                  <li key={item.href} className="or-app-header__item" style={{ '--_i': index } as CSSProperties}>
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

/** Observa a direção da rolagem só quando `hideOnScroll` está ligado (evita re-renderizar o cabeçalho). */
function ScrollWatcher({ onChange }: { onChange: (scrolledDown: boolean) => void }) {
  const { direction, pastThreshold } = useScrollDirection()
  const down = direction === 'down' && pastThreshold
  useEffect(() => onChange(down), [down, onChange])
  return null
}
