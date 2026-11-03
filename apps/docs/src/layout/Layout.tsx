import { Icon, useEscapeKey, useFocusTrap, useLockBodyScroll, useTheme } from '@orange/ui'
import { Suspense, useEffect, useRef, useState, type ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { REPO_URL, STORYBOOK_URL } from '../content/registry'
import { LANGS, useLang } from '../i18n'
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

function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  const { t } = useLang()
  const next = resolvedTheme === 'dark' ? 'light' : 'dark'
  return (
    <button
      type="button"
      className="doc-icon-button"
      onClick={() => setTheme(next)}
      aria-label={next === 'light' ? t({ pt: 'Ativar tema claro', en: 'Switch to light theme' }) : t({ pt: 'Ativar tema escuro', en: 'Switch to dark theme' })}
    >
      <Icon name={resolvedTheme === 'dark' ? 'sun' : 'moon'} size="md" />
    </button>
  )
}

function Header({ menuOpen, onMenu }: { menuOpen: boolean; onMenu: () => void }) {
  const { t, to } = useLang()
  return (
    <header className="doc-header">
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
          <Logo />
          <span className="or-visually-hidden">{t({ pt: '— início', en: '— home' })}</span>
        </Link>
      </div>
      <nav className="doc-header__nav" aria-label={t({ pt: 'Atalhos', en: 'Shortcuts' })}>
        <Link to={to('/components/overview')}>{t({ pt: 'Componentes', en: 'Components' })}</Link>
        <Link to={to('/design-guidelines/color')}>Guidelines</Link>
        <a href={STORYBOOK_URL} target="_blank" rel="noreferrer">
          Storybook <Icon name="arrow-up-right" size="xs" />
          <span className="or-visually-hidden">{t({ pt: '(abre em nova aba)', en: '(opens in a new tab)' })}</span>
        </a>
        <a href={REPO_URL} target="_blank" rel="noreferrer">
          GitHub <Icon name="arrow-up-right" size="xs" />
          <span className="or-visually-hidden">{t({ pt: '(abre em nova aba)', en: '(opens in a new tab)' })}</span>
        </a>
      </nav>
      <div className="doc-header__end">
        <LangSwitch />
        <span className="doc-header__divider" aria-hidden="true" />
        <ThemeToggle />
        <Link to={to('/getting-started')} className="or-button or-button--primary or-button--sm doc-header__cta">
          <span className="or-button__label">{t({ pt: 'Começar', en: 'Get started' })}</span>
          <span className="or-button__icon or-button__icon--end" aria-hidden="true">
            <Icon name="arrow-right" size="sm" />
          </span>
        </Link>
      </div>
    </header>
  )
}

function Footer() {
  const { t, to } = useLang()
  return (
    <footer className="doc-footer">
      <div className="doc-footer__top">
        <div>
          <Logo />
          <p className="doc-footer__tagline">
            {t({
              pt: 'Design system open source, acessível e customizável.',
              en: 'Open source, accessible and customizable design system.',
            })}
          </p>
        </div>
        <ul className="doc-footer__links">
          <li>
            <Link to={to('/getting-started')}>{t({ pt: 'Começando', en: 'Getting started' })}</Link>
          </li>
          <li>
            <Link to={to('/components/overview')}>{t({ pt: 'Componentes', en: 'Components' })}</Link>
          </li>
          <li>
            <Link to={to('/design-guidelines/accessibility')}>{t({ pt: 'Acessibilidade', en: 'Accessibility' })}</Link>
          </li>
          <li>
            <a href={STORYBOOK_URL}>Storybook</a>
          </li>
          <li>
            <a href={REPO_URL}>GitHub</a>
          </li>
        </ul>
      </div>
      <div className="doc-footer__bottom">
        <span>© 2026 Orange Design System · MIT</span>
        <span>
          {t({ pt: 'feito com', en: 'made with' })} <span className="doc-square doc-square--inline" aria-hidden="true" />{' '}
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

export function Layout({ children, fullWidth = false }: { children: ReactNode; fullWidth?: boolean }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const sidebarRef = useRef<HTMLDivElement>(null)
  const location = useLocation()
  const mainRef = useRef<HTMLElement>(null)

  useFocusTrap(sidebarRef, menuOpen)
  useLockBodyScroll(menuOpen)
  useEscapeKey(() => setMenuOpen(false), menuOpen)

  // Ao trocar de rota: fecha o menu, rola para o topo (ou âncora) e anuncia.
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
    <div className={`doc-shell ${fullWidth ? 'doc-shell--full' : ''}`}>
      <SkipLink />
      <Header menuOpen={menuOpen} onMenu={() => setMenuOpen((v) => !v)} />
      <div className="doc-body">
        <div
          id="doc-sidebar"
          ref={sidebarRef}
          className="doc-sidebar-wrap"
          data-open={menuOpen || undefined}
        >
          <Sidebar onNavigate={() => setMenuOpen(false)} />
        </div>
        {menuOpen && <div className="doc-backdrop" onClick={() => setMenuOpen(false)} aria-hidden="true" />}
        <main id="main" ref={mainRef} className="doc-main" tabIndex={-1}>
          <Suspense fallback={<PageFallback />}>{children}</Suspense>
          <Footer />
        </main>
      </div>
    </div>
  )
}
