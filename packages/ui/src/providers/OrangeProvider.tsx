import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { useMediaQuery } from '../hooks'
import { builtInMessages, interpolate, ptBR, type Locale, type MessageKey, type Messages } from './messages'

export type ThemeSetting = 'dark' | 'light' | 'system'
export type ResolvedTheme = 'dark' | 'light'

interface ThemeContextValue {
  /** Preferência escolhida (pode ser `system`). */
  theme: ThemeSetting
  /** Tema efetivamente aplicado. */
  resolvedTheme: ResolvedTheme
  setTheme: (theme: ThemeSetting) => void
}

interface LocaleContextValue {
  locale: Locale
  messages: Messages
  t: (key: MessageKey, vars?: Record<string, string | number>) => string
}

const ThemeContext = createContext<ThemeContextValue | null>(null)
const LocaleContext = createContext<LocaleContextValue | null>(null)

export interface OrangeProviderProps {
  children: ReactNode
  /** Tema inicial (não controlado). Padrão: `dark`. */
  defaultTheme?: ThemeSetting
  /** Tema controlado. */
  theme?: ThemeSetting
  onThemeChange?: (theme: ThemeSetting) => void
  /**
   * Onde aplicar o atributo `data-theme`. `document` (padrão) aplica em `<html>`;
   * `scoped` envolve os filhos em um `<div data-theme>`.
   */
  themeTarget?: 'document' | 'scoped'
  /** Idioma das mensagens internas. Padrão: `pt-BR`. */
  locale?: Locale
  /** Sobrescreve mensagens internas específicas. */
  messages?: Partial<Messages>
}

/**
 * Provedor raiz do Orange: aplica o tema (claro/escuro) e fornece as
 * mensagens internas traduzidas para os componentes.
 */
export function OrangeProvider({
  children,
  defaultTheme = 'dark',
  theme: themeProp,
  onThemeChange,
  themeTarget = 'document',
  locale = 'pt-BR',
  messages: overrides,
}: OrangeProviderProps) {
  const [internalTheme, setInternalTheme] = useState<ThemeSetting>(defaultTheme)
  const theme = themeProp ?? internalTheme
  const prefersLight = useMediaQuery('(prefers-color-scheme: light)')
  const resolvedTheme: ResolvedTheme = theme === 'system' ? (prefersLight ? 'light' : 'dark') : theme

  const setTheme = useCallback(
    (next: ThemeSetting) => {
      if (themeProp === undefined) setInternalTheme(next)
      onThemeChange?.(next)
    },
    [themeProp, onThemeChange],
  )

  useEffect(() => {
    if (themeTarget !== 'document') return
    document.documentElement.setAttribute('data-theme', resolvedTheme)
  }, [resolvedTheme, themeTarget])

  const themeValue = useMemo(() => ({ theme, resolvedTheme, setTheme }), [theme, resolvedTheme, setTheme])

  const localeValue = useMemo<LocaleContextValue>(() => {
    const base = builtInMessages[locale] ?? builtInMessages[locale.split('-')[0]] ?? ptBR
    const messages = { ...base, ...overrides } as Messages
    return { locale, messages, t: (key, vars) => interpolate(messages[key] ?? key, vars) }
  }, [locale, overrides])

  const content =
    themeTarget === 'scoped' ? (
      <div data-theme={resolvedTheme} className="or-theme-scope">
        {children}
      </div>
    ) : (
      children
    )

  return (
    <ThemeContext.Provider value={themeValue}>
      <LocaleContext.Provider value={localeValue}>{content}</LocaleContext.Provider>
    </ThemeContext.Provider>
  )
}

const fallbackLocale: LocaleContextValue = {
  locale: 'pt-BR',
  messages: ptBR,
  t: (key, vars) => interpolate(ptBR[key] ?? key, vars),
}

/** Acessa o tema atual. Funciona fora do provider (retorna `dark`). */
export function useTheme(): ThemeContextValue {
  return (
    useContext(ThemeContext) ?? {
      theme: 'dark',
      resolvedTheme: 'dark',
      setTheme: () => {},
    }
  )
}

/** Acessa idioma e mensagens. Funciona fora do provider (usa pt-BR). */
export function useLocale(): LocaleContextValue {
  return useContext(LocaleContext) ?? fallbackLocale
}
