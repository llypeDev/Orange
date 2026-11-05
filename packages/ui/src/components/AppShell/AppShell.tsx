import {
  cloneElement,
  createContext,
  forwardRef,
  isValidElement,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  type HTMLAttributes,
  type MouseEvent,
  type ReactElement,
  type ReactNode,
  type Ref,
} from 'react'
import { useControllableState, useId, useIsomorphicLayoutEffect, useMediaQuery } from '../../hooks'
import { useLocale } from '../../providers'
import { composeEventHandlers, cx, mergeRefs } from '../../utils'
import { AppHeader } from '../AppHeader'
import { Drawer } from '../Drawer'
import { Footer } from '../Footer'
import { IconButton, type IconButtonProps } from '../IconButton'
import { SideNav, type SideNavProps } from '../SideNav'
import { SkipLink } from '../SkipLink'
import './AppShell.css'

export type AppShellBreakpoint = 'md' | 'lg'

/** Mesmos valores de `breakpoints` em `@orange/tokens` (md 768px, lg 1024px). */
const BREAKPOINTS: Record<AppShellBreakpoint, string> = { md: '768px', lg: '1024px' }

/** Estado da navegação, exposto por `useAppShell()`. */
export interface AppShellState {
  /** Painel de navegação aberto (telas abaixo do ponto de quebra). */
  navOpen: boolean
  setNavOpen: (open: boolean) => void
  /** Abre/fecha o painel (telas estreitas) ou recolhe/expande a barra lateral (telas largas). */
  toggleNav: () => void
  /** Barra lateral recolhida (telas a partir do ponto de quebra). */
  navCollapsed: boolean
  setNavCollapsed: (collapsed: boolean) => void
  /** `true` abaixo do ponto de quebra: a navegação vive no painel (Drawer). */
  isCompact: boolean
}

interface AppShellContextValue extends AppShellState {
  hasNavigation: boolean
  navId: string
  drawerId: string
}

const AppShellContext = createContext<AppShellContextValue | null>(null)

function useAppShellContext(component: string): AppShellContextValue {
  const ctx = useContext(AppShellContext)
  if (!ctx) throw new Error(`${component} precisa estar dentro de um <AppShell>.`)
  return ctx
}

/** Estado entregue ao `navigation` quando ele é uma função. */
export interface AppShellNavigationState {
  /** Barra lateral recolhida (sempre `false` dentro do painel). */
  collapsed: boolean
  /** A navegação está no painel (telas estreitas). */
  compact: boolean
}

export interface AppShellProps extends HTMLAttributes<HTMLDivElement> {
  /** Topo da página — normalmente um `AppHeader`. */
  header?: ReactNode
  /**
   * Navegação lateral — normalmente um `SideNav`, que passa a seguir o estado
   * recolhido do AppShell. Aceita uma função `({ collapsed, compact }) => ReactNode`.
   */
  navigation?: ReactNode | ((state: AppShellNavigationState) => ReactNode)
  /** Painel complementar à direita do conteúdo (empilha abaixo dele quando falta espaço). */
  aside?: ReactNode
  /** Rodapé — por exemplo, um `Footer`. */
  footer?: ReactNode
  /** Conteúdo principal (`<main>`). */
  children?: ReactNode
  /** Nome do landmark de navegação. Padrão: `t('mainNavigation')`. */
  navLabel?: string
  /** Nome do landmark complementar (`aside`). Padrão: `t('appShellAside')`. */
  asideLabel?: string
  /** Título do painel de navegação em telas estreitas. Padrão: `t('menu')`. */
  navTitle?: ReactNode
  /** `id` do `<main>` (destino do link de atalho). Padrão: gerado. */
  mainId?: string
  /** Renderiza o `SkipLink` "Pular para o conteúdo principal" como primeiro foco. */
  skipLink?: boolean
  /** Texto do link de atalho. Padrão: `t('skipToContent')`. */
  skipLinkLabel?: ReactNode
  /**
   * Largura da tela a partir da qual a navegação fica fixa ao lado do conteúdo
   * (`md` 768px, `lg` 1024px). Abaixo dela, vai para um painel (Drawer).
   */
  navBreakpoint?: AppShellBreakpoint
  /** Barra lateral recolhida (controlado). */
  navCollapsed?: boolean
  /** Barra lateral recolhida inicialmente (não controlado). */
  defaultNavCollapsed?: boolean
  /** Chamado quando a barra lateral é recolhida ou expandida. */
  onNavCollapsedChange?: (collapsed: boolean) => void
  /** Painel de navegação aberto em telas estreitas (controlado). */
  navOpen?: boolean
  /** Painel aberto inicialmente (não controlado). */
  defaultNavOpen?: boolean
  /** Chamado quando o painel abre ou fecha. */
  onNavOpenChange?: (open: boolean) => void
  /** Fixa o cabeçalho no topo durante a rolagem. */
  stickyHeader?: boolean
  /** Fixa a barra lateral (altura da tela, rolagem própria). */
  stickyNav?: boolean
  /**
   * Ocupa no mínimo a altura da tela e rola com a página. Com `false`, ocupa a
   * altura do contêiner pai e rola o conteúdo por dentro (útil em prévias e painéis).
   */
  fullHeight?: boolean
}

