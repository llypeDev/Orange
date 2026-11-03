import { OrangeProvider, type ThemeSetting } from '@orange/ui'
import { lazy, useCallback, useState } from 'react'
import { Navigate, Route, Routes, useParams } from 'react-router-dom'
import { getComponentMeta, getComponentPage } from './content/registry'
import { isLang, LangProvider } from './i18n'
import { Layout } from './layout/Layout'
import { allStaticPages } from './nav'

const Home = lazy(() => import('./content/pages/Home'))
const NotFound = lazy(() => import('./content/pages/NotFound'))

const THEME_KEY = 'orange-docs-theme'

function readTheme(): ThemeSetting {
  try {
    const saved = localStorage.getItem(THEME_KEY)
    if (saved === 'light' || saved === 'dark') return saved
  } catch {
    /* armazenamento indisponível */
  }
  return 'system'
}

function ComponentRoute() {
  const { slug = '' } = useParams()
  const Page = getComponentPage(slug)
  if (!Page || !getComponentMeta(slug)) return <NotFound />
  return <Page />
}

function LangRoutes({ theme, onThemeChange }: { theme: ThemeSetting; onThemeChange: (t: ThemeSetting) => void }) {
  const { lang } = useParams()
  if (!isLang(lang)) return <Navigate to="/pt/" replace />
  return (
    <OrangeProvider theme={theme} onThemeChange={onThemeChange} locale={lang === 'pt' ? 'pt-BR' : 'en-US'}>
    <LangProvider lang={lang}>
      <Routes>
        <Route
          index
          element={
            <Layout fullWidth>
              <Home />
            </Layout>
          }
        />
        {allStaticPages.map(({ path, component: Page }) => (
          <Route
            key={path}
            path={path.slice(1)}
            element={
              <Layout>
                <Page />
              </Layout>
            }
          />
        ))}
        <Route path="components" element={<Navigate to="overview" replace />} />
        <Route
          path="components/:slug"
          element={
            <Layout>
              <ComponentRoute />
            </Layout>
          }
        />
        <Route
          path="*"
          element={
            <Layout>
              <NotFound />
            </Layout>
          }
        />
      </Routes>
    </LangProvider>
    </OrangeProvider>
  )
}

export function App() {
  const [theme, setThemeState] = useState<ThemeSetting>(readTheme)
  const setTheme = useCallback((next: ThemeSetting) => {
    setThemeState(next)
    try {
      localStorage.setItem(THEME_KEY, next)
    } catch {
      /* armazenamento indisponível */
    }
  }, [])

  return (
    <Routes>
      <Route path="/" element={<Navigate to={navigator.language?.startsWith('en') ? '/en/' : '/pt/'} replace />} />
      <Route path="/:lang/*" element={<LangRoutes theme={theme} onThemeChange={setTheme} />} />
    </Routes>
  )
}
