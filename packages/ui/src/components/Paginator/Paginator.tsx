import {
  forwardRef,
  useEffect,
  useRef,
  type HTMLAttributes,
  type ReactNode,
} from 'react'
import { useControllableState, useId } from '../../hooks'
import { Icon, type IconName } from '../../icons'
import { useLocale } from '../../providers'
import { clamp, cx, range } from '../../utils'
import type { RenderLink } from '../Link'
import { VisuallyHidden } from '../VisuallyHidden'
import './Paginator.css'

export type PaginatorVariant = 'default' | 'compact'
export type PaginatorSize = 'sm' | 'md'

export interface PaginatorProps extends Omit<HTMLAttributes<HTMLElement>, 'onChange'> {
  /** Página atual, começando em 1 (controlado). */
  page?: number
  /** Página inicial (não controlado). Padrão: 1. */
  defaultPage?: number
  /** Chamado quando a página muda. */
  onPageChange?: (page: number) => void
  /** Total de páginas. Opcional quando `totalItems` é informado. */
  totalPages?: number
  /** Total de itens. Habilita o texto "1–20 de 240" e o cálculo de páginas. */
  totalItems?: number
  /** Itens por página (controlado). */
  pageSize?: number
  /** Itens por página inicial (não controlado). Padrão: 20. */
  defaultPageSize?: number
  /** Chamado quando o usuário escolhe outra quantidade de itens por página. */
  onPageSizeChange?: (pageSize: number) => void
  /** Opções do seletor de itens por página. Sem opções, o seletor não aparece. */
  pageSizeOptions?: number[]
  /** Páginas mostradas de cada lado da atual. Padrão: 1. */
  siblingCount?: number
  /** Páginas sempre mostradas no início e no fim. Padrão: 1. */
  boundaryCount?: number
  /** Mostra os botões de primeira e última página. */
  showFirstLast?: boolean
  /** `default`: lista de páginas. `compact`: "Página 3 de 12" entre anterior/próximo. */
  variant?: PaginatorVariant
  /** Tamanho dos botões: `sm` 32px, `md` 40px. */
  size?: PaginatorSize
  /**
   * Gera o endereço de cada página — as páginas viram links (bom para SEO e
   * para abrir em nova aba). Sem ela, são botões.
   */
  getPageHref?: (page: number) => string
  /** Renderiza os links com o componente do seu roteador (requer `getPageHref`). */
  renderLink?: RenderLink
}

type PageItem = number | 'start-ellipsis' | 'end-ellipsis'

/** Calcula a sequência de páginas com reticências (mesma lógica do MUI). */
function getPageItems(page: number, count: number, siblingCount: number, boundaryCount: number): PageItem[] {
  const startPages = range(1, Math.min(boundaryCount, count))
  const endPages = range(Math.max(count - boundaryCount + 1, boundaryCount + 1), count)
  const siblingsStart = Math.max(
    Math.min(page - siblingCount, count - boundaryCount - siblingCount * 2 - 1),
    boundaryCount + 2,
  )
  const siblingsEnd = Math.min(
    Math.max(page + siblingCount, boundaryCount + siblingCount * 2 + 2),
    endPages.length > 0 ? endPages[0] - 2 : count - 1,
  )
  const items: (PageItem | null)[] = [
    ...startPages,
    siblingsStart > boundaryCount + 2
      ? 'start-ellipsis'
      : boundaryCount + 1 < count - boundaryCount
        ? boundaryCount + 1
        : null,
    ...range(siblingsStart, siblingsEnd),
    siblingsEnd < count - boundaryCount - 1
      ? 'end-ellipsis'
      : count - boundaryCount > boundaryCount
        ? count - boundaryCount
        : null,
    ...endPages,
  ]
  return items.filter((item): item is PageItem => item !== null)
}

/**
 * Paginação: divide resultados longos em páginas e permite navegar entre
 * elas. Variante `compact` para espaços estreitos e seletor opcional de
 * itens por página.
 */
