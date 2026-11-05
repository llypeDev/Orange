import { isThemeSetting, OrangeProvider, type ThemeSetting } from '@orange/ui'
import { lazy, Suspense, useCallback, useState } from 'react'
import { Navigate, Route, Routes, useParams, useSearchParams } from 'react-router-dom'
import { getComponentMeta, getComponentPage } from './content/registry'
import { isLang, LangProvider } from './i18n'
import { Layout } from './layout/Layout'
import { allStaticPages, templatePages } from './nav'

const Home = lazy(() => import('./content/pages/Home'))
const NotFound = lazy(() => import('./content/pages/NotFound'))

const THEME_KEY = 'orange-docs-theme'

function readTheme(): ThemeSetting {
  try {
    const saved = localStorage.getItem(THEME_KEY)
    if (isThemeSetting(saved)) return saved
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

function LangRoutes({
  theme,
  onThemeChange,
}: {
  theme: ThemeSetting
  onThemeChange: (t: ThemeSetting) => void
}) {
  const { lang } = useParams()
  const [search] = useSearchParams()
  if (!isLang(lang)) return <Navigate to="/pt/" replace />
  // Prévia dos modelos (iframe com ?embed=1): só o modelo, sem a casca da
  // documentação — o documento do iframe fica igual ao de um app de verdade.
  const embed = search.get('embed') === '1'
  return (
    <OrangeProvider
      theme={theme}
      onThemeChange={onThemeChange}
      locale={lang === 'pt' ? 'pt-BR' : 'en-US'}
    >
      <LangProvider lang={lang}>
        {embed ? (
          <Suspense fallback={null}>
            <Routes>
              {templatePages.map(({ path, component: Page }) => (
                <Route key={path} path={path.slice(1)} element={<Page />} />
              ))}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        ) : (
          <Routes>
            {/* Layout persistente: só o conteúdo troca (e anima) entre rotas. */}
            <Route element={<Layout />}>
              <Route index element={<Home />} />
              {allStaticPages.map(({ path, component: Page }) => (
                <Route key={path} path={path.slice(1)} element={<Page />} />
              ))}
              <Route path="components" element={<Navigate to="overview" replace />} />
              <Route path="components/:slug" element={<ComponentRoute />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        )}
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
      <Route
        path="/"
        element={<Navigate to={navigator.language?.startsWith('en') ? '/en/' : '/pt/'} replace />}
      />
      <Route path="/:lang/*" element={<LangRoutes theme={theme} onThemeChange={setTheme} />} />
    </Routes>
  )
}
