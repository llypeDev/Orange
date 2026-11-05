import { describe, expect, it } from 'vitest'
import { primitive, themes, vizPalettes, vizThemes, type ThemeName } from './index'
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

/**
 * Visualização de dados: as marcas categóricas (e o neutro "Outros") são elementos gráficos
 * (WCAG 1.4.11) e precisam de ≥ 3:1 contra o fundo da página e dos cartões onde o gráfico vive.
 */
describe.each(Object.keys(vizThemes) as ThemeName[])('visualização de dados, tema %s', (name) => {
  const t = themes[name] as unknown as Record<string, string>
  const viz = vizThemes[name] as Record<string, string>
  const categorical = ['viz-1', 'viz-2', 'viz-3', 'viz-4', 'viz-5', 'viz-other']

  it.each(categorical.flatMap((fg) => ['bg', 'surface-raised'].map((bg) => [fg, bg])))(
    'cor categórica %s sobre %s ≥ 3:1',
    (fg, bg) => {
      expect(contrastRatio(viz[fg], t[bg])).toBeGreaterThanOrEqual(3)
    },
  )

  it('tokens espelham as primitivas da paleta, na ordem', () => {
    const palette = vizPalettes[name]
    expect(palette.categorical.map(primitive)).toEqual(
      ['viz-1', 'viz-2', 'viz-3', 'viz-4', 'viz-5'].map((k) => viz[k]),
    )
    expect(viz['viz-other']).toBe(primitive(palette.other))
    expect(palette.sequential.map(primitive)).toEqual([1, 2, 3, 4, 5, 6, 7].map((i) => viz[`viz-seq-${i}`]))
    expect(palette.diverging.map(primitive)).toEqual([1, 2, 3, 4, 5, 6, 7].map((i) => viz[`viz-div-${i}`]))
  })

  it('cores categóricas são distintas entre si', () => {
    const colors = categorical.map((k) => viz[k].toLowerCase())
    expect(new Set(colors).size).toBe(colors.length)
  })

  it('sequencial: o valor mais alto é o que mais contrasta com o fundo', () => {
    const ratios = [1, 2, 3, 4, 5, 6, 7].map((i) => contrastRatio(viz[`viz-seq-${i}`], t.bg))
    expect([...ratios].sort((a, b) => a - b)).toEqual(ratios)
  })
})
