import {
  BackToTop,
  buttonClassName,
  Icon,
  useEscapeKey,
  useFocusTrap,
  useLockBodyScroll,
  usePresence,
  useScrollDirection,
  useTheme,
} from '@orange/ui'
import { Suspense, useEffect, useRef, useState, type ReactNode } from 'react'
import { flushSync } from 'react-dom'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { REPO_URL, STORYBOOK_URL } from '../content/registry'
import { LANGS, useLang, type Localized } from '../i18n'
import { guidelinePages, usagePages } from '../nav'
import { Logo } from './Logo'
import { Sidebar } from './Sidebar'

function LangSwitch() {
  const { lang, t } = useLang()
  const location = useLocation()
  const rest = location.pathname.replace(/^\/(pt|en)(?=\/|$)/, '')
  return (
    <div className="doc-lang" role="group" aria-label={t({ pt: 'Idioma', en: 'Language' })}>
      {LANGS.map((l) => (
        <Link
          key={l}
          to={`/${l}${rest || '/'}${location.hash}`}
          className="doc-lang__item"
          aria-current={l === lang ? 'true' : undefined}
          lang={l === 'pt' ? 'pt-BR' : 'en'}
          hrefLang={l === 'pt' ? 'pt-BR' : 'en'}
        >
          <span aria-hidden="true">{l.toUpperCase()}</span>
          <span className="or-visually-hidden">{l === 'pt' ? 'Português' : 'English'}</span>
        </Link>
      ))}
    </div>
  )
}

type ViewTransitionDocument = Document & { startViewTransition?: (cb: () => void) => unknown }

function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  const { t } = useLang()
  const next = resolvedTheme === 'dark' ? 'light' : 'dark'

  const toggle = () => {
    const doc = document as ViewTransitionDocument
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    // Cross-fade da página inteira na troca de tema (View Transitions), quando disponível.
    if (doc.startViewTransition && !reduced) {
      doc.startViewTransition(() => {
        flushSync(() => setTheme(next))
        document.documentElement.setAttribute('data-theme', next)
      })
    } else {
      setTheme(next)
    }
  }

  return (
    <button
      type="button"
      className="doc-icon-button doc-theme-toggle"
      onClick={toggle}
      aria-label={
        next === 'light'
          ? t({ pt: 'Ativar tema claro', en: 'Switch to light theme' })
          : t({ pt: 'Ativar tema escuro', en: 'Switch to dark theme' })
      }
    >
      <Icon key={resolvedTheme} name={resolvedTheme === 'dark' ? 'sun' : 'moon'} size="md" className="doc-theme-toggle__icon" />
    </button>
  )
}

function Header({ menuOpen, onMenu }: { menuOpen: boolean; onMenu: () => void }) {
  const { t, to } = useLang()
  const headerRef = useRef<HTMLElement>(null)
  const { direction, pastThreshold } = useScrollDirection({ threshold: 160 })
  const [focusInside, setFocusInside] = useState(false)
  // Como no zop.dev: some ao rolar para baixo, volta ao rolar para cima.
  // Nunca esconde com foco dentro do cabeçalho ou com o menu aberto.
  const hidden = direction === 'down' && pastThreshold && !focusInside && !menuOpen

  return (
    <header
      ref={headerRef}
      className="doc-header"
      data-hidden={hidden || undefined}
      onFocus={() => setFocusInside(true)}
      onBlur={(e) => {
        if (!headerRef.current?.contains(e.relatedTarget as Node)) setFocusInside(false)
      }}
    >
      <div className="doc-header__start">
        <button
          type="button"
          className="doc-icon-button doc-header__menu"
          aria-expanded={menuOpen}
          aria-controls="doc-sidebar"
          onClick={onMenu}
          aria-label={t({ pt: 'Abrir menu', en: 'Open menu' })}
        >
          <Icon name={menuOpen ? 'close' : 'menu'} size="md" />
        </button>
        <Link to={to('/')} className="doc-header__brand">
          <Logo animated />
          <span className="or-visually-hidden">{t({ pt: '— início', en: '— home' })}</span>
        </Link>
      </div>
      <nav className="doc-header__nav" aria-label={t({ pt: 'Atalhos', en: 'Shortcuts' })}>
        <NavLink to={to('/components/overview')} className="doc-header__link">
          {t({ pt: 'Componentes', en: 'Components' })}
        </NavLink>
        <NavLink to={to('/design-guidelines/color')} className="doc-header__link">
          Guidelines
        </NavLink>
        <a href={STORYBOOK_URL} target="_blank" rel="noreferrer" className="doc-header__link">
          Storybook <Icon name="arrow-up-right" size="xs" className="doc-header__ext" />
          <span className="or-visually-hidden">{t({ pt: '(abre em nova aba)', en: '(opens in a new tab)' })}</span>
        </a>
        <a href={REPO_URL} target="_blank" rel="noreferrer" className="doc-header__link">
          GitHub <Icon name="arrow-up-right" size="xs" className="doc-header__ext" />
          <span className="or-visually-hidden">{t({ pt: '(abre em nova aba)', en: '(opens in a new tab)' })}</span>
        </a>
      </nav>
      <div className="doc-header__end">
        <LangSwitch />
        <span className="doc-header__divider" aria-hidden="true" />
        <ThemeToggle />
        {/* buttonClassName importa o módulo do Button — e com ele o CSS — no chunk principal. */}
        <Link to={to('/getting-started')} className={`${buttonClassName({ variant: 'primary', size: 'sm' })} doc-header__cta`}>
          <span className="or-button__label">{t({ pt: 'Começar', en: 'Get started' })}</span>
          <span className="or-button__icon or-button__icon--end" aria-hidden="true">
            <Icon name="arrow-right" size="sm" />
          </span>
        </Link>
      </div>
    </header>
  )
}

