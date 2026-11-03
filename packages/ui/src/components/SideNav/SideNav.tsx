import {
  Children,
  createContext,
  forwardRef,
  isValidElement,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type HTMLAttributes,
  type KeyboardEvent,
  type MouseEvent,
  type ReactElement,
  type ReactNode,
  type Ref,
} from 'react'
import { useClickOutside, useControllableState, useId } from '../../hooks'
import { Icon } from '../../icons'
import { useLocale } from '../../providers'
import { cx, mergeRefs } from '../../utils'
import type { RenderLink } from '../Link'
import './SideNav.css'

interface SideNavContextValue {
  collapsed: boolean
  currentHref?: string
  renderLink?: RenderLink
  level: number
  /** Itens dentro de uma lista renderizam `<li>`; em `header`/`footer`, não. */
  inList: boolean
}

const SideNavContext = createContext<SideNavContextValue>({ collapsed: false, level: 0, inList: false })

/* -------------------------------------------------------------------------- */
/* SideNav                                                                    */
/* -------------------------------------------------------------------------- */

type Slot = ReactNode | ((state: { collapsed: boolean }) => ReactNode)

export interface SideNavProps extends HTMLAttributes<HTMLElement> {
  /** Modo recolhido: só ícones (rótulos continuam acessíveis e aparecem no hover/foco). Controlado. */
  collapsed?: boolean
  /** Estado recolhido inicial (não controlado). */
  defaultCollapsed?: boolean
  /** Chamado quando o botão de recolher é acionado. */
  onCollapsedChange?: (collapsed: boolean) => void
  /** Mostra o botão "Recolher menu lateral" no rodapé. */
  collapsible?: boolean
  /** `href` da página atual: o item correspondente recebe `aria-current="page"`. */
  currentHref?: string
  /** Renderiza os links com o componente do seu roteador. */
  renderLink?: RenderLink
  /** Área superior (marca, seletor de workspace). Aceita função `({ collapsed }) => ReactNode`. */
  header?: Slot
  /** Área inferior (perfil, ajuda). Aceita função `({ collapsed }) => ReactNode`. */
  footer?: Slot
  children?: ReactNode
}

const renderSlot = (slot: Slot | undefined, collapsed: boolean) =>
  typeof slot === 'function' ? slot({ collapsed }) : slot

/**
 * Navegação lateral da aplicação: itens com ícone, grupos recolhíveis,
 * seções e modo recolhido (somente ícones).
 */
export const SideNav = forwardRef<HTMLElement, SideNavProps>(function SideNav(
  {
    collapsed: collapsedProp,
    defaultCollapsed = false,
    onCollapsedChange,
    collapsible = false,
    currentHref,
    renderLink,
    header,
    footer,
    className,
    children,
    'aria-label': ariaLabel,
    ...rest
  },
  ref,
) {
  const { t } = useLocale()
  const [collapsed, setCollapsed] = useControllableState({
    value: collapsedProp,
    defaultValue: defaultCollapsed,
    onChange: onCollapsedChange,
  })
  const ctx = useMemo<SideNavContextValue>(
    () => ({ collapsed, currentHref, renderLink, level: 0, inList: false }),
    [collapsed, currentHref, renderLink],
  )
  const listCtx = useMemo(() => ({ ...ctx, inList: true }), [ctx])
  const toggleLabel = collapsed ? t('expandSidebar') : t('collapseSidebar')

  return (
    <SideNavContext.Provider value={ctx}>
      <nav
        ref={ref}
        aria-label={ariaLabel ?? t('mainNavigation')}
        className={cx('or-side-nav', collapsed && 'or-side-nav--collapsed', className)}
        data-collapsed={collapsed || undefined}
        {...rest}
      >
        {header && <div className="or-side-nav__header">{renderSlot(header, collapsed)}</div>}
        <div className="or-side-nav__body">
          <SideNavContext.Provider value={listCtx}>
            <ul className="or-side-nav__list">{children}</ul>
          </SideNavContext.Provider>
        </div>
        {(footer || collapsible) && (
          <div className="or-side-nav__footer">
            {renderSlot(footer, collapsed)}
            {collapsible && (
              <button
                type="button"
                className="or-side-nav__item or-side-nav__collapse"
                data-level={0}
                onClick={() => setCollapsed((v) => !v)}
              >
                <span className="or-side-nav__icon" aria-hidden="true">
                  <Icon name={collapsed ? 'chevrons-right' : 'chevrons-left'} />
                </span>
                <span className="or-side-nav__label">{toggleLabel}</span>
              </button>
            )}
          </div>
        )}
      </nav>
    </SideNavContext.Provider>
  )
})

