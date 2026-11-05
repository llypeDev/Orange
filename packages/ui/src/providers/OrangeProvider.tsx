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
import {
  getColorScheme,
  isHighContrastTheme,
  resolveTheme,
  type ColorScheme,
  type ResolvedTheme,
  type ThemeSetting,
} from './theme'


export interface ThemeContextValue {
  /** Preferência escolhida (pode ser `system`). */
  theme: ThemeSetting
  /** Tema efetivamente aplicado (valor de `data-theme`). */
  resolvedTheme: ResolvedTheme
  /** Esquema de cor do tema aplicado: `dark-hc` → `dark`. */
  colorScheme: ColorScheme
  /** `true` com `dark-hc`/`light-hc` (escolhidos ou vindos de `prefers-contrast: more`). */
  highContrast: boolean
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
  /**
   * Tema inicial (não controlado). Padrão: `dark` — ou, num provider aninhado
   * sem `theme`/`defaultTheme` (ex.: só para trocar o idioma), o tema do provider
   * de fora. `system` segue `prefers-color-scheme` e, com `prefers-contrast: more`,
   * usa o tema de alto contraste do mesmo esquema (`dark-hc`/`light-hc`).
   */
  defaultTheme?: ThemeSetting
  /** Tema controlado: `dark`, `light`, `dark-hc`, `light-hc` ou `system`. */
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
 * Provedor raiz do Orange: aplica o tema (escuro, claro ou um dos de alto
 * contraste) e fornece as mensagens internas traduzidas para os componentes.
 */
export function OrangeProvider({
  children,
  defaultTheme,
  theme: themeProp,
  onThemeChange,
  themeTarget = 'document',
  locale = 'pt-BR',
  messages: overrides,
}: OrangeProviderProps) {
  const parent = useContext(ThemeContext)
  // Aninhado sem tema próprio: segue o tema de fora, em vez de voltar ao escuro.
  const inherits = parent !== null && themeProp === undefined && defaultTheme === undefined
  const [internalTheme, setInternalTheme] = useState<ThemeSetting>(defaultTheme ?? 'dark')
  const theme = inherits ? parent.theme : (themeProp ?? internalTheme)
  const prefersLight = useMediaQuery('(prefers-color-scheme: light)')
  const prefersMoreContrast = useMediaQuery('(prefers-contrast: more)')
  const resolvedTheme = resolveTheme(theme, { prefersLight, prefersMoreContrast })

  const ownSetTheme = useCallback(
    (next: ThemeSetting) => {
      if (themeProp === undefined) setInternalTheme(next)
      onThemeChange?.(next)
    },
    [themeProp, onThemeChange],
  )
  const setTheme = inherits ? parent.setTheme : ownSetTheme

  useEffect(() => {
    if (themeTarget !== 'document') return
    document.documentElement.setAttribute('data-theme', resolvedTheme)
  }, [resolvedTheme, themeTarget])

  const themeValue = useMemo<ThemeContextValue>(
    () => ({
      theme,
      resolvedTheme,
      colorScheme: getColorScheme(resolvedTheme),
      highContrast: isHighContrastTheme(resolvedTheme),
      setTheme,
    }),
    [theme, resolvedTheme, setTheme],
  )

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

const fallbackTheme: ThemeContextValue = {
  theme: 'dark',
  resolvedTheme: 'dark',
  colorScheme: 'dark',
  highContrast: false,
  setTheme: () => {},
}

/** Acessa o tema atual. Funciona fora do provider (retorna `dark`). */
export function useTheme(): ThemeContextValue {
  return useContext(ThemeContext) ?? fallbackTheme
}

/** Acessa idioma e mensagens. Funciona fora do provider (usa pt-BR). */
export function useLocale(): LocaleContextValue {
  return useContext(LocaleContext) ?? fallbackLocale
}
