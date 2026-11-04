import {
  forwardRef,
  useEffect,
  useRef,
  useState,
  type HTMLAttributes,
  type MouseEvent,
  type ReactNode,
  type RefObject,
} from 'react'
import { useId } from '../../hooks'
import { useLocale } from '../../providers'
import { canUseDOM, cx } from '../../utils'
import { useSlidingIndicator } from '../Tabs/useSlidingIndicator'
import './TableOfContents.css'

export interface TableOfContentsItem {
  /** Id do título de destino (sem `#`). */
  id: string
  /** Texto exibido no índice. */
  label: ReactNode
  /** Nível do título (2 para `h2`, 3 para `h3`…). Define a indentação. */
  level?: number
}

type ContainerTarget = HTMLElement | null | RefObject<HTMLElement | null>

export interface TableOfContentsProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  /** Itens do índice. Alternativa a `container`. */
  items?: TableOfContentsItem[]
  /**
   * Contêiner de onde os títulos são coletados automaticamente (quando
   * `items` não é informado). Títulos sem `id` recebem um gerado do texto.
   */
  container?: ContainerTarget
  /** Seletor dos títulos coletados. Padrão: `h2, h3`. */
  headingSelector?: string
  /** Título visível acima da lista. Padrão: `t('tableOfContents')`. `null` esconde (o nome continua no `aria-label`). */
  title?: ReactNode
  /**
   * Margem do IntersectionObserver: a faixa da tela em que uma seção conta
   * como "visível". Padrão: `'-80px 0px -65% 0px'` (terço superior).
   */
  rootMargin?: string
  /**
   * Contêiner rolável usado como raiz do IntersectionObserver. Padrão: a
   * janela. Informe quando o conteúdo rola dentro de um painel.
   */
  root?: ContainerTarget
  /** Chamado ao clicar em um item. */
  onItemClick?: (id: string, event: MouseEvent<HTMLAnchorElement>) => void
}

function resolveContainer(target: ContainerTarget | undefined): HTMLElement | null {
  if (!target) return null
  return 'current' in target ? target.current : target
}

function slugify(text: string) {
  return text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

function collectHeadings(root: HTMLElement, selector: string): TableOfContentsItem[] {
  const used = new Set<string>()
  return Array.from(root.querySelectorAll<HTMLElement>(selector)).map((heading) => {
    if (!heading.id) {
      const base = slugify(heading.textContent ?? '') || 'secao'
      let id = base
      let n = 2
      while (used.has(id) || document.getElementById(id)) id = `${base}-${n++}`
      heading.id = id
    }
    used.add(heading.id)
    const level = /^H([1-6])$/.exec(heading.tagName)?.[1]
    return { id: heading.id, label: heading.textContent ?? '', level: level ? Number(level) : 2 }
  })
}

/**
 * Índice "Nesta página": lista as seções da página e destaca a que está
 * visível enquanto a pessoa rola.
 */
export const TableOfContents = forwardRef<HTMLElement, TableOfContentsProps>(
  function TableOfContents(
    {
      items: itemsProp,
      container,
      headingSelector = 'h2, h3',
      title,
      rootMargin = '-80px 0px -65% 0px',
      root,
      onItemClick,
      className,
      'aria-label': ariaLabel,
      ...rest
    },
    ref,
  ) {
    const { t } = useLocale()
    const titleId = useId('or-toc-title')
    const [collected, setCollected] = useState<TableOfContentsItem[]>([])
    const [activeId, setActiveId] = useState<string>()
    const items = itemsProp ?? collected

    // Coleta automática dos títulos do contêiner (e atualiza se o conteúdo mudar).
    useEffect(() => {
      if (itemsProp) return
      const root = resolveContainer(container)
      if (!root) return
      const signature = (list: TableOfContentsItem[]) =>
        list.map((i) => `${i.id}:${i.level}:${i.label}`).join('|')
      const update = () => {
        const next = collectHeadings(root, headingSelector)
        // Evita re-render (e laços com o MutationObserver) quando nada mudou.
        setCollected((prev) => (signature(prev) === signature(next) ? prev : next))
      }
      update()
      if (typeof MutationObserver === 'undefined') return
      const mo = new MutationObserver(update)
      mo.observe(root, { childList: true, subtree: true })
      return () => mo.disconnect()
    }, [itemsProp, container, headingSelector])

    const idsKey = items.map((item) => item.id).join('|')

    // Destaca a seção visível.
    useEffect(() => {
      if (!canUseDOM || typeof IntersectionObserver === 'undefined') return
      const ids = idsKey ? idsKey.split('|') : []
      const elements = ids
        .map((id) => document.getElementById(id))
        .filter((el): el is HTMLElement => !!el)
      if (elements.length === 0) return
      const visible = new Set<string>()
      const io = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) visible.add(entry.target.id)
            else visible.delete(entry.target.id)
          }
          // A primeira seção (na ordem do documento) dentro da faixa vence.
          const first = ids.find((id) => visible.has(id))
          if (first) setActiveId(first)
        },
        { rootMargin, root: resolveContainer(root) },
      )
      elements.forEach((el) => io.observe(el))
      return () => io.disconnect()
    }, [idsKey, rootMargin, root])

    const handleClick = (id: string) => (event: MouseEvent<HTMLAnchorElement>) => {
      onItemClick?.(id, event)
      if (!event.defaultPrevented) setActiveId(id)
    }

    const minLevel = items.reduce((min, item) => Math.min(min, item.level ?? 2), Infinity)
    const showTitle = title !== null
    const labelled = showTitle && !ariaLabel

    // Marcador único que desliza até a seção visível.
    const trackRef = useRef<HTMLDivElement>(null)
    const marker = useSlidingIndicator(
      trackRef,
      '[aria-current="location"]',
      'y',
      `${activeId}|${idsKey}`,
    )

    if (items.length === 0) return null

    return (
      <nav
        ref={ref}
        className={cx('or-toc', className)}
        aria-label={labelled ? undefined : (ariaLabel ?? t('tableOfContents'))}
        aria-labelledby={labelled ? titleId : undefined}
        {...rest}
      >
        {showTitle && (
          <p id={titleId} className="or-toc__title">
            {title ?? t('tableOfContents')}
          </p>
        )}
        <div
          ref={trackRef}
          className="or-toc__track"
          data-marker={marker.ready ? 'ready' : undefined}
        >
          <span
            className="or-toc__marker"
            aria-hidden="true"
            data-visible={marker.visible || undefined}
            data-ready={marker.ready || undefined}
            style={marker.style}
          />
          <ul className="or-toc__list">
            {items.map((item) => {
              const depth = Math.max(
                0,
                (item.level ?? 2) - (Number.isFinite(minLevel) ? minLevel : 2),
              )
              return (
                <li key={item.id} className="or-toc__item" data-depth={depth}>
                  <a
                    href={`#${item.id}`}
                    className="or-toc__link"
                    aria-current={activeId === item.id ? 'location' : undefined}
                    onClick={handleClick(item.id)}
                  >
                    {item.label}
                  </a>
                </li>
              )
            })}
          </ul>
        </div>
      </nav>
    )
  },
)