function isElementOfType<P>(node: ReactNode, type: unknown): node is ReactElement<P> {
  return isValidElement(node) && node.type === type
}

/**
 * Estrutura de página da aplicação: cabeçalho, navegação lateral recolhível
 * (painel em telas estreitas), conteúdo principal, painel complementar e
 * rodapé — com os landmarks e o link de atalho certos.
 */
export const AppShell = forwardRef<HTMLDivElement, AppShellProps>(function AppShell(
  {
    header,
    navigation,
    aside,
    footer,
    children,
    navLabel,
    asideLabel,
    navTitle,
    mainId,
    skipLink = true,
    skipLinkLabel,
    navBreakpoint = 'lg',
    navCollapsed: navCollapsedProp,
    defaultNavCollapsed = false,
    onNavCollapsedChange,
    navOpen: navOpenProp,
    defaultNavOpen = false,
    onNavOpenChange,
    stickyHeader = true,
    stickyNav = true,
    fullHeight = true,
    className,
    ...rest
  },
  ref,
) {
  const { t } = useLocale()
  const resolvedMainId = useId('or-app-shell-main', mainId)
  const navId = useId('or-app-shell-nav')
  const drawerId = useId('or-app-shell-drawer')
  const rootRef = useRef<HTMLDivElement>(null)
  const headerRef = useRef<HTMLElement>(null)

  // No servidor (sem matchMedia) assume tela larga; o CSS esconde a barra abaixo do ponto de quebra.
  const isWide = useMediaQuery(`(min-width: ${BREAKPOINTS[navBreakpoint]})`, true)
  const isCompact = !isWide

  const [navCollapsed, setNavCollapsed] = useControllableState({
    value: navCollapsedProp,
    defaultValue: defaultNavCollapsed,
    onChange: onNavCollapsedChange,
  })
  const [navOpen, setNavOpen] = useControllableState({
    value: navOpenProp,
    defaultValue: defaultNavOpen,
    onChange: onNavOpenChange,
  })

  // Ao passar para a tela larga, a navegação volta para a barra lateral: feche o painel.
  useEffect(() => {
    if (!isCompact && navOpen) setNavOpen(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isCompact])

  const hasNavigation = navigation !== undefined && navigation !== null && navigation !== false
  const hasHeader = header !== undefined && header !== null && header !== false

  const toggleNav = useCallback(() => {
    if (isCompact) setNavOpen((open) => !open)
    else setNavCollapsed((collapsed) => !collapsed)
  }, [isCompact, setNavOpen, setNavCollapsed])

  const ctx = useMemo<AppShellContextValue>(
    () => ({
      navOpen,
      setNavOpen,
      toggleNav,
      navCollapsed,
      setNavCollapsed,
      isCompact,
      hasNavigation,
      navId,
      drawerId,
    }),
    [navOpen, setNavOpen, toggleNav, navCollapsed, setNavCollapsed, isCompact, hasNavigation, navId, drawerId],
  )

  // A barra lateral fixa fica logo abaixo do cabeçalho: mede a altura real dele.
  useIsomorphicLayoutEffect(() => {
    const root = rootRef.current
    const headerNode = headerRef.current
    if (!root || !headerNode || typeof ResizeObserver === 'undefined') return
    const update = () => {
      if (headerNode.offsetHeight > 0) root.style.setProperty('--_header-height', `${headerNode.offsetHeight}px`)
    }
    update()
    const observer = new ResizeObserver(update)
    observer.observe(headerNode)
    return () => observer.disconnect()
  }, [hasHeader])

  const label = navLabel ?? t('mainNavigation')

  /**
   * Resolve o slot de navegação. Um `SideNav` já é um `<nav>` nomeado: o AppShell
   * não o envolve em outro landmark e sincroniza o modo recolhido com ele.
   */
  const resolveNavigation = (compact: boolean) => {
    const content =
      typeof navigation === 'function'
        ? navigation({ collapsed: compact ? false : navCollapsed, compact })
        : navigation
    if (!isElementOfType<SideNavProps>(content, SideNav)) return { landmark: true, node: content }
    const own = content.props
    const overrides: Partial<SideNavProps> = compact
      ? { collapsed: false, collapsible: false }
      : {
          collapsed: navCollapsed,
          onCollapsedChange: (next: boolean) => {
            own.onCollapsedChange?.(next)
            setNavCollapsed(next)
          },
        }
    return {
      landmark: false,
      node: cloneElement(content, { 'aria-label': own['aria-label'] ?? navLabel, ...overrides }),
    }
  }

  let sidebar: ReactNode = null
  if (hasNavigation && !isCompact) {
    const { landmark, node } = resolveNavigation(false)
    sidebar = landmark ? (
      <nav id={navId} className="or-app-shell__nav" aria-label={label}>
        {node}
      </nav>
    ) : (
      <div id={navId} className="or-app-shell__nav">
        {node}
      </div>
    )
  }

  const hasSidebar = sidebar !== null

  let drawer: ReactNode = null
  if (hasNavigation && isCompact) {
    const { landmark, node } = resolveNavigation(true)
    // Escolher um link fecha o painel (navegação de SPA não recarrega a página).
    const closeOnLink = (event: MouseEvent<HTMLDivElement>) => {
      if ((event.target as HTMLElement).closest('a[href]')) setNavOpen(false)
    }
    drawer = (
      <Drawer
        id={drawerId}
        open={navOpen}
        onOpenChange={setNavOpen}
        title={navTitle ?? t('menu')}
        placement="left"
        size="sm"
        className="or-app-shell__drawer"
      >
        {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions -- clique delegado fecha o painel ao escolher um link (Enter em um link também dispara click) */}
        <div className="or-app-shell__drawer-content" onClick={closeOnLink}>
          {landmark ? (
            <nav className="or-app-shell__drawer-nav" aria-label={label}>
              {node}
            </nav>
          ) : (
            node
          )}
        </div>
      </Drawer>
    )
  }

  // AppHeader e Footer já são <header>/<footer>: não aninhe landmarks iguais.
  const HeaderTag = isElementOfType(header, AppHeader) ? 'div' : 'header'
  const FooterTag = isElementOfType(footer, Footer) ? 'div' : 'footer'

  return (
    <AppShellContext.Provider value={ctx}>
      <div
        ref={mergeRefs(ref, rootRef)}
        className={cx(
          'or-app-shell',
          fullHeight ? 'or-app-shell--full-height' : 'or-app-shell--contained',
          stickyHeader && 'or-app-shell--sticky-header',
          stickyNav && 'or-app-shell--sticky-nav',
          className,
        )}
        data-breakpoint={navBreakpoint}
        data-compact={isCompact || undefined}
        data-has-nav={hasSidebar || undefined}
        data-collapsed={(hasSidebar && navCollapsed) || undefined}
        {...rest}
      >
        {skipLink && <SkipLink href={`#${resolvedMainId}`}>{skipLinkLabel}</SkipLink>}
        {hasHeader && (
          <HeaderTag ref={headerRef as Ref<HTMLDivElement>} className="or-app-shell__header">
            {header}
          </HeaderTag>
        )}
        <div className="or-app-shell__body">
          {sidebar}
          <div className="or-app-shell__content">
            <div className="or-app-shell__columns">
              <main id={resolvedMainId} tabIndex={-1} className="or-app-shell__main">
                {children}
              </main>
              {aside && (
                <aside className="or-app-shell__aside" aria-label={asideLabel ?? t('appShellAside')}>
                  {aside}
                </aside>
              )}
            </div>
            {footer && <FooterTag className="or-app-shell__footer">{footer}</FooterTag>}
          </div>
        </div>
        {drawer}
      </div>
    </AppShellContext.Provider>
  )
})

/** Estado e ações da navegação do `AppShell` mais próximo. */
export function useAppShell(): AppShellState {
  return useAppShellContext('useAppShell')
}

export interface AppShellNavToggleProps extends Omit<IconButtonProps, 'icon' | 'label'> {
  /** Ícone. Padrão: menu (telas estreitas) ou chevrons que giram (telas largas). */
  icon?: IconButtonProps['icon']
  /**
   * Nome acessível. Padrão: "Abrir navegação" (telas estreitas) ou
   * "Recolher/Expandir menu lateral" (telas largas).
   */
  label?: string
}

/**
 * Botão que abre o painel de navegação (telas estreitas) ou recolhe a barra
 * lateral (telas largas). Coloque-o onde quiser dentro do AppShell — em geral
 * na marca do `AppHeader`. Não renderiza nada sem `navigation`.
 */
export const AppShellNavToggle = forwardRef<HTMLButtonElement, AppShellNavToggleProps>(function AppShellNavToggle(
  { icon, label, className, onClick, ...rest },
  ref,
) {
  const { t } = useLocale()
  const shell = useAppShellContext('AppShellNavToggle')
  if (!shell.hasNavigation) return null
  const { isCompact, navOpen, navCollapsed } = shell
  const defaultLabel = isCompact ? t('appShellOpenNav') : navCollapsed ? t('expandSidebar') : t('collapseSidebar')
  return (
    <IconButton
      ref={ref}
      icon={icon ?? (isCompact ? 'menu' : 'chevrons-left')}
      label={label ?? defaultLabel}
      className={cx('or-app-shell__toggle', className)}
      data-mode={isCompact ? 'drawer' : 'collapse'}
      aria-expanded={isCompact ? navOpen : !navCollapsed}
      aria-controls={isCompact ? shell.drawerId : shell.navId}
      aria-haspopup={isCompact ? 'dialog' : undefined}
      onClick={composeEventHandlers(onClick, () => shell.toggleNav())}
      {...rest}
    />
  )
})