/* -------------------------------------------------------------------------- */
/* SideNavItem                                                                */
/* -------------------------------------------------------------------------- */

export interface SideNavItemProps extends Omit<HTMLAttributes<HTMLElement>, 'onClick'> {
  /** Destino. Sem `href`, o item é um botão (ex.: "Sair"). */
  href?: string
  /** Ícone decorativo. No modo recolhido, sem ícone, mostra a inicial do rótulo. */
  icon?: ReactNode
  /** Contador ou selo à direita (no modo recolhido vira um ponto). */
  badge?: ReactNode
  /** Marca o item como página atual. Padrão: `href === currentHref` do SideNav. */
  active?: boolean
  /** Desabilita o item. */
  disabled?: boolean
  onClick?: (event: MouseEvent<HTMLElement>) => void
  children: ReactNode
}

function isItemActive(props: { active?: boolean; href?: string }, currentHref?: string) {
  return props.active ?? (currentHref !== undefined && props.href !== undefined && props.href === currentHref)
}

/** Um destino da navegação lateral. */
export const SideNavItem = forwardRef<HTMLElement, SideNavItemProps>(function SideNavItem(
  { href, icon, badge, active, disabled = false, onClick, className, children, ...rest },
  ref,
) {
  const { collapsed, currentHref, renderLink, level, inList } = useContext(SideNavContext)
  const isActive = isItemActive({ active, href }, currentHref)
  const initial = typeof children === 'string' ? children.trim().charAt(0).toUpperCase() : undefined
  const showRail = collapsed && level === 0

  const content = (
    <>
      {icon ? (
        <span className="or-side-nav__icon" aria-hidden="true">
          {icon}
        </span>
      ) : (
        showRail &&
        initial && (
          <span className="or-side-nav__icon or-side-nav__initial" aria-hidden="true">
            {initial}
          </span>
        )
      )}
      <span className="or-side-nav__label">{children}</span>
      {badge !== undefined && badge !== null && badge !== false && <span className="or-side-nav__badge">{badge}</span>}
    </>
  )
  const common = {
    className: cx('or-side-nav__item', className),
    'aria-current': isActive ? ('page' as const) : undefined,
    'data-level': level,
    onClick,
  }

  let control: ReactNode
  if (href && !disabled) {
    const linkProps = { ...common, ...rest, href, children: content }
    control = renderLink ? (
      renderLink(linkProps as Parameters<RenderLink>[0])
    ) : (
      <a ref={ref as Ref<HTMLAnchorElement>} {...linkProps} />
    )
  } else if (href && disabled) {
    control = (
      <a ref={ref as Ref<HTMLAnchorElement>} {...common} {...rest} role="link" aria-disabled="true" onClick={undefined}>
        {content}
      </a>
    )
  } else {
    control = (
      <button ref={ref as Ref<HTMLButtonElement>} type="button" disabled={disabled} {...common} {...rest}>
        {content}
      </button>
    )
  }

  return inList ? <li className="or-side-nav__entry">{control}</li> : <>{control}</>
})

/* -------------------------------------------------------------------------- */
/* SideNavGroup                                                               */
/* -------------------------------------------------------------------------- */

export interface SideNavGroupProps extends Omit<HTMLAttributes<HTMLLIElement>, 'onToggle'> {
  /** Rótulo do grupo (texto do botão que abre/fecha). */
  label: ReactNode
  /** Ícone decorativo. */
  icon?: ReactNode
  /** Aberto (controlado). */
  open?: boolean
  /** Aberto inicialmente (não controlado). Padrão: aberto se contém o item atual. */
  defaultOpen?: boolean
  /** Chamado ao abrir/fechar. */
  onOpenChange?: (open: boolean) => void
  children?: ReactNode
}

function containsActive(children: ReactNode, currentHref?: string): boolean {
  return Children.toArray(children).some((child) => {
    if (!isValidElement(child)) return false
    const props = (child as ReactElement<{ active?: boolean; href?: string; children?: ReactNode }>).props
    return isItemActive(props, currentHref) || containsActive(props.children, currentHref)
  })
}

