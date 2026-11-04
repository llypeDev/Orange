import { Icon, useClipboard } from '@orange/ui'
import { useEffect, useRef, useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { componentMetas, sourceUrl, storybookUrl } from '../content/registry'
import { categoryLabels, type ComponentMeta } from '../content/types'
import { useLang, type Localized } from '../i18n'

interface TocItem {
  id: string
  text: string
}

function useHeadings(ref: React.RefObject<HTMLElement | null>) {
  const [items, setItems] = useState<TocItem[]>([])
  const [active, setActive] = useState<string>()

  useEffect(() => {
    const root = ref.current
    if (!root) return
    const collect = () => {
      const hs = Array.from(root.querySelectorAll<HTMLHeadingElement>('h2.doc-h2[id]'))
      setItems(hs.map((h) => ({ id: h.id, text: h.textContent ?? '' })))
      return hs
    }
    const hs = collect()
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        if (visible[0]) setActive(visible[0].target.id)
      },
      { rootMargin: '-80px 0px -65% 0px' },
    )
    hs.forEach((h) => io.observe(h))
    return () => io.disconnect()
  }, [ref])

  return { items, active }
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
  const { items, active } = useHeadings(contentRef)
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
                  <a href={`#${item.id}`} aria-current={active === item.id ? 'location' : undefined}>
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
  const code = `import { ${name} } from '@orange/ui'`
  return (
    <div className="doc-import">
      <code>
        <span className="doc-import__kw">import</span>
        {' { '}
        <span className="doc-import__name">{name}</span>
        {' } '}
        <span className="doc-import__kw">from</span>{' '}
        <span className="doc-import__str">'@orange/ui'</span>
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
        <Link className="doc-pager__link" to={to(`/components/${prev.slug}`)}>
          <span className="or-eyebrow">← {t({ pt: 'Anterior', en: 'Previous' })}</span>
          <span className="doc-pager__name">{prev.name}</span>
        </Link>
      ) : (
        <span />
      )}
      {next && (
        <Link className="doc-pager__link doc-pager__link--next" to={to(`/components/${next.slug}`)}>
          <span className="or-eyebrow">{t({ pt: 'Próximo', en: 'Next' })} →</span>
          <span className="doc-pager__name">{next.name}</span>
        </Link>
      )}
    </nav>
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
              <span className={`doc-status doc-status--${meta.status}`}>
                {meta.status === 'new' ? t({ pt: 'Novo', en: 'New' }) : 'Beta'}
              </span>
            )}
          </div>
        </div>
      }
      footer={<ComponentPager slug={meta.slug} />}
    >
      {children}
    </DocPage>
  )
}
