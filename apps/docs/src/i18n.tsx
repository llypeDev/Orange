import { createContext, useCallback, useContext, useEffect, useMemo, type ReactNode } from 'react'

export type Lang = 'pt' | 'en'
export const LANGS: Lang[] = ['pt', 'en']

/** Conteúdo bilíngue. Toda string visível na documentação usa este formato. */
export interface Localized<T = ReactNode> {
  pt: T
  en: T
}

interface LangContextValue {
  lang: Lang
  /** Escolhe o idioma atual de um conteúdo bilíngue. */
  t: <T>(value: Localized<T>) => T
  /** Prefixa um caminho interno com o idioma: `to('/components/button')` → `/pt/components/button`. */
  to: (path: string) => string
  /** Locale do `@orangesys/ui` correspondente. */
  uiLocale: 'pt-BR' | 'en-US'
}

const LangContext = createContext<LangContextValue | null>(null)

export function LangProvider({ lang, children }: { lang: Lang; children: ReactNode }) {
  const t = useCallback(<T,>(value: Localized<T>) => value[lang], [lang])
  useEffect(() => {
    document.documentElement.lang = lang === 'pt' ? 'pt-BR' : 'en'
  }, [lang])
  const to = useCallback((path: string) => `/${lang}${path.startsWith('/') ? path : `/${path}`}`, [lang])
  const value = useMemo<LangContextValue>(
    () => ({ lang, t, to, uiLocale: lang === 'pt' ? 'pt-BR' : 'en-US' }),
    [lang, t, to],
  )
  return <LangContext.Provider value={value}>{children}</LangContext.Provider>
}

export function useLang(): LangContextValue {
  const ctx = useContext(LangContext)
  if (!ctx) throw new Error('useLang precisa estar dentro de <LangProvider>')
  return ctx
}

/** Atalho em JSX: <T pt="Olá" en="Hello" /> */
export function T({ pt, en }: Localized) {
  const { lang } = useLang()
  return <>{lang === 'pt' ? pt : en}</>
}

export const isLang = (value: string | undefined): value is Lang => value === 'pt' || value === 'en'
