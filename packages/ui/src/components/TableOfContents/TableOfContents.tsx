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
   * Faixa da área visível em que um título conta como "na tela", no formato do
   * `rootMargin` do IntersectionObserver (px ou %). Padrão: `'-80px 0px -65% 0px'`
   * (terço superior). No fim da rolagem, a última seção à vista fica ativa mesmo
   * que o título não alcance a faixa.
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

/** Margens de topo e base (px) de um `rootMargin` (1 a 4 valores, px ou %). */
function verticalMargins(margin: string, height: number): [number, number] {
  const parts = margin.trim().split(/\s+/)
  const toPx = (value = '0px') => {
    const n = Number.parseFloat(value)
    if (!Number.isFinite(n)) return 0
    return value.endsWith('%') ? (n / 100) * height : n
  }
  return [toPx(parts[0]), toPx(parts.length > 2 ? parts[2] : parts[0])]
}

/**
 * Seção ativa pela geometria atual dos títulos. Não dá para depender só dos
 * eventos do IntersectionObserver: um título que atravessa a faixa entre dois
 * quadros (rolagem rápida, Home/End, salto por âncora) não gera evento, e uma
 * seção final curta nunca chega à faixa. Ordem:
 * 1. no fim da rolagem, o último título já à vista;
 * 2. senão, o primeiro título dentro da faixa;
 * 3. senão, o último que já passou acima dela (a leitura está naquela seção);
 * 4. senão (antes do primeiro título), nenhuma.
 */
function activeSection(
  elements: HTMLElement[],
  scroller: HTMLElement | null,
  rootMargin: string,
): string | undefined {
  const page = document.scrollingElement ?? document.documentElement
  const box = scroller ?? page
  const viewTop = scroller ? scroller.getBoundingClientRect().top + scroller.clientTop : 0
  const viewHeight = box.clientHeight
  const [marginTop, marginBottom] = verticalMargins(rootMargin, viewHeight)
  const bandTop = viewTop - marginTop
  const bandBottom = viewTop + viewHeight + marginBottom
  const rects = elements.map((el) => el.getBoundingClientRect())

  const scrollTop = scroller ? scroller.scrollTop : window.scrollY
  const scrollable = box.scrollHeight > viewHeight + 1
  if (scrollable && box.scrollHeight - scrollTop - viewHeight <= 1) {
    for (let i = rects.length - 1; i >= 0; i--) {
      if (rects[i].top < viewTop + viewHeight) return elements[i].id
    }
  }
  const inBand = rects.findIndex((r) => r.bottom > bandTop && r.top < bandBottom)
  if (inBand !== -1) return elements[inBand].id
  let passed = -1
  rects.forEach((r, i) => {
    if (r.bottom <= bandTop) passed = i
  })
  return passed === -1 ? undefined : elements[passed].id
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
    // Item clicado: fica marcado durante a rolagem que o clique provoca (senão, ao
    // pular para uma das últimas seções, o fim da rolagem marcaria a última) e até
    // a próxima interação da pessoa (roda, toque, tecla ou ponteiro).
    const clickedRef = useRef<string | null>(null)
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

    // Destaca a seção visível: recalcula a cada quadro de rolagem (de qualquer contêiner —
    // `scroll` não borbulha, mas é capturado na janela), ao redimensionar e quando o
    // IntersectionObserver vê um título cruzar a faixa (o conteúdo mudou de lugar).
    useEffect(() => {
      if (!canUseDOM) return
      const ids = idsKey ? idsKey.split('|') : []
      const elements = ids
        .map((id) => document.getElementById(id))
        .filter((el): el is HTMLElement => !!el)
      if (elements.length === 0) return
      const scroller = resolveContainer(root)
      let frame = 0
      const update = () => {
        frame = 0
        if (clickedRef.current) return
        setActiveId(activeSection(elements, scroller, rootMargin))
      }
      const schedule = () => {
        if (!frame) frame = requestAnimationFrame(update)
      }
      const release = () => {
        clickedRef.current = null
      }
      const io =
        typeof IntersectionObserver === 'undefined'
          ? null
          : new IntersectionObserver(schedule, { rootMargin, root: scroller })
      elements.forEach((el) => io?.observe(el))
      window.addEventListener('scroll', schedule, { capture: true, passive: true })
      window.addEventListener('resize', schedule)
      const inputs = ['wheel', 'touchstart', 'keydown', 'pointerdown'] as const
      inputs.forEach((type) =>
        window.addEventListener(type, release, { capture: true, passive: true }),
      )
      schedule()
      return () => {
        if (frame) cancelAnimationFrame(frame)
        io?.disconnect()
        window.removeEventListener('scroll', schedule, { capture: true })
        window.removeEventListener('resize', schedule)
        inputs.forEach((type) => window.removeEventListener(type, release, { capture: true }))
      }
    }, [idsKey, rootMargin, root])

    const handleClick = (id: string) => (event: MouseEvent<HTMLAnchorElement>) => {
      onItemClick?.(id, event)
      if (event.defaultPrevented) return
      clickedRef.current = id
      setActiveId(id)
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
