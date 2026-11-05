import { describe, expect, it } from 'vitest'
import {
  primitive,
  themeMeta,
  themeNames,
  themes,
  vizPalettes,
  vizThemes,
  type ThemeName,
} from './index'
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
  ['text-on-success', 'success'],
  ['text-on-warning', 'warning'],
  ['text-on-info', 'info'],
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
    expect(palette.sequential.map(primitive)).toEqual(
      [1, 2, 3, 4, 5, 6, 7].map((i) => viz[`viz-seq-${i}`]),
    )
    expect(palette.diverging.map(primitive)).toEqual(
      [1, 2, 3, 4, 5, 6, 7].map((i) => viz[`viz-div-${i}`]),
    )
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

/* ---------------------------------------------------------------------------
 * Alto contraste (WCAG AAA)
 *
 * Texto ≥ 7:1 (1.4.6), bordas e foco ≥ 4.5:1, pares de acento ≥ 7:1 e textos de
 * status ≥ 7:1 — sobre todos os fundos onde aparecem. Transparências (`*-subtle`)
 * são compostas sobre o fundo antes da medida.
 * ------------------------------------------------------------------------- */

/** Compõe `rgba(...)` sobre um fundo opaco; hex passa direto. */
function flatten(value: string, background: string): string {
  const match = /rgba?\(([^)]+)\)/.exec(value)
  if (!match) return value
  const [r, g, b, a = 1] = match[1].split(',').map((part) => parseFloat(part))
  const base = [1, 3, 5].map((i) => parseInt(background.slice(i, i + 2), 16))
  return `#${[r, g, b]
    .map((c, i) => Math.round(c * a + base[i] * (1 - a)).toString(16).padStart(2, '0'))
    .join('')}`
}

const highContrastThemes = themeNames.filter((name) => themeMeta[name].highContrast)
const surfaces = ['bg', 'bg-subtle', 'surface', 'surface-raised']

describe('temas de alto contraste', () => {
  it('existem um escuro e um claro, com o esquema certo', () => {
    expect(highContrastThemes).toEqual(['dark-hc', 'light-hc'])
    expect(highContrastThemes.map((name) => themeMeta[name].colorScheme)).toEqual(['dark', 'light'])
  })

  it('definem exatamente os mesmos tokens dos temas padrão', () => {
    for (const name of highContrastThemes) {
      expect(Object.keys(themes[name]).sort()).toEqual(Object.keys(themes.dark).sort())
      expect(Object.keys(vizThemes[name]).sort()).toEqual(Object.keys(vizThemes.dark).sort())
    }
  })
})

