import { themeMeta, themeNames as tokenThemeNames } from '@orange/tokens'
import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { OrangeProvider, useTheme } from './OrangeProvider'
import {
  getColorScheme,
  isHighContrastTheme,
  isThemeName,
  isThemeSetting,
  resolveTheme,
  themeNames,
  type ThemeSetting,
} from './theme'

const LIGHT = '(prefers-color-scheme: light)'
const MORE = '(prefers-contrast: more)'

/** `matchMedia` controlável: `set(query, true)` dispara o `change` dos ouvintes. */
function mockMedia(initial: Record<string, boolean> = {}) {
  const state: Record<string, boolean> = { ...initial }
  const listeners = new Map<string, Set<() => void>>()
  const forQuery = (query: string) => {
    if (!listeners.has(query)) listeners.set(query, new Set())
    return listeners.get(query) as Set<() => void>
  }
  vi.spyOn(window, 'matchMedia').mockImplementation(
    (query: string) =>
      ({
        get matches() {
          return state[query] ?? false
        },
        media: query,
        onchange: null,
        addEventListener: (_type: string, listener: () => void) => forQuery(query).add(listener),
        removeEventListener: (_type: string, listener: () => void) => forQuery(query).delete(listener),
        addListener: () => {},
        removeListener: () => {},
        dispatchEvent: () => false,
      }) as unknown as MediaQueryList,
  )
  return {
    set(query: string, value: boolean) {
      state[query] = value
      act(() => forQuery(query).forEach((listener) => listener()))
    },
  }
}

function ThemeProbe() {
  const { theme, resolvedTheme, colorScheme, highContrast, setTheme } = useTheme()
  return (
    <div>
      <output data-testid="state">{`${theme}|${resolvedTheme}|${colorScheme}|${highContrast}`}</output>
      {(['dark-hc', 'light-hc', 'system'] as ThemeSetting[]).map((value) => (
        <button key={value} type="button" onClick={() => setTheme(value)}>
          {value}
        </button>
      ))}
    </div>
  )
}

const state = () => screen.getByTestId('state').textContent
const htmlTheme = () => document.documentElement.getAttribute('data-theme')

afterEach(() => {
  document.documentElement.removeAttribute('data-theme')
})

describe('temas', () => {
  it('são os mesmos temas gerados por @orange/tokens', () => {
    expect([...themeNames]).toEqual([...tokenThemeNames])
    for (const name of themeNames) {
      expect(getColorScheme(name)).toBe(themeMeta[name].colorScheme)
      expect(isHighContrastTheme(name)).toBe(themeMeta[name].highContrast)
    }
  })

  it('isThemeName e isThemeSetting validam valores salvos', () => {
    for (const name of themeNames) expect(isThemeSetting(name)).toBe(true)
    expect(isThemeSetting('system')).toBe(true)
    expect(isThemeName('system')).toBe(false)
    for (const value of ['auto', 'hc', 'Dark', '', null, undefined, 1]) {
      expect(isThemeSetting(value)).toBe(false)
    }
  })

  it('resolveTheme: temas fixos não mudam; system segue esquema e contraste', () => {
    for (const name of themeNames) {
      expect(resolveTheme(name, { prefersLight: true, prefersMoreContrast: true })).toBe(name)
    }
    expect(resolveTheme('system')).toBe('dark')
    expect(resolveTheme('system', { prefersLight: true })).toBe('light')
    expect(resolveTheme('system', { prefersMoreContrast: true })).toBe('dark-hc')
    expect(resolveTheme('system', { prefersLight: true, prefersMoreContrast: true })).toBe('light-hc')
  })
})

describe('OrangeProvider + useTheme', () => {
  it.each([
    ['dark-hc', 'dark', true],
    ['light-hc', 'light', true],
    ['light', 'light', false],
  ] as const)('tema %s aplica data-theme no <html> e expõe esquema e contraste', (theme, scheme, hc) => {
    mockMedia()
    render(
      <OrangeProvider theme={theme}>
        <ThemeProbe />
      </OrangeProvider>,
    )
    expect(htmlTheme()).toBe(theme)
    expect(state()).toBe(`${theme}|${theme}|${scheme}|${hc}`)
  })

  it('system + prefers-contrast: more usa o alto contraste do esquema do sistema', () => {
    mockMedia({ [MORE]: true })
    render(
      <OrangeProvider theme="system">
        <ThemeProbe />
      </OrangeProvider>,
    )
    expect(htmlTheme()).toBe('dark-hc')
    expect(state()).toBe('system|dark-hc|dark|true')
  })

  it('system reage às mudanças de prefers-contrast e prefers-color-scheme', () => {
    const media = mockMedia({ [LIGHT]: true })
    render(
      <OrangeProvider defaultTheme="system">
        <ThemeProbe />
      </OrangeProvider>,
    )
    expect(htmlTheme()).toBe('light')
    media.set(MORE, true)
    expect(htmlTheme()).toBe('light-hc')
    media.set(LIGHT, false)
    expect(htmlTheme()).toBe('dark-hc')
    media.set(MORE, false)
    expect(htmlTheme()).toBe('dark')
  })

  it('uma escolha explícita vence prefers-contrast', () => {
    mockMedia({ [MORE]: true, [LIGHT]: true })
    render(
      <OrangeProvider theme="light">
        <ThemeProbe />
      </OrangeProvider>,
    )
    expect(htmlTheme()).toBe('light')
    expect(state()).toBe('light|light|light|false')
  })

  it('themeTarget="scoped" aplica o tema de alto contraste só no escopo', () => {
    mockMedia()
    render(
      <OrangeProvider theme="light-hc" themeTarget="scoped">
        <ThemeProbe />
      </OrangeProvider>,
    )
    expect(htmlTheme()).toBeNull()
    expect(screen.getByTestId('state').closest('[data-theme]')).toHaveAttribute('data-theme', 'light-hc')
  })

  it('setTheme troca para os temas de alto contraste (não controlado)', async () => {
    mockMedia()
    const user = userEvent.setup()
    render(
      <OrangeProvider>
        <ThemeProbe />
      </OrangeProvider>,
    )
    expect(htmlTheme()).toBe('dark')
    await user.click(screen.getByRole('button', { name: 'light-hc' }))
    expect(htmlTheme()).toBe('light-hc')
    expect(state()).toBe('light-hc|light-hc|light|true')
    await user.click(screen.getByRole('button', { name: 'dark-hc' }))
    expect(htmlTheme()).toBe('dark-hc')
  })

  it('controlado: setTheme só avisa onThemeChange', async () => {
    mockMedia()
    const onThemeChange = vi.fn()
    const user = userEvent.setup()
    render(
      <OrangeProvider theme="dark" onThemeChange={onThemeChange}>
        <ThemeProbe />
      </OrangeProvider>,
    )
    await user.click(screen.getByRole('button', { name: 'dark-hc' }))
    expect(onThemeChange).toHaveBeenCalledWith('dark-hc')
    expect(htmlTheme()).toBe('dark')
  })

  it('fora do provider, useTheme devolve o escuro padrão', () => {
    render(<ThemeProbe />)
    expect(state()).toBe('dark|dark|dark|false')
  })
})
