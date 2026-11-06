/*
 * Peças internas do NavigationMenu, compartilhadas com o AppHeader (submenus).
 * Não são exportadas pela biblioteca.
 *
 * Padrão "Disclosure Navigation Menu" do WAI-ARIA APG (não é o menu/menubar):
 * cada item com painel é um <button aria-expanded aria-controls> seguido, no
 * DOM, do painel com a lista de links. O painel fica montado (links visíveis
 * para buscadores e sem JS), recebe `hidden` quando fechado e `inert` durante
 * a saída. É posicionado com Floating UI no lugar (sem Portal), para que a
 * ordem de Tab siga o APG: botão → links do painel → próximo item.
 */
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type FocusEvent,
  type KeyboardEvent,
  type MouseEvent,
  type ReactNode,
  type RefCallback,
  type RefObject,
} from 'react'
import { useId, usePresence } from '../../hooks'
import { Icon, iconPaths, type IconName } from '../../icons'
import { cx, getFocusableElements, mergeRefs } from '../../utils'
import type { RenderLink, RenderLinkProps } from '../Link'
import { useLayer } from '../Modal/overlay'
import { useFloatingPanel } from '../Popover/floating'
import type { NavigationMenuGroup, NavigationMenuLink } from './NavigationMenu'
import './NavigationMenu.css'

/** Conteúdo de um painel: links soltos e/ou grupos com título. */
export type NavigationMenuEntry = NavigationMenuLink | NavigationMenuGroup

export const isGroup = (entry: NavigationMenuEntry): entry is NavigationMenuGroup =>
  !('href' in entry)

export function isLinkActive(link: { href: string; active?: boolean }, currentHref?: string) {
  return link.active ?? (currentHref !== undefined && link.href === currentHref)
}

/** `true` quando algum link do painel é a página atual. */
export function containsActive(entries: NavigationMenuEntry[], currentHref?: string): boolean {
  return entries.some((entry) =>
    isGroup(entry)
      ? entry.items.some((link) => isLinkActive(link, currentHref))
      : isLinkActive(entry, currentHref),
  )
}

export const hasContent = (node: ReactNode) =>
  node !== undefined && node !== null && node !== false && node !== ''

/** Nome de um ícone do Orange vira `<Icon>`; qualquer outro nó é usado como está. */
export function renderIcon(icon: IconName | ReactNode) {
  return typeof icon === 'string' && icon in iconPaths ? (
    <Icon name={icon as IconName} size="sm" />
  ) : (
    icon
  )
}

/* -------------------------------------------------------------------------- */
/* Conteúdo do painel                                                         */
/* -------------------------------------------------------------------------- */

interface PanelLinkProps {
  link: NavigationMenuLink
  id: string
  currentHref?: string
  renderLink?: RenderLink
}

/**
 * Um link do painel. O link cobre o item inteiro (`::before`), então rótulo,
 * descrição e ícone são uma única área clicável; o nome acessível é só o
 * rótulo e a descrição entra como `aria-describedby`.
 */
function PanelLink({ link, id, currentHref, renderLink }: PanelLinkProps) {
  const active = isLinkActive(link, currentHref)
  const withIcon = hasContent(link.icon)
  const descriptionId = hasContent(link.description) ? `${id}-description` : undefined
  const linkProps: RenderLinkProps = {
    href: link.href,
    className: 'or-navigation-menu__link',
    'aria-current': active ? 'page' : undefined,
    'aria-describedby': descriptionId,
    children: link.label,
  }
  return (
    <li className={cx('or-navigation-menu__entry', withIcon && 'or-navigation-menu__entry--icon')}>
      {withIcon && (
        <span className="or-navigation-menu__icon" aria-hidden="true">
          {renderIcon(link.icon)}
        </span>
      )}
      {renderLink ? renderLink(linkProps) : <a {...linkProps} />}
      {descriptionId && (
        <span id={descriptionId} className="or-navigation-menu__description">
          {link.description}
        </span>
      )}
    </li>
  )
}

interface PanelContentProps {
  entries: NavigationMenuEntry[]
  description?: ReactNode
  columns?: number
  currentHref?: string
  renderLink?: RenderLink
  idPrefix: string
}