/**
 * Grupo recolhível de itens. O botão expõe `aria-expanded`/`aria-controls`.
 * No modo recolhido, os itens abrem em um painel ao lado.
 */
export const SideNavGroup = forwardRef<HTMLLIElement, SideNavGroupProps>(function SideNavGroup(
  { label, icon, open: openProp, defaultOpen, onOpenChange, className, children, onKeyDown, ...rest },
  ref,
) {
  const parent = useContext(SideNavContext)
  const { collapsed, currentHref, level } = parent
  const hasActive = containsActive(children, currentHref)
  const [open, setOpen] = useControllableState({
    value: openProp,
    defaultValue: defaultOpen ?? hasActive,
    onChange: onOpenChange,
  })
  const [flyoutOpen, setFlyoutOpen] = useState(false)
  const listId = useId('or-side-nav-group')
  const groupRef = useRef<HTMLLIElement>(null)
  const toggleRef = useRef<HTMLButtonElement>(null)
  const isFlyout = collapsed && level === 0
  const expanded = isFlyout ? flyoutOpen : open

  // Abre o grupo quando a página atual passa a estar dentro dele.
  useEffect(() => {
    if (hasActive && openProp === undefined) setOpen(true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasActive])

  useEffect(() => setFlyoutOpen(false), [collapsed])
  useClickOutside(groupRef, () => setFlyoutOpen(false), isFlyout && flyoutOpen)

  const childCtx = useMemo(() => ({ ...parent, level: level + 1, inList: true }), [parent, level])

  const handleKeyDown = (event: KeyboardEvent<HTMLLIElement>) => {
    onKeyDown?.(event)
    if (event.defaultPrevented || !isFlyout || !flyoutOpen || event.key !== 'Escape') return
    event.preventDefault()
    event.stopPropagation()
    setFlyoutOpen(false)
    toggleRef.current?.focus()
  }

  return (
    <li
      ref={mergeRefs(ref, groupRef)}
      className={cx('or-side-nav__entry', 'or-side-nav__group', className)}
      data-open={expanded || undefined}
      onKeyDown={handleKeyDown}
      {...rest}
    >
      <button
        ref={toggleRef}
        type="button"
        className="or-side-nav__item or-side-nav__toggle"
        aria-expanded={expanded}
        aria-controls={listId}
        data-level={level}
        data-active={hasActive || undefined}
        onClick={() => (isFlyout ? setFlyoutOpen((v) => !v) : setOpen((v) => !v))}
      >
        {icon && (
          <span className="or-side-nav__icon" aria-hidden="true">
            {icon}
          </span>
        )}
        <span className="or-side-nav__label">{label}</span>
        <Icon name="chevron-down" size="sm" className="or-side-nav__chevron" />
      </button>
      <div
        className="or-side-nav__panel"
        hidden={!expanded}
        onClick={(event) => {
          if (isFlyout && (event.target as HTMLElement).closest('a[href]')) setFlyoutOpen(false)
        }}
      >
        {isFlyout && (
          <p className="or-side-nav__panel-title" aria-hidden="true">
            {label}
          </p>
        )}
        <SideNavContext.Provider value={childCtx}>
          <ul id={listId} className="or-side-nav__sublist">
            {children}
          </ul>
        </SideNavContext.Provider>
      </div>
    </li>
  )
})

/* -------------------------------------------------------------------------- */
/* SideNavSection                                                             */
/* -------------------------------------------------------------------------- */

export interface SideNavSectionProps extends Omit<HTMLAttributes<HTMLLIElement>, 'title'> {
  /** Título da seção (rótulo da lista). No modo recolhido vira uma linha divisória. */
  title: ReactNode
  children?: ReactNode
}

/** Agrupa itens sob um título curto em caixa alta (ex.: "Configurações"). */
export const SideNavSection = forwardRef<HTMLLIElement, SideNavSectionProps>(function SideNavSection(
  { title, className, children, ...rest },
  ref,
) {
  const titleId = useId('or-side-nav-section')
  return (
    <li ref={ref} className={cx('or-side-nav__section', className)} {...rest}>
      <span id={titleId} className="or-side-nav__section-title">
        {title}
      </span>
      <ul className="or-side-nav__list" aria-labelledby={titleId}>
        {children}
      </ul>
    </li>
  )
})
