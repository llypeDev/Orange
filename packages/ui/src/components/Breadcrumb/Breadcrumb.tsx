import {
  Children,
  createContext,
  forwardRef,
  isValidElement,
  useContext,
  useEffect,
  useRef,
  useState,
  type HTMLAttributes,
  type LiHTMLAttributes,
  type ReactElement,
  type ReactNode,
} from 'react'
import { Icon } from '../../icons'
import { useLocale } from '../../providers'
import { cx } from '../../utils'
import type { RenderLink } from '../Link'
import './Breadcrumb.css'

export interface BreadcrumbEntry {
  /** Texto do nível. */
  label: ReactNode
  /** Destino. O último item (página atual) dispensa `href`. */
  href?: string
  /** Ícone decorativo antes do rótulo (ex.: casa no primeiro nível). */
  icon?: ReactNode
}

interface ItemContextValue {
  isCurrent: boolean
  separator: ReactNode
  renderLink?: RenderLink
}

const ItemContext = createContext<ItemContextValue>({ isCurrent: false, separator: '/' })

export interface BreadcrumbItemProps extends LiHTMLAttributes<HTMLLIElement> {
  /** Destino do nível. Sem `href`, o item é renderizado como texto. */
  href?: string
  /** Ícone decorativo antes do rótulo. */
  icon?: ReactNode
  /** Força o estado de página atual. Padrão: o último item. */
  current?: boolean
  children?: ReactNode
}

/** Um nível da trilha. Use dentro de `Breadcrumb`. */
export const BreadcrumbItem = forwardRef<HTMLLIElement, BreadcrumbItemProps>(function BreadcrumbItem(
  { href, icon, current, className, children, ...rest },
  ref,
) {
  const ctx = useContext(ItemContext)
  const isCurrent = current ?? ctx.isCurrent
  const content = (
    <>
      {icon && (
        <span className="or-breadcrumb__icon" aria-hidden="true">
          {icon}
        </span>
      )}
      <span className="or-breadcrumb__label">{children}</span>
    </>
  )
  const linkProps = {
    href: href ?? '',
    className: 'or-breadcrumb__link',
    'aria-current': isCurrent ? ('page' as const) : undefined,
    children: content,
  }
  return (
    <li ref={ref} className={cx('or-breadcrumb__item', className)} {...rest}>
      <span className="or-breadcrumb__separator" aria-hidden="true">
        {ctx.separator}
      </span>
      {href ? (
        ctx.renderLink ? (
          ctx.renderLink(linkProps)
        ) : (
          <a {...linkProps} />
        )
      ) : (
        <span className="or-breadcrumb__text" aria-current={isCurrent ? 'page' : undefined}>
          {content}
        </span>
      )}
    </li>
  )
})

export interface BreadcrumbProps extends HTMLAttributes<HTMLElement> {
  /** Níveis da trilha, do mais geral à página atual. Alternativa a `children`. */
  items?: BreadcrumbEntry[]
  /** Elementos `BreadcrumbItem`. */
  children?: ReactNode
  /**
   * Número máximo de níveis visíveis. Acima disso, os níveis do meio são
   * recolhidos em um botão "…" que os expande.
   */
  maxItems?: number
  /** Níveis mantidos antes do "…" ao recolher. Padrão: 1. */
  itemsBeforeCollapse?: number
  /** Níveis mantidos depois do "…" ao recolher. Padrão: 2. */
  itemsAfterCollapse?: number
  /** Separador decorativo entre níveis. Padrão: `/`. */
  separator?: ReactNode
  /**
   * Renderiza os links com o componente do seu roteador:
   * `renderLink={({ href, ...p }) => <RouterLink to={href} {...p} />}`.
   */
  renderLink?: RenderLink
}

/**
 * Trilha de navegação: mostra onde a página está na hierarquia do site e
 * permite voltar a níveis anteriores.
 */
export const Breadcrumb = forwardRef<HTMLElement, BreadcrumbProps>(function Breadcrumb(
  {
    items,
    children,
    maxItems,
    itemsBeforeCollapse = 1,
    itemsAfterCollapse = 2,
    separator = '/',
    renderLink,
    className,
    'aria-label': ariaLabel,
    ...rest
  },
  ref,
) {
  const { t } = useLocale()
  const [expanded, setExpanded] = useState(false)
  const listRef = useRef<HTMLOListElement>(null)
  const focusAfterExpand = useRef(false)

  const elements: ReactElement[] = items
    ? items.map((item, i) => (
        <BreadcrumbItem key={i} href={item.href} icon={item.icon}>
          {item.label}
        </BreadcrumbItem>
      ))
    : (Children.toArray(children).filter(isValidElement) as ReactElement[])

  const total = elements.length
  const shouldCollapse =
    !expanded && maxItems !== undefined && total > maxItems && itemsBeforeCollapse + itemsAfterCollapse < total

  useEffect(() => {
    if (!expanded || !focusAfterExpand.current) return
    focusAfterExpand.current = false
    // Leva o foco ao primeiro nível revelado (o botão "…" deixou de existir).
    const list = listRef.current
    const revealed = list?.children[itemsBeforeCollapse]
    const target = revealed?.querySelector<HTMLElement>('a[href]') ?? list?.querySelector<HTMLElement>('a[href]')
    target?.focus()
  }, [expanded, itemsBeforeCollapse])

  const wrap = (element: ReactElement, index: number) => (
    <ItemContext.Provider
      key={element.key ?? index}
      value={{ isCurrent: index === total - 1, separator, renderLink }}
    >
      {element}
    </ItemContext.Provider>
  )

  let content: ReactNode
  if (shouldCollapse) {
    const before = elements.slice(0, itemsBeforeCollapse).map((el, i) => wrap(el, i))
    const afterStart = total - itemsAfterCollapse
    const after = elements.slice(afterStart).map((el, i) => wrap(el, afterStart + i))
    content = (
      <>
        {before}
        <li className="or-breadcrumb__item or-breadcrumb__item--collapsed">
          <span className="or-breadcrumb__separator" aria-hidden="true">
            {separator}
          </span>
          <button
            type="button"
            className="or-breadcrumb__expand"
            aria-label={t('showFullPath')}
            onClick={() => {
              focusAfterExpand.current = true
              setExpanded(true)
            }}
          >
            <Icon name="more-horizontal" size="sm" />
          </button>
        </li>
        {after}
      </>
    )
  } else {
    content = elements.map((el, i) => wrap(el, i))
  }

  return (
    <nav ref={ref} aria-label={ariaLabel ?? t('breadcrumb')} className={cx('or-breadcrumb', className)} {...rest}>
      <ol ref={listRef} className="or-breadcrumb__list">
        {content}
      </ol>
    </nav>
  )
})