/**
 * Links soltos viram uma lista em `columns` colunas; com grupos, cada grupo
 * (título + lista rotulada por ele) ocupa uma coluna. Links soltos entre
 * grupos formam um grupo sem título.
 */
function PanelContent({
  entries,
  description,
  columns,
  currentHref,
  renderLink,
  idPrefix,
}: PanelContentProps) {
  const grouped = entries.some(isGroup)
  const sections: { label?: ReactNode; links: NavigationMenuLink[] }[] = []
  for (const entry of entries) {
    if (isGroup(entry)) {
      sections.push({ label: entry.label, links: entry.items })
      continue
    }
    const last = sections[sections.length - 1]
    if (last && !hasContent(last.label)) last.links.push(entry)
    else sections.push({ links: [entry] })
  }
  const count = Math.min(4, Math.max(1, Math.round(columns ?? (grouped ? sections.length : 1))))

  const renderLinks = (links: NavigationMenuLink[], sectionIndex: number) =>
    links.map((link, index) => (
      <PanelLink
        key={`${index}-${link.href}`}
        link={link}
        id={`${idPrefix}-${sectionIndex}-${index}`}
        currentHref={currentHref}
        renderLink={renderLink}
      />
    ))

  return (
    <div
      className="or-navigation-menu__content"
      data-layout={grouped ? 'groups' : 'list'}
      style={{ '--_columns': count } as CSSProperties}
    >
      {hasContent(description) && <p className="or-navigation-menu__intro">{description}</p>}
      {grouped ? (
        sections.map((section, index) => {
          const labelId = hasContent(section.label) ? `${idPrefix}-${index}-label` : undefined
          return (
            <div key={index} className="or-navigation-menu__group">
              {labelId && (
                <span id={labelId} className="or-navigation-menu__group-label">
                  {section.label}
                </span>
              )}
              <ul className="or-navigation-menu__links" aria-labelledby={labelId}>
                {renderLinks(section.links, index)}
              </ul>
            </div>
          )
        })
      ) : (
        <ul className="or-navigation-menu__links">{renderLinks(sections[0]?.links ?? [], 0)}</ul>
      )}
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* Item com painel                                                            */
/* -------------------------------------------------------------------------- */

export interface NavigationMenuSubmenuProps {
  label: ReactNode
  entries: NavigationMenuEntry[]
  description?: ReactNode
  columns?: number
  open: boolean
  onToggle: () => void
  /** O painel contém a página atual (`data-active` no botão). */
  active: boolean
  currentHref?: string
  renderLink?: RenderLink
  /** Distância entre o botão e o painel, em px. */
  offset: number
  /** Classes do `<li>`, do botão e (extra) do painel. */
  className: string
  triggerClassName: string
  panelClassName?: string
  style?: CSSProperties
  itemRef: RefCallback<HTMLLIElement>
  triggerRef: RefCallback<HTMLButtonElement>
}

/** `<li>` com o botão de divulgação e o painel logo depois dele. */
export function NavigationMenuSubmenu({
  label,
  entries,
  description,
  columns,
  open,
  onToggle,
  active,
  currentHref,
  renderLink,
  offset,
  className,
  triggerClassName,
  panelClassName,
  style,
  itemRef,
  triggerRef,
}: NavigationMenuSubmenuProps) {
  const id = useId('or-navigation-menu')
  const panelId = `${id}-panel`
  const [triggerEl, setTriggerEl] = useState<HTMLButtonElement | null>(null)
  const [panelEl, setPanelEl] = useState<HTMLDivElement | null>(null)
  // Painel continua visível durante a animação de saída.
  const { present, state, nodeRef } = usePresence<HTMLDivElement>(open)
  const floating = useFloatingPanel({
    open: present,
    reference: triggerEl,
    floating: panelEl,
    placement: 'bottom-start',
    offset,
  })
  const buttonRef = useMemo(
    () => mergeRefs<HTMLButtonElement>(setTriggerEl, triggerRef),
    [triggerRef],
  )
  const panelRef = useMemo(() => mergeRefs<HTMLDivElement>(setPanelEl, nodeRef), [nodeRef])

  return (
    <li ref={itemRef} className={className} style={style}>
      <button
        ref={buttonRef}
        type="button"
        className={triggerClassName}
        aria-expanded={open}
        aria-controls={panelId}
        data-active={active || undefined}
        onClick={onToggle}
      >
        {label}
        <Icon name="chevron-down" size="sm" className="or-navigation-menu__chevron" />
      </button>
      <div
        ref={panelRef}
        id={panelId}
        className={cx('or-floating', 'or-navigation-menu__panel', panelClassName)}
        data-nav-panel=""
        data-state={state}
        data-side={floating.side}
        hidden={!present}
        inert={state === 'closed' || undefined}
        // Só left/top: com `position: static` (menu móvel do AppHeader) eles não valem.
        style={{ left: floating.x, top: floating.y }}
      >
        {/* Invólucro único: no menu móvel a altura anima com grid-template-rows 0fr → 1fr. */}
        <div className="or-navigation-menu__panel-inner">
          <PanelContent
            entries={entries}
            description={description}
            columns={columns}
            currentHref={currentHref}
            renderLink={renderLink}
            idPrefix={id}
          />
        </div>
      </div>
    </li>
  )
}

/* -------------------------------------------------------------------------- */
/* Comportamento                                                              */
/* -------------------------------------------------------------------------- */

const panelOf = (trigger: HTMLElement | null | undefined) =>
  trigger?.parentElement?.querySelector<HTMLElement>(':scope > [data-nav-panel]') ?? null

const linksIn = (panel: HTMLElement | null) =>
  panel ? Array.from(panel.querySelectorAll<HTMLElement>('a[href]')) : []

export interface NavigationMenuControllerOptions {
  /** Chave do painel aberto (`null`: nenhum). */
  openKey: string | null
  setOpenKey: (key: string | null) => void
  /** Raiz da navegação (`<nav>`): cliques e foco dentro dela não fecham pelo "fora". */
  rootRef: RefObject<HTMLElement | null>
  /** Lista do primeiro nível (`<ul>`): os filhos `<li>` são os itens. */
  listRef: RefObject<HTMLElement | null>
  /**
   * Painéis flutuantes: Esc, clique fora e foco fora (ou em outro item)
   * fecham. Falso no menu móvel do AppHeader, onde as seções ficam no fluxo.
   */
  floating: boolean
}

/**
 * Estado e teclado da navegação por divulgação: um painel aberto por vez,
 * Esc fecha e devolve o foco ao botão, clique/foco fora fecha, e as setas
 * opcionais do APG (←/→ entre itens, ↓ para dentro do painel aberto, ↑/↓
 * entre os links, Home/End).
 */
export function useNavigationMenuController({
  openKey,
  setOpenKey,
  rootRef,
  listRef,
  floating,
}: NavigationMenuControllerOptions) {
  const items = useRef(new Map<string, HTMLLIElement>())
  const triggers = useRef(new Map<string, HTMLButtonElement>())
  const refCache = useRef(
    new Map<
      string,
      { item: RefCallback<HTMLLIElement>; trigger: RefCallback<HTMLButtonElement> }
    >(),
  )
  const openKeyRef = useRef(openKey)
  openKeyRef.current = openKey
  const floatingRef = useRef(floating)
  floatingRef.current = floating

  /** Refs estáveis por chave (evita desmontar/remontar refs a cada render). */
  const refsFor = useCallback((key: string) => {
    let refs = refCache.current.get(key)
    if (!refs) {
      refs = {
        item: (el) => {
          if (el) items.current.set(key, el)
          else items.current.delete(key)
        },
        trigger: (el) => {
          if (el) triggers.current.set(key, el)
          else triggers.current.delete(key)
        },
      }
      refCache.current.set(key, refs)
    }
    return refs
  }, [])

  /**
   * Fecha o painel aberto. Com o foco dentro dele (ex.: link escolhido numa
   * SPA), ou com `focusTrigger`, o foco volta para o botão.
   */
  const close = useCallback(
    (focusTrigger = false) => {
      const key = openKeyRef.current
      if (key === null) return
      const trigger = triggers.current.get(key)
      const panel = panelOf(trigger)
      const current = document.activeElement
      const focusInside = !!panel && !!current && panel.contains(current)
      setOpenKey(null)
      if ((focusTrigger || focusInside) && trigger?.isConnected)
        trigger.focus({ preventScroll: true })
    },
    [setOpenKey],
  )

  const toggle = useCallback(
    (key: string) => setOpenKey(openKeyRef.current === key ? null : key),
    [setOpenKey],
  )

  const dismiss = () => {
    if (floatingRef.current && openKeyRef.current !== null) setOpenKey(null)
  }

  // Esc no documento (funciona mesmo sem foco no botão, ex.: Safari após clique).
  // Seções no fluxo (menu móvel do AppHeader) não são camada: lá o Esc é do menu.
  useLayer(openKey !== null && floating, {
    onEscape: () => close(true),
    onPointerDownOutside: dismiss,
    onFocusOutside: dismiss,
    insideElements: () => [rootRef.current],
  })

  // Fechado por fora (estado controlado) com o foco no painel: devolve ao botão.
  useEffect(() => {
    if (openKey === null) return
    const trigger = triggers.current.get(openKey)
    return () => {
      const panel = panelOf(trigger)
      const current = document.activeElement
      if (panel && current && panel.contains(current) && trigger?.isConnected)
        trigger.focus({ preventScroll: true })
    }
  }, [openKey])

  /** Foco foi para outro item da navegação: o painel aberto fecha. */
  const onFocus = useCallback(
    (event: FocusEvent<HTMLElement>) => {
      const key = openKeyRef.current
      if (key === null || !floatingRef.current) return
      const item = items.current.get(key)
      if (item && !item.contains(event.target as Node)) setOpenKey(null)
    },
    [setOpenKey],
  )

  /** Escolher um link do painel fecha o painel. */
  const onClick = useCallback(
    (event: MouseEvent<HTMLElement>) => {
      if (openKeyRef.current === null) return
      if ((event.target as HTMLElement).closest('[data-nav-panel] a[href]')) close()
    },
    [close],
  )

  const onKeyDown = useCallback(
    (event: KeyboardEvent<HTMLElement>) => {
      if (
        event.defaultPrevented ||
        event.altKey ||
        event.ctrlKey ||
        event.metaKey ||
        event.shiftKey
      )
        return
      const list = listRef.current
      if (!list) return
      const target = event.target as HTMLElement
      const tops = Array.from(list.children)
        .map((li) => getFocusableElements(li as HTMLElement)[0])
        .filter((el): el is HTMLElement => Boolean(el))
      const index = tops.indexOf(target)
      let next: HTMLElement | undefined
      if (index >= 0) {
        // Primeiro nível: botões e links.
        switch (event.key) {
          case 'ArrowRight':
            next = tops[index + 1]
            break
          case 'ArrowLeft':
          case 'ArrowUp':
            next = tops[index - 1]
            break
          case 'ArrowDown':
            next =
              target.getAttribute('aria-expanded') === 'true'
                ? linksIn(panelOf(target))[0]
                : tops[index + 1]
            break
          case 'Home':
            next = tops[0]
            break
          case 'End':
            next = tops[tops.length - 1]
            break
          default:
            return
        }
      } else {
        // Dentro de um painel aberto: entre os links dele, sem dar a volta.
        const panel = target.closest<HTMLElement>('[data-nav-panel]')
        if (!panel || !list.contains(panel)) return
        const links = linksIn(panel)
        const position = links.indexOf(target)
        if (position < 0) return
        switch (event.key) {
          case 'ArrowDown':
          case 'ArrowRight':
            next = links[position + 1]
            break
          case 'ArrowUp':
          case 'ArrowLeft':
            next = links[position - 1]
            break
          case 'Home':
            next = links[0]
            break
          case 'End':
            next = links[links.length - 1]
            break
          default:
            return
        }
      }
      event.preventDefault()
      next?.focus()
    },
    [listRef],
  )

  return { refsFor, toggle, close, onFocus, onClick, onKeyDown }
}
