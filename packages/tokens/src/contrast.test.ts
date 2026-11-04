import { describe, expect, it } from 'vitest'
import { themes, type ThemeName } from './index'
import { contrastRatio } from './contrast'

/**
 * Garante que os pares de cores semânticos atendem WCAG 2.2 AA:
 * 4.5:1 para texto normal e 3:1 para componentes de interface (1.4.11).
 */
const textPairs: [fg: string, bg: string][] = [
  ['text', 'bg'],
  ['text', 'surface-raised'],
  ['text-muted', 'bg'],
  ['text-subtle', 'bg'],
  ['text-on-accent', 'accent'],
  ['text-on-accent', 'accent-hover'],
  ['text-on-neutral', 'neutral'],
  ['text-on-danger', 'danger'],
  ['accent-text', 'bg'],
  ['success-text', 'bg'],
  ['warning-text', 'bg'],
  ['danger-text', 'bg'],
  ['info-text', 'bg'],
  ['text-inverse', 'surface-inverse'],
  ['code-text', 'code-bg'],
]

const uiPairs: [fg: string, bg: string][] = [
  // Componentes inativos são isentos da 1.4.3, mas mantemos ≥ 3:1 para baixa visão.
  ['text-disabled', 'bg'],
  ['border-control', 'bg'],
  ['border-control', 'surface'],
  ['focus', 'bg'],
  ['accent', 'bg'],
]

describe.each(Object.keys(themes) as ThemeName[])('tema %s', (name) => {
  const t = themes[name] as unknown as Record<string, string>

  it.each(textPairs)('texto %s sobre %s ≥ 4.5:1', (fg, bg) => {
    expect(contrastRatio(t[fg], t[bg])).toBeGreaterThanOrEqual(4.5)
  })

  it.each(uiPairs)('elemento de UI %s sobre %s ≥ 3:1', (fg, bg) => {
    expect(contrastRatio(t[fg], t[bg])).toBeGreaterThanOrEqual(3)
  })
})
