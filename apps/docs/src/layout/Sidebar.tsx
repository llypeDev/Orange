import { Icon, type IconName } from '@orange/ui'
import { useEffect, useId, useMemo, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { componentMetas, STORYBOOK_URL } from '../content/registry'
import { useLang, type Localized } from '../i18n'
import { guidelinePages, navIcons, usagePages } from '../nav'

interface LinkItem {
  label: string
  path: string
}

function normalize(text: string) {
  return text.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
}

function Group({
  icon,
  label,
  items,
  basePath,
  forceOpen,
  onNavigate,
}: {
  icon: IconName
  label: string
  items: LinkItem[]
  basePath: string
  forceOpen: boolean
  onNavigate?: () => void
}) {
  const location = useLocation()
  const isActive = location.pathname.includes(basePath)
  const [open, setOpen] = useState(isActive)
  const listId = useId()

  useEffect(() => {
    if (isActive) setOpen(true)
  }, [isActive])

  const expanded = open || forceOpen
  if (items.length === 0) return null

  return (
    <li className="doc-nav__group" data-active={isActive || undefined}>
      <button
        type="button"
        className="doc-nav__item doc-nav__toggle"
        aria-expanded={expanded}
        aria-controls={listId}
        onClick={() => setOpen((v) => !v)}
      >
        <Icon name={icon} size="md" />
        <span>{label}</span>
        <Icon name="chevron-down" size="sm" className="doc-nav__chevron" />
      </button>
      {/* Recolhe com animação de altura (grid 0fr → 1fr). Fechado fica `inert`:
          fora da ordem de Tab e da árvore de acessibilidade, como `hidden`. */}
      <div className="or-collapse doc-nav__collapse" data-state={expanded ? 'open' : 'closed'} inert={!expanded}>
        <ul id={listId} className="doc-nav__sublist">
          {items.map((item) => (
            <li key={item.path}>
              <NavLink to={item.path} className="doc-nav__sublink" onClick={onNavigate}>
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </li>
  )
}

export function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const { t, to } = useLang()
  const [query, setQuery] = useState('')
  const q = normalize(query.trim())
  const searchId = useId()

  const filter = (items: LinkItem[]) => (q ? items.filter((i) => normalize(i.label).includes(q)) : items)

  const guidelines = useMemo(
    () => guidelinePages.map((p) => ({ label: t(p.label), path: to(p.path) })),
    [t, to],
  )
  const usage = useMemo(() => usagePages.map((p) => ({ label: t(p.label), path: to(p.path) })), [t, to])
  const components = useMemo(
    () => [
      { label: t({ pt: 'Visão geral', en: 'Overview' }), path: to('/components/overview') },
      ...componentMetas.map((m) => ({ label: m.name, path: to(`/components/${m.slug}`) })),
    ],
    [t, to],
  )

  const top = (path: string, label: Localized<string>, icon: IconName) => {
    const text = t(label)
    if (q && !normalize(text).includes(q)) return null
    return (
      <li>
        <NavLink to={to(path)} className="doc-nav__item" onClick={onNavigate}>
          <Icon name={icon} size="md" />
          <span>{text}</span>
        </NavLink>
      </li>
    )
  }

  const filteredComponents = filter(components)

  return (
    <nav className="doc-sidebar" aria-label={t({ pt: 'Navegação principal', en: 'Main navigation' })}>
      <div className="doc-sidebar__search">
        <label htmlFor={searchId} className="or-visually-hidden">
          {t({ pt: 'Filtrar navegação', en: 'Filter navigation' })}
        </label>
        <Icon name="search" size="sm" />
        <input
          id={searchId}
          type="search"
          placeholder={t({ pt: 'Filtrar…', en: 'Filter…' })}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoComplete="off"
        />
        <kbd className="doc-sidebar__count" aria-hidden="true">
          {componentMetas.length}
        </kbd>
      </div>
      <ul className="doc-nav">
        {top('/getting-started', { pt: 'Começando', en: 'Getting started' }, navIcons['getting-started'])}
        {top('/about', { pt: 'Sobre', en: 'About' }, navIcons.about)}
        <Group
          icon={navIcons.guidelines}
          label="Design Guidelines"
          items={filter(guidelines)}
          basePath="/design-guidelines/"
          forceOpen={!!q}
          onNavigate={onNavigate}
        />
        <Group
          icon={navIcons.usage}
          label={t({ pt: 'Usando', en: 'Usage' })}
          items={filter(usage)}
          basePath="/usage/"
          forceOpen={!!q}
          onNavigate={onNavigate}
        />
        <Group
          icon={navIcons.components}
          label={t({ pt: 'Componentes', en: 'Components' })}
          items={filteredComponents}
          basePath="/components/"
          forceOpen={!!q}
          onNavigate={onNavigate}
        />
        {top('/resources', { pt: 'Recursos', en: 'Resources' }, navIcons.resources)}
        {(!q || normalize('storybook').includes(q)) && (
          <li>
            <a href={STORYBOOK_URL} className="doc-nav__item" target="_blank" rel="noreferrer">
              <Icon name={navIcons.storybook} size="md" />
              <span>Storybook</span>
              <Icon name="arrow-up-right" size="sm" className="doc-nav__external" />
              <span className="or-visually-hidden">{t({ pt: '(abre em nova aba)', en: '(opens in a new tab)' })}</span>
            </a>
          </li>
        )}
      </ul>
      {q && filteredComponents.length === 0 && (
        <p className="doc-sidebar__empty" role="status">
          {t({ pt: 'Nada encontrado.', en: 'Nothing found.' })}
        </p>
      )}
    </nav>
  )
}