interface FooterLink {
  label: string
  href: string
  external?: boolean
}

/** Rodapé em colunas, no formato de mapa do site do zop.dev. */
function Footer() {
  const { t, to } = useLang()
  const internal = (path: string, label: Localized<string>): FooterLink => ({ label: t(label), href: to(path) })
  const columns: { id: string; title: Localized<string>; links: FooterLink[] }[] = [
    {
      id: 'start',
      title: { pt: 'Começar', en: 'Start' },
      links: [
        internal('/getting-started', { pt: 'Começando', en: 'Getting started' }),
        internal('/about', { pt: 'Sobre', en: 'About' }),
        internal('/resources', { pt: 'Recursos', en: 'Resources' }),
        internal('/changelog', { pt: 'Novidades', en: 'Changelog' }),
      ],
    },
    {
      id: 'guidelines',
      title: { pt: 'Design Guidelines', en: 'Design Guidelines' },
      links: guidelinePages.map((page) => internal(page.path, page.label)),
    },
    {
      id: 'usage',
      title: { pt: 'Usando', en: 'Usage' },
      links: usagePages.map((page) => internal(page.path, page.label)),
    },
    {
      id: 'components',
      title: { pt: 'Componentes', en: 'Components' },
      links: [
        internal('/components/overview', { pt: 'Visão geral', en: 'Overview' }),
        internal('/components/button', { pt: 'Button', en: 'Button' }),
        internal('/components/text-field', { pt: 'TextField', en: 'TextField' }),
        internal('/components/date-picker', { pt: 'DatePicker', en: 'DatePicker' }),
        internal('/components/modal', { pt: 'Modal', en: 'Modal' }),
        internal('/components/table', { pt: 'Table', en: 'Table' }),
        internal('/components/tabs', { pt: 'Tabs', en: 'Tabs' }),
      ],
    },
    {
      id: 'project',
      title: { pt: 'Projeto', en: 'Project' },
      links: [
        { label: 'Storybook', href: STORYBOOK_URL, external: true },
        { label: 'GitHub', href: REPO_URL, external: true },
        { label: t({ pt: 'Reportar um problema', en: 'Report an issue' }), href: `${REPO_URL}/issues`, external: true },
        { label: t({ pt: 'Como contribuir', en: 'Contributing' }), href: `${REPO_URL}/blob/main/CONTRIBUTING.md`, external: true },
        { label: t({ pt: 'Licença MIT', en: 'MIT license' }), href: `${REPO_URL}/blob/main/LICENSE`, external: true },
      ],
    },
  ]
  return (
    <footer className="doc-footer">
      <div className="doc-footer__top">
        <div className="doc-footer__brand">
          <Logo />
          <p className="doc-footer__tagline">
            {t({
              pt: 'Design system open source, acessível e customizável.',
              en: 'Open source, accessible and customizable design system.',
            })}
          </p>
        </div>
        <nav className="doc-footer__sitemap" aria-label={t({ pt: 'Mapa do site', en: 'Site map' })}>
          {columns.map((column) => (
            <div key={column.id} className="doc-footer__col">
              <h2 id={`doc-footer-${column.id}`} className="doc-footer__heading">
                {t(column.title)}
              </h2>
              <ul className="doc-footer__links" aria-labelledby={`doc-footer-${column.id}`}>
                {column.links.map((link) =>
                  link.external ? (
                    <li key={link.href}>
                      <a href={link.href} className="doc-footer__link doc-footer__link--external">
                        {link.label}
                        <Icon name="arrow-up-right" size="sm" className="doc-footer__ext" />
                      </a>
                    </li>
                  ) : (
                    <li key={link.href}>
                      <Link to={link.href} className="doc-footer__link">
                        {link.label}
                      </Link>
                    </li>
                  ),
                )}
              </ul>
            </div>
          ))}
        </nav>
      </div>
      <div className="doc-footer__bottom">
        <span>© 2026 Orange Design System · MIT</span>
        <span>
          {t({ pt: 'feito com', en: 'made with' })}{' '}
          <span className="doc-square doc-square--inline doc-footer__heart" aria-hidden="true" />{' '}
          {t({ pt: 'por llypeDev', en: 'by llypeDev' })}
        </span>
      </div>
    </footer>
  )
}

