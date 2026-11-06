import { forwardRef, useRef, type HTMLAttributes, type ReactNode } from 'react'
import { useControllableState } from '../../hooks'
import type { IconName } from '../../icons'
import { useLocale } from '../../providers'
import { composeEventHandlers, cx, mergeRefs } from '../../utils'
import type { RenderLink, RenderLinkProps } from '../Link'
import {
  NavigationMenuSubmenu,
  containsActive,
  hasContent,
  isLinkActive,
  renderIcon,
  useNavigationMenuController,
} from './internal'
import './NavigationMenu.css'

/** Um link dentro de um painel. */
export interface NavigationMenuLink {
  /** Texto do link (nome acessível). */
  label: ReactNode
  /** Destino. */
  href: string
  /** Linha de apoio abaixo do rótulo; vira a descrição acessível do link (`aria-describedby`). */
  description?: ReactNode
  /** Ícone decorativo: nome de um ícone do Orange ou um elemento. */
  icon?: IconName | ReactNode
  /** Marca o link como página atual. Padrão: `href === currentHref`. */
  active?: boolean
}

/** Grupo de links com título — uma coluna do painel (ex.: "Por setor"). */
export interface NavigationMenuGroup {
  /** Título curto do grupo (em caixa alta); rotula a lista. */
  label: ReactNode
  /** Links do grupo. */
  items: NavigationMenuLink[]
}

/** Item do primeiro nível que é um link. */
export interface NavigationMenuLinkItem {
  /** Texto do link. */
  label: ReactNode
  /** Destino. */
  href: string
  /** Ícone decorativo antes do rótulo: nome de um ícone do Orange ou um elemento. */
  icon?: IconName | ReactNode
  /** Marca o item como página atual. Padrão: `href === currentHref`. */
  active?: boolean
}

/** Item do primeiro nível que abre um painel com links. */
export interface NavigationMenuPanelItem {
  /** Identificador usado em `openItem`. Padrão: a posição do item (`'0'`, `'1'`…). */
  id?: string
  /** Texto do botão que abre o painel. */
  label: ReactNode
  /** Links do painel: soltos e/ou grupos com título (cada grupo vira uma coluna). */
  items: (NavigationMenuLink | NavigationMenuGroup)[]
  /** Texto curto no topo do painel, apresentando a seção. */
  description?: ReactNode
  /** Colunas do painel (1–4). Padrão: uma por grupo; links soltos, 1. */
  columns?: 1 | 2 | 3 | 4
}

export type NavigationMenuItem = NavigationMenuLinkItem | NavigationMenuPanelItem

export interface NavigationMenuProps extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
  /** Itens do primeiro nível: links ou botões que abrem um painel (`items`). */
  items: NavigationMenuItem[]
  /** `href` da página atual: o link correspondente recebe `aria-current="page"`. */
  currentHref?: string
  /** Renderiza os links com o componente do seu roteador. */
  renderLink?: RenderLink
  /** Painel aberto (controlado): o `id` do item, ou `null` para nenhum. */
  openItem?: string | null
  /** Painel aberto inicialmente (não controlado). Padrão: `null`. */
  defaultOpenItem?: string | null
  /** Chamado quando um painel abre (`id`) ou fecha (`null`). */
  onOpenItemChange?: (item: string | null) => void
}

/**
 * Navegação de site/aplicação com painéis de links (submenus e pequenos
 * mega-menus), no padrão "Disclosure Navigation Menu" do WAI-ARIA APG: uma
 * `<nav>` com lista; itens com painel são botões com `aria-expanded` que
 * mostram uma lista de links. Um painel aberto por vez; Esc, clique fora ou
 * foco fora fecham.
 */
export const NavigationMenu = forwardRef<HTMLElement, NavigationMenuProps>(function NavigationMenu(
  {
    items,
    currentHref,
    renderLink,
    openItem: openItemProp,
    defaultOpenItem = null,
    onOpenItemChange,
    className,
    onKeyDown,
    onFocus,
    onClick,
    'aria-label': ariaLabel,
    ...rest
  },
  ref,
) {
  const { t } = useLocale()
  const navRef = useRef<HTMLElement>(null)
  const listRef = useRef<HTMLUListElement>(null)
  const [openItem, setOpenItem] = useControllableState<string | null>({
    value: openItemProp,
    defaultValue: defaultOpenItem,
    onChange: onOpenItemChange,
  })
  const menu = useNavigationMenuController({
    openKey: openItem,
    setOpenKey: setOpenItem,
    rootRef: navRef,
    listRef,
    floating: true,
  })

  return (
    // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions -- setas/Home/End, foco e cliques delegados aos links e botões da navegação
    <nav
      ref={mergeRefs(ref, navRef)}
      aria-label={ariaLabel ?? t('mainNavigation')}
      className={cx('or-navigation-menu', className)}
      onKeyDown={composeEventHandlers(onKeyDown, menu.onKeyDown)}
      onFocus={composeEventHandlers(onFocus, menu.onFocus)}
      onClick={(event) => {
        onClick?.(event)
        // Sem checar defaultPrevented: links de roteador chamam preventDefault no clique.
        menu.onClick(event)
      }}
      {...rest}
    >
      <ul ref={listRef} className="or-navigation-menu__list">
        {items.map((item, index) => {
          if ('items' in item) {
            const key = item.id ?? String(index)
            const refs = menu.refsFor(key)
            return (
              <NavigationMenuSubmenu
                key={`panel:${key}`}
                label={item.label}
                entries={item.items}
                description={item.description}
                columns={item.columns}
                open={openItem === key}
                onToggle={() => menu.toggle(key)}
                active={containsActive(item.items, currentHref)}
                currentHref={currentHref}
                renderLink={renderLink}
                offset={4}
                className="or-navigation-menu__item"
                triggerClassName="or-navigation-menu__control"
                itemRef={refs.item}
                triggerRef={refs.trigger}
              />
            )
          }
          const linkProps: RenderLinkProps = {
            href: item.href,
            className: 'or-navigation-menu__control',
            'aria-current': isLinkActive(item, currentHref) ? 'page' : undefined,
            children: (
              <>
                {hasContent(item.icon) && (
                  <span className="or-navigation-menu__control-icon" aria-hidden="true">
                    {renderIcon(item.icon)}
                  </span>
                )}
                {item.label}
              </>
            ),
          }
          return (
            <li key={`link:${item.href}`} className="or-navigation-menu__item">
              {renderLink ? renderLink(linkProps) : <a {...linkProps} />}
            </li>
          )
        })}
      </ul>
    </nav>
  )
})
