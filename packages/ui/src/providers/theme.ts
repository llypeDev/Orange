/**
 * Temas do Orange: os mesmos `[data-theme]` gerados por `@orangesys/tokens`
 * (a lista é conferida contra os tokens em `OrangeProvider.test.tsx`).
 */

/** Temas prontos, na ordem dos seletores. */
export const themeNames = ['dark', 'light', 'dark-hc', 'light-hc'] as const

/** Tema aplicado de fato (valor de `data-theme`). */
export type ResolvedTheme = (typeof themeNames)[number]

/** Preferência de tema: um tema fixo ou `system` (segue o sistema operacional). */
export type ThemeSetting = ResolvedTheme | 'system'

/** Esquema de cor de um tema. */
export type ColorScheme = 'dark' | 'light'

/** Preferências do sistema usadas para resolver `system`. */
export interface SystemThemePreferences {
  /** `prefers-color-scheme: light`. */
  prefersLight?: boolean
  /** `prefers-contrast: more`. */
  prefersMoreContrast?: boolean
}

/** `true` para os temas prontos (`dark`, `light`, `dark-hc`, `light-hc`). */
export function isThemeName(value: unknown): value is ResolvedTheme {
  return typeof value === 'string' && (themeNames as readonly string[]).includes(value)
}

/** `true` para um tema pronto ou `system` — útil ao ler a preferência salva. */
export function isThemeSetting(value: unknown): value is ThemeSetting {
  return value === 'system' || isThemeName(value)
}

/** `true` para os temas de alto contraste (WCAG AAA). */
export function isHighContrastTheme(theme: ResolvedTheme): boolean {
  return theme.endsWith('-hc')
}

/** Esquema de cor de um tema: `dark-hc` → `dark`. */
export function getColorScheme(theme: ResolvedTheme): ColorScheme {
  return theme.startsWith('light') ? 'light' : 'dark'
}

/**
 * Resolve a preferência no tema aplicado. `system` segue `prefers-color-scheme`
 * e, com `prefers-contrast: more`, troca para o tema de alto contraste do mesmo
 * esquema (`dark` → `dark-hc`, `light` → `light-hc`). Temas fixos não mudam.
 */
export function resolveTheme(
  setting: ThemeSetting,
  { prefersLight = false, prefersMoreContrast = false }: SystemThemePreferences = {},
): ResolvedTheme {
  if (setting !== 'system') return setting
  const scheme: ColorScheme = prefersLight ? 'light' : 'dark'
  return prefersMoreContrast ? `${scheme}-hc` : scheme
}