describe.each(highContrastThemes)('alto contraste, tema %s', (name) => {
  const t = themes[name] as unknown as Record<string, string>
  const solid = (token: string, over = 'bg') => flatten(t[token], flatten(t[over], t.bg))
  const ratio = (fg: string, bg: string) => contrastRatio(solid(fg), solid(bg))
  const pairs = (fgs: string[], bgs: string[]) => fgs.flatMap((fg) => bgs.map((bg) => [fg, bg]))
  const base = themes[themeMeta[name].colorScheme] as unknown as Record<string, string>

  it.each(pairs(['text', 'text-muted', 'text-subtle'], surfaces))('texto %s sobre %s ≥ 7:1', (fg, bg) => {
    expect(ratio(fg, bg)).toBeGreaterThanOrEqual(7)
  })

  it.each(pairs(['text', 'text-muted'], ['surface-hover', 'surface-active']))(
    'texto %s sobre %s (hover/ativo) ≥ 7:1',
    (fg, bg) => {
      expect(ratio(fg, bg)).toBeGreaterThanOrEqual(7)
    },
  )

  it.each(surfaces)('text-disabled sobre %s ≥ 4.5:1', (bg) => {
    expect(ratio('text-disabled', bg)).toBeGreaterThanOrEqual(4.5)
  })

  it.each(pairs(['border', 'border-subtle', 'border-strong', 'border-control', 'accent-border', 'focus'], surfaces))(
    'borda/foco %s sobre %s ≥ 4.5:1',
    (fg, bg) => {
      expect(ratio(fg, bg)).toBeGreaterThanOrEqual(4.5)
    },
  )

  it('a borda padrão é pelo menos tão forte quanto a border-strong do tema padrão', () => {
    expect(ratio('border', 'bg')).toBeGreaterThanOrEqual(contrastRatio(base['border-strong'], base.bg))
  })

  it.each([
    ['text-on-accent', 'accent'],
    ['text-on-accent', 'accent-hover'],
    ['text-on-accent', 'accent-active'],
    ...pairs(['accent-text'], [...surfaces, 'accent-subtle']),
  ])('acento: %s sobre %s ≥ 7:1', (fg, bg) => {
    expect(ratio(fg, bg)).toBeGreaterThanOrEqual(7)
  })

  it.each(surfaces)('acento como elemento de UI sobre %s ≥ 4.5:1', (bg) => {
    expect(ratio('accent', bg)).toBeGreaterThanOrEqual(4.5)
  })

  const statuses = ['success', 'warning', 'danger', 'info']

  it.each(pairs(statuses.map((s) => `${s}-text`), surfaces))('status: %s sobre %s ≥ 7:1', (fg, bg) => {
    expect(ratio(fg, bg)).toBeGreaterThanOrEqual(7)
  })

  it.each(statuses)('status: %s-text sobre o próprio %s-subtle ≥ 7:1', (status) => {
    expect(ratio(`${status}-text`, `${status}-subtle`)).toBeGreaterThanOrEqual(7)
  })

  it.each([
    ['text-on-danger', 'danger'],
    ['text-on-danger', 'danger-hover'],
    ['text-on-success', 'success'],
    ['text-on-warning', 'warning'],
    ['text-on-info', 'info'],
    ['text-on-neutral', 'neutral'],
    ['text-on-neutral', 'neutral-hover'],
    ['text-inverse', 'surface-inverse'],
    ['code-text', 'code-bg'],
  ])('par de texto %s sobre %s ≥ 7:1', (fg, bg) => {
    expect(ratio(fg, bg)).toBeGreaterThanOrEqual(7)
  })

  it.each(pairs(statuses, ['bg', 'surface']))('cor plena %s sobre %s ≥ 3:1 (ícones, bordas)', (fg, bg) => {
    expect(ratio(fg, bg)).toBeGreaterThanOrEqual(3)
  })

  it('visualização: categóricas e "outros" ≥ 4.5:1 sobre os fundos dos gráficos', () => {
    const viz = vizThemes[name] as Record<string, string>
    for (const key of ['viz-1', 'viz-2', 'viz-3', 'viz-4', 'viz-5', 'viz-other']) {
      for (const bg of ['bg', 'bg-subtle', 'surface-raised']) {
        expect(contrastRatio(viz[key], solid(bg)), `${key} sobre ${bg}`).toBeGreaterThanOrEqual(4.5)
      }
    }
  })
})

/** Matiz (0–360°) de uma cor hex. */
function hue(hex: string): number {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
  const max = Math.max(r, g, b)
  const d = max - Math.min(r, g, b)
  if (d === 0) return 0
  const h = max === r ? ((g - b) / d) % 6 : max === g ? (b - r) / d + 2 : (r - g) / d + 4
  return (h * 60 + 360) % 360
}

describe.each(themeNames)('visualização de dados distinguível, tema %s', (name) => {
  const palette = vizPalettes[name]

  it('as cinco categóricas vêm de famílias diferentes', () => {
    const families = palette.categorical.map((p) => p.slice(0, p.lastIndexOf('-')))
    expect(new Set(families).size).toBe(5)
  })

  it('vizinhas na ordem diferem no matiz (≥ 60°) ou na luminosidade (≥ 1.4:1)', () => {
    const colors = palette.categorical.map(primitive)
    for (let i = 1; i < colors.length; i++) {
      const [a, b] = [colors[i - 1], colors[i]]
      const angle = Math.abs(hue(a) - hue(b))
      const hueGap = Math.min(angle, 360 - angle)
      expect(hueGap >= 60 || contrastRatio(a, b) >= 1.4, `${palette.categorical[i - 1]} × ${palette.categorical[i]}`).toBe(
        true,
      )
    }
  })
})
