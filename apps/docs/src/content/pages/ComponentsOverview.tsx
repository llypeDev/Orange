import { Icon, Reveal } from '@orangesys/ui'
import { useId, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useLang } from '../../i18n'
import { DocPage } from '../../kit'
import { componentMetas } from '../registry'
import { categoryLabels, type ComponentCategory } from '../types'

const order: ComponentCategory[] = ['actions', 'forms', 'feedback', 'overlays', 'navigation', 'data-display', 'layout', 'utilities']

function normalize(text: string) {
  return text.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
}

export default function ComponentsOverview() {
  const { t, to } = useLang()
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<ComponentCategory | 'all'>('all')
  const searchId = useId()

  const filtered = useMemo(() => {
    const q = normalize(query.trim())
    return componentMetas.filter(
      (m) =>
        (category === 'all' || m.category === category) &&
        (!q || normalize(m.name).includes(q) || normalize(t(m.description)).includes(q)),
    )
  }, [query, category, t])

  const counts = useMemo(() => {
    const c = new Map<ComponentCategory, number>()
    componentMetas.forEach((m) => c.set(m.category, (c.get(m.category) ?? 0) + 1))
    return c
  }, [])

  return (
    <DocPage
      eyebrow={{ pt: 'Componentes', en: 'Components' }}
      title={{ pt: 'Visão geral', en: 'Overview' }}
      lead={{
        pt: `${componentMetas.length} componentes React acessíveis, testados com axe-core e documentados em português e inglês.`,
        en: `${componentMetas.length} accessible React components, tested with axe-core and documented in Portuguese and English.`,
      }}
      toc={false}
      hero={{
        stats: [
          { value: componentMetas.length, label: { pt: 'componentes', en: 'components' } },
          { value: counts.size, label: { pt: 'categorias', en: 'categories' } },
          { value: 'AA', label: { pt: 'WCAG 2.2 em todos', en: 'WCAG 2.2 across the board' } },
          { value: 'PT·EN', label: { pt: 'documentação bilíngue', en: 'bilingual docs' } },
        ],
      }}
    >
      <div className="ov-filters">
        <div className="ov-search">
          <Icon name="search" size="sm" />
          <label htmlFor={searchId} className="or-visually-hidden">
            {t({ pt: 'Buscar componentes', en: 'Search components' })}
          </label>
          <input
            id={searchId}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t({ pt: 'Buscar componentes…', en: 'Search components…' })}
          />
        </div>
        <div className="ov-cats" role="group" aria-label={t({ pt: 'Filtrar por categoria', en: 'Filter by category' })}>
          <button type="button" aria-pressed={category === 'all'} onClick={() => setCategory('all')}>
            {t({ pt: 'Todos', en: 'All' })} <span>{componentMetas.length}</span>
          </button>
          {order
            .filter((c) => counts.has(c))
            .map((c) => (
              <button key={c} type="button" aria-pressed={category === c} onClick={() => setCategory(c)}>
                {t(categoryLabels[c])} <span>{counts.get(c)}</span>
              </button>
            ))}
        </div>
      </div>
      <p className="or-visually-hidden" role="status">
        {t({ pt: `${filtered.length} componentes encontrados`, en: `${filtered.length} components found` })}
      </p>
      <Reveal as="ul" stagger appear className="ov-grid" key={category}>
        {filtered.map((m) => (
          <li key={m.slug}>
            <Link to={to(`/components/${m.slug}`)} className="ov-card or-lift">
              <span className="or-eyebrow">{t(categoryLabels[m.category])}</span>
              <span className="ov-card__name">{m.name}</span>
              <span className="ov-card__desc">{t(m.description)}</span>
              <span className="ov-card__more" aria-hidden="true">
                {t({ pt: 'Ver documentação', en: 'View docs' })}{' '}
                <Icon name="arrow-right" size="xs" className="or-nudge__icon" />
              </span>
            </Link>
          </li>
        ))}
      </Reveal>
      {filtered.length === 0 && (
        <p className="ov-empty">{t({ pt: 'Nenhum componente encontrado.', en: 'No components found.' })}</p>
      )}
    </DocPage>
  )
}
