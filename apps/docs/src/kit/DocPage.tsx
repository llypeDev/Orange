import { Icon, useClipboard } from '@orangesys/ui'
import { useEffect, useRef, useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { componentMetas, sourceUrl, storybookUrl } from '../content/registry'
import { categoryLabels, type ComponentMeta } from '../content/types'
import { useLang, type Localized } from '../i18n'

interface TocItem {
  id: string
  text: string
}

/**
 * Seção ativa pela geometria dos títulos — a mesma regra do `TableOfContents` da biblioteca,
 * com a faixa `'-80px 0px -65% 0px'`: no fim da rolagem, o último título à vista (uma seção final
 * curta nunca chega à faixa); senão, o primeiro título dentro da faixa; senão, o último que já
 * passou acima dela. Só o IntersectionObserver não basta: um título que atravessa a faixa entre
 * dois quadros (rolagem rápida, Home/End) não gera evento.
 */
function activeHeading(headings: HTMLElement[]): string | undefined {
  const page = document.scrollingElement ?? document.documentElement
  const height = page.clientHeight
  const bandTop = 80
  const bandBottom = height * 0.35
  const rects = headings.map((h) => h.getBoundingClientRect())
  if (page.scrollHeight > height + 1 && page.scrollHeight - window.scrollY - height <= 1) {
    for (let i = rects.length - 1; i >= 0; i--) if (rects[i].top < height) return headings[i].id
  }
  const inBand = rects.findIndex((r) => r.bottom > bandTop && r.top < bandBottom)
  if (inBand !== -1) return headings[inBand].id
  let passed = -1
  rects.forEach((r, i) => {
    if (r.bottom <= bandTop) passed = i
  })
  return passed === -1 ? undefined : headings[passed].id
}

function useHeadings(ref: React.RefObject<HTMLElement | null>) {
  const [items, setItems] = useState<TocItem[]>([])
  const [active, setActive] = useState<string>()
  // Item clicado: fica marcado durante o salto que o clique provoca (senão, ao pular para uma das
  // últimas seções, o fim da rolagem marcaria a última) e até a próxima interação da pessoa.
  const clicked = useRef<string | null>(null)

  useEffect(() => {
    const root = ref.current
    if (!root) return
    const hs = Array.from(root.querySelectorAll<HTMLHeadingElement>('h2.doc-h2[id]'))
    setItems(hs.map((h) => ({ id: h.id, text: h.textContent ?? '' })))
    let frame = 0
    const update = () => {
      frame = 0
      if (!clicked.current) setActive(activeHeading(hs))
    }
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    const release = () => {
      clicked.current = null
    }
    const inputs = ['wheel', 'touchstart', 'keydown', 'pointerdown'] as const
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    inputs.forEach((type) =>
      window.addEventListener(type, release, { capture: true, passive: true }),
    )
    schedule()
    return () => {
      if (frame) cancelAnimationFrame(frame)
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      inputs.forEach((type) => window.removeEventListener(type, release, { capture: true }))
    }
  }, [ref])

  // No topo da página (cabeçalho/lead ainda à vista) nenhum h2 chegou à faixa. Enquanto não houver
  // uma seção ativa válida, a primeira é a "atual": é onde o leitor está.
  const current = active && items.some((item) => item.id === active) ? active : items[0]?.id
  const select = (id: string) => {
    clicked.current = id
    setActive(id)
  }

  return { items, active: current, select }
}

export interface DocPageProps {
  eyebrow?: Localized<string>
  title: Localized<string> | string
  lead?: Localized<ReactNode>
  /** Conteúdo extra no cabeçalho (links, badges). */
  headerExtra?: ReactNode
  /** Mostrar o índice "Nesta página". Padrão: true. */
  toc?: boolean
  children: ReactNode
  footer?: ReactNode
  /**
   * Cabeçalho no padrão das páginas de topo do zop.dev: título display sobre
   * linhas de grade, texto de apoio, ações e uma grade de números.
   */
  hero?: {
    actions?: ReactNode
    stats?: { value: ReactNode; label: Localized<string> }[]
    /** Centraliza o hero (como o changelog do zop.dev). */
    align?: 'start' | 'center'
  }
}

export function DocPage({ eyebrow, title, lead, headerExtra, toc = true, children, footer, hero }: DocPageProps) {
  const { t } = useLang()
  const contentRef = useRef<HTMLDivElement>(null)
  const { items, active, select } = useHeadings(contentRef)
  const resolvedTitle = typeof title === 'string' ? title : t(title)

  useEffect(() => {
    document.title = `${resolvedTitle} · Orange Design System`
  }, [resolvedTitle])

  return (
    <article className="doc-page">
      <header
        className={`doc-page__header ${hero ? 'doc-page__header--hero' : ''} ${hero?.align === 'center' ? 'doc-page__header--center' : ''}`}
      >
        {hero && <div className="doc-hero__grid" aria-hidden="true" />}
        {eyebrow && (
          <p className="or-eyebrow doc-page__eyebrow">
            <span className="doc-square" aria-hidden="true" />
            {t(eyebrow)}
          </p>
        )}
        <h1 className="doc-h1">{resolvedTitle}</h1>
        {lead && <div className="doc-lead">{t(lead)}</div>}
        {hero?.actions && <div className="doc-hero__actions">{hero.actions}</div>}
        {headerExtra}
        {hero?.stats && (
          <dl className="doc-hero__stats">
            {hero.stats.map((stat, i) => (
              <div key={i}>
                <dt>{t(stat.label)}</dt>
                <dd>{stat.value}</dd>
              </div>
            ))}
          </dl>
        )}
      </header>
      <div className={`doc-page__body ${toc && items.length > 1 ? 'doc-page__body--toc' : ''}`}>
        <div className="doc-page__content" ref={contentRef}>
          {children}
        </div>
        {toc && items.length > 1 && (
          <nav className="doc-toc" aria-label={t({ pt: 'Nesta página', en: 'On this page' })}>
            <p className="or-eyebrow doc-toc__title">{t({ pt: 'Nesta página', en: 'On this page' })}</p>
            <ul>
              {items.map((item) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    aria-current={active === item.id ? 'location' : undefined}
                    onClick={() => select(item.id)}
                  >
                    {item.text}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </div>
      {footer}
    </article>
  )
}

function ImportSnippet({ name }: { name: string }) {
  const { copy, copied } = useClipboard()
  const { t } = useLang()
  const code = `import { ${name} } from '@orangesys/ui'`
  return (
    <div className="doc-import">
      <code>
        <span className="doc-import__kw">import</span>
        {' { '}
        <span className="doc-import__name">{name}</span>
        {' } '}
        <span className="doc-import__kw">from</span>{' '}
        <span className="doc-import__str">'@orangesys/ui'</span>
      </code>
      <button type="button" className="doc-import__copy" onClick={() => copy(code)}>
        <Icon name={copied ? 'check' : 'copy'} size="sm" />
        <span className="or-visually-hidden">{t({ pt: 'Copiar importação', en: 'Copy import' })}</span>
      </button>
      <span className="or-visually-hidden" aria-live="polite">
        {copied ? t({ pt: 'Copiado', en: 'Copied' }) : ''}
      </span>
    </div>
  )
}

/** Navegação anterior/próximo entre páginas de componentes. */
function ComponentPager({ slug }: { slug: string }) {
  const { t, to } = useLang()
  const index = componentMetas.findIndex((m) => m.slug === slug)
  const prev = index > 0 ? componentMetas[index - 1] : undefined
  const next = index >= 0 && index < componentMetas.length - 1 ? componentMetas[index + 1] : undefined
  return (
    <nav className="doc-pager" aria-label={t({ pt: 'Navegação entre componentes', en: 'Component navigation' })}>
      {prev ? (
        <Link className="doc-pager__link or-lift" to={to(`/components/${prev.slug}`)}>
          {/* Setas em SVG: o subconjunto "latin" das fontes não tem ← e →. */}
          <span className="or-eyebrow doc-pager__dir">
            <Icon name="arrow-left" size="xs" /> {t({ pt: 'Anterior', en: 'Previous' })}
          </span>
          <span className="doc-pager__name">{prev.name}</span>
        </Link>
      ) : (
        <span />
      )}
      {next && (
        <Link className="doc-pager__link doc-pager__link--next or-lift" to={to(`/components/${next.slug}`)}>
          <span className="or-eyebrow doc-pager__dir">
            {t({ pt: 'Próximo', en: 'Next' })} <Icon name="arrow-right" size="xs" />
          </span>
          <span className="doc-pager__name">{next.name}</span>
        </Link>
      )}
    </nav>
  )
}

const statusLabels: Record<Exclude<NonNullable<ComponentMeta['status']>, 'stable'>, Localized<string>> = {
  new: { pt: 'Novo', en: 'New' },
  beta: { pt: 'Beta', en: 'Beta' },
  deprecated: { pt: 'Depreciado', en: 'Deprecated' },
}

/** Aviso no cabeçalho de um componente depreciado: substituto, versões e política. */
function DeprecationNotice({ meta }: { meta: ComponentMeta }) {
  const { t, to, lang } = useLang()
  const { replacement, since, removal, note } = meta.deprecation ?? {}
  const replacementName = replacement ? (componentMetas.find((m) => m.slug === replacement)?.name ?? replacement) : undefined
  const replacementLink = replacement && (
    <Link to={to(`/components/${replacement}`)}>
      <code>{replacementName}</code>
    </Link>
  )
  const removalText =
    lang === 'pt' ? (removal ? `na v${removal}` : 'na próxima major') : removal ? `in v${removal}` : 'in the next major'
  return (
    <div className="doc-deprecation" role="note">
      <Icon name="alert-triangle" size="sm" />
      <p>
        {lang === 'pt' ? (
          <>
            <strong>{meta.name}</strong> está depreciado{since && ` desde a v${since}`} e sai {removalText}.
            {replacementLink && <> Use {replacementLink}.</>}
          </>
        ) : (
          <>
            <strong>{meta.name}</strong> is deprecated{since && ` since v${since}`} and will be removed {removalText}.
            {replacementLink && <> Use {replacementLink} instead.</>}
          </>
        )}
        {note && <> {t(note)}</>}{' '}
        <Link to={to('/usage/versioning')}>{t({ pt: 'Política de depreciação', en: 'Deprecation policy' })}</Link>
      </p>
    </div>
  )
}

/**
 * Página padrão de componente: cabeçalho com categoria, nome, descrição,
 * importação, links para Storybook e código-fonte; índice automático e
 * navegação para o componente anterior/próximo.
 */
export function ComponentPage({ meta, children }: { meta: ComponentMeta; children: ReactNode }) {
  const { t } = useLang()
  return (
    <DocPage
      eyebrow={{ pt: `Componentes · ${categoryLabels[meta.category].pt}`, en: `Components · ${categoryLabels[meta.category].en}` }}
      title={meta.name}
      lead={meta.description}
      headerExtra={
        <div className="doc-page__meta">
          <ImportSnippet name={meta.name} />
          <div className="doc-page__links">
            <a className="doc-chip-link" href={storybookUrl(meta)} target="_blank" rel="noreferrer">
              Storybook <Icon name="arrow-up-right" size="sm" />
              <span className="or-visually-hidden">{t({ pt: '(abre em nova aba)', en: '(opens in a new tab)' })}</span>
            </a>
            <a className="doc-chip-link" href={sourceUrl(meta)} target="_blank" rel="noreferrer">
              {t({ pt: 'Código-fonte', en: 'Source' })} <Icon name="arrow-up-right" size="sm" />
              <span className="or-visually-hidden">{t({ pt: '(abre em nova aba)', en: '(opens in a new tab)' })}</span>
            </a>
            {meta.status && meta.status !== 'stable' && (
              <span className={`doc-status doc-status--${meta.status}`}>{t(statusLabels[meta.status])}</span>
            )}
          </div>
          {meta.status === 'deprecated' && <DeprecationNotice meta={meta} />}
        </div>
      }
      footer={<ComponentPager slug={meta.slug} />}
    >
      {children}
    </DocPage>
  )
}