export const Paginator = forwardRef<HTMLElement, PaginatorProps>(function Paginator(
  {
    page: pageProp,
    defaultPage = 1,
    onPageChange,
    totalPages,
    totalItems,
    pageSize: pageSizeProp,
    defaultPageSize = 20,
    onPageSizeChange,
    pageSizeOptions,
    siblingCount = 1,
    boundaryCount = 1,
    showFirstLast = false,
    variant = 'default',
    size = 'md',
    getPageHref,
    renderLink,
    className,
    'aria-label': ariaLabel,
    ...rest
  },
  ref,
) {
  const { t } = useLocale()
  const selectId = useId('or-paginator-size')
  const listRef = useRef<HTMLUListElement>(null)
  const focusCurrent = useRef(false)

  const [pageSize, setPageSize] = useControllableState({
    value: pageSizeProp,
    defaultValue: defaultPageSize,
    onChange: onPageSizeChange,
  })
  const count = Math.max(
    1,
    totalPages ?? (totalItems !== undefined ? Math.ceil(totalItems / Math.max(1, pageSize)) : 1),
  )
  const [rawPage, setPage] = useControllableState({ value: pageProp, defaultValue: defaultPage, onChange: onPageChange })
  const page = clamp(rawPage, 1, count)

  // Se o botão focado sumir (anterior/próximo desabilitado), o foco vai para a página atual.
  useEffect(() => {
    if (!focusCurrent.current) return
    focusCurrent.current = false
    const active = document.activeElement
    if (active && active !== document.body && !(active as HTMLButtonElement).disabled) return
    const list = listRef.current
    const fallback =
      list?.querySelector<HTMLElement>('[aria-current="page"]') ??
      list?.querySelector<HTMLElement>('button.or-paginator__button:not(:disabled), a.or-paginator__button[href]')
    fallback?.focus()
  }, [page])

  const goTo = (next: number) => {
    const target = clamp(next, 1, count)
    if (target === page) return
    if (target === 1 || target === count) focusCurrent.current = true
    setPage(target)
  }

  const renderControl = (opts: {
    key: string
    target: number
    label: string
    icon?: IconName
    text?: ReactNode
    disabled?: boolean
    current?: boolean
    className: string
  }) => {
    const { key, target, label, icon, text, disabled, current, className: itemClass } = opts
    // Páginas: o número é visível e o nome completo ("Página 3") vem de texto
    // oculto. Botões só com ícone usam aria-label.
    const content =
      text !== undefined ? (
        <>
          <span aria-hidden="true">{text}</span>
          <VisuallyHidden>{label}</VisuallyHidden>
        </>
      ) : (
        icon && <Icon name={icon} size="sm" />
      )
    const common = {
      className: cx('or-paginator__button', itemClass),
      'aria-label': text !== undefined ? undefined : label,
      'aria-current': current ? ('page' as const) : undefined,
    }
    let control: ReactNode
    if (getPageHref && !disabled) {
      const linkProps = {
        ...common,
        href: getPageHref(target),
        children: content,
        onClick: () => goTo(target),
      }
      control = renderLink ? renderLink(linkProps) : <a {...linkProps} />
    } else if (getPageHref && disabled) {
      control = (
        <a {...common} role="link" aria-disabled="true">
          {content}
        </a>
      )
    } else {
      control = (
        <button type="button" {...common} disabled={disabled} onClick={() => goTo(target)}>
          {content}
        </button>
      )
    }
    return (
      <li key={key} className="or-paginator__item">
        {control}
      </li>
    )
  }

  const isFirst = page <= 1
  const isLast = page >= count

  const edges = {
    first: showFirstLast
      ? renderControl({
          key: 'first',
          target: 1,
          label: t('firstPage'),
          icon: 'chevrons-left',
          disabled: isFirst,
          className: 'or-paginator__button--nav',
        })
      : null,
    prev: renderControl({
      key: 'prev',
      target: page - 1,
      label: t('previousPage'),
      icon: 'chevron-left',
      disabled: isFirst,
      className: 'or-paginator__button--nav',
    }),
    next: renderControl({
      key: 'next',
      target: page + 1,
      label: t('nextPage'),
      icon: 'chevron-right',
      disabled: isLast,
      className: 'or-paginator__button--nav',
    }),
    last: showFirstLast
      ? renderControl({
          key: 'last',
          target: count,
          label: t('lastPage'),
          icon: 'chevrons-right',
          disabled: isLast,
          className: 'or-paginator__button--nav',
        })
      : null,
  }

  const pages =
    variant === 'compact' ? (
      <li className="or-paginator__item or-paginator__status" aria-live="polite">
        {t('pageOf', { page, total: count })}
      </li>
    ) : (
      getPageItems(page, count, siblingCount, boundaryCount).map((item) =>
        typeof item === 'number' ? (
          renderControl({
            key: `page-${item}`,
            target: item,
            label: t('page', { page: item }),
            text: item,
            current: item === page,
            className: 'or-paginator__button--page',
          })
        ) : (
          <li key={item} className="or-paginator__item or-paginator__ellipsis" aria-hidden="true">
            …
          </li>
        ),
      )
    )

  const start = totalItems !== undefined ? Math.min((page - 1) * pageSize + 1, totalItems) : 0
  const end = totalItems !== undefined ? Math.min(page * pageSize, totalItems) : 0
  const showInfo = totalItems !== undefined || (pageSizeOptions && pageSizeOptions.length > 0)

  return (
    <nav
      ref={ref}
      aria-label={ariaLabel ?? t('pagination')}
      className={cx('or-paginator', `or-paginator--${variant}`, `or-paginator--${size}`, className)}
      {...rest}
    >
      {showInfo && (
        <div className="or-paginator__info">
          {totalItems !== undefined && (
            <span className="or-paginator__range" aria-live="polite">
              {t('itemRange', { start, end, total: totalItems })}
            </span>
          )}
          {pageSizeOptions && pageSizeOptions.length > 0 && (
            <span className="or-paginator__size">
              <label htmlFor={selectId}>{t('itemsPerPage')}</label>
              <select
                id={selectId}
                className={cx('or-control', 'or-control--sm', 'or-paginator__select')}
                value={pageSize}
                onChange={(event) => {
                  const nextSize = Number(event.target.value)
                  const firstItem = (page - 1) * pageSize
                  setPageSize(nextSize)
                  // Mantém visível o primeiro item da página atual.
                  setPage(Math.floor(firstItem / nextSize) + 1)
                }}
              >
                {pageSizeOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </span>
          )}
        </div>
      )}
      <ul ref={listRef} className="or-paginator__list">
        {edges.first}
        {edges.prev}
        {pages}
        {edges.next}
        {edges.last}
      </ul>
    </nav>
  )
})