function SkipLink() {
  const { t } = useLang()
  return (
    <a href="#main" className="doc-skip-link">
      {t({ pt: 'Pular para o conteúdo principal', en: 'Skip to main content' })}
    </a>
  )
}

export function PageFallback() {
  const { t } = useLang()
  return (
    <div className="doc-loading" role="status">
      <span className="doc-loading__bar" aria-hidden="true" />
      <span className="or-visually-hidden">{t({ pt: 'Carregando página…', en: 'Loading page…' })}</span>
    </div>
  )
}

function Backdrop({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { present, state, nodeRef } = usePresence<HTMLDivElement>(open)
  if (!present) return null
  return <div ref={nodeRef} className="doc-backdrop" data-state={state} onClick={onClose} aria-hidden="true" />
}

/**
 * Layout persistente (rota-pai): cabeçalho e menu lateral não remontam ao
 * navegar — só o conteúdo, que entra com fade + 8px (como no zop.dev).
 */
export function Layout({ children }: { children?: ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const sidebarRef = useRef<HTMLDivElement>(null)
  const location = useLocation()
  const mainRef = useRef<HTMLElement>(null)
  const isHome = /^\/(pt|en)\/?$/.test(location.pathname)

  // O foco entra no próprio painel (e não no primeiro campo, o "Filtrar…"):
  // no celular, focar o campo abriria o teclado toda vez que o menu abre.
  useFocusTrap(sidebarRef, menuOpen, { initialFocus: sidebarRef })
  useLockBodyScroll(menuOpen)
  useEscapeKey(() => setMenuOpen(false), menuOpen)

  // Ao trocar de rota: fecha o menu, rola para o topo (ou âncora).
  useEffect(() => {
    setMenuOpen(false)
    if (location.hash) {
      const el = document.getElementById(decodeURIComponent(location.hash.slice(1)))
      if (el) {
        el.scrollIntoView()
        return
      }
    }
    window.scrollTo(0, 0)
  }, [location.pathname, location.hash])

  return (
    <div className={`doc-shell ${isHome ? 'doc-shell--home' : ''}`}>
      <SkipLink />
      <Header menuOpen={menuOpen} onMenu={() => setMenuOpen((v) => !v)} />
      <div className="doc-body">
        <div id="doc-sidebar" ref={sidebarRef} className="doc-sidebar-wrap" data-open={menuOpen || undefined}>
          <Sidebar onNavigate={() => setMenuOpen(false)} />
        </div>
        <Backdrop open={menuOpen} onClose={() => setMenuOpen(false)} />
        <main id="main" ref={mainRef} className="doc-main" tabIndex={-1}>
          <div key={location.pathname} className="doc-route">
            <Suspense fallback={<PageFallback />}>{children ?? <Outlet />}</Suspense>
          </div>
          <Footer />
        </main>
      </div>
      <BackToTop threshold={900} focusTarget="#main" />
    </div>
  )
}
