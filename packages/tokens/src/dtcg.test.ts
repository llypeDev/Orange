import { describe, expect, it } from 'vitest'
import {
  buildDtcgBundle,
  buildDtcgFiles,
  buildPrimitiveTokens,
  buildThemeTokens,
  buildTokensStudioThemes,
  dtcgSets,
  figmaCollections,
  flattenTokens,
  parseAlias,
  toDtcgColor,
  type DtcgColor,
  type DtcgGroup,
} from './dtcg'
import { themeNames, themes, vizThemes } from './index'

const primitivesSet = buildPrimitiveTokens()
const primitiveTokens = flattenTokens(primitivesSet)
const byPath = new Map(primitiveTokens.map((t) => [t.path.join('.'), t]))

/** Hex (com alfa, quando houver) de uma cor DTCG — para comparar com o CSS. */
const cssOf = (color: DtcgColor) => {
  if (color.alpha === undefined) return color.hex
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(color.hex.slice(i, i + 2), 16))
  return `rgba(${r}, ${g}, ${b}, ${color.alpha})`
}

describe('toDtcgColor', () => {
  it('converte hex e rgba para o formato 2025.10 com hex de reserva', () => {
    expect(toDtcgColor('#ff8000')).toEqual({ colorSpace: 'srgb', components: [1, 0.502, 0], hex: '#ff8000' })
    expect(toDtcgColor('rgba(245, 133, 73, 0.12)')).toEqual({
      colorSpace: 'srgb',
      components: [0.9608, 0.5216, 0.2863],
      alpha: 0.12,
      hex: '#f58549',
    })
  })

  it('recusa formatos desconhecidos', () => {
    expect(() => toDtcgColor('color-mix(in srgb, red, blue)')).toThrow(/não suportada/)
  })
})

describe('primitivas', () => {
  it('trazem cor, espaço, raio, tipografia e movimento', () => {
    expect(Object.keys(primitivesSet)).toEqual(['color', 'space', 'radius', 'font', 'motion'])
    expect(byPath.get('color.orange.500')?.type).toBe('color')
    expect(byPath.get('space.4')?.token.$value).toEqual({ value: 1, unit: 'rem' })
    expect(byPath.get('radius.none')?.token.$value).toEqual({ value: 0, unit: 'px' })
    expect(byPath.get('font.family.display')?.token.$value).toEqual([
      'Space Grotesk',
      'system-ui',
      '-apple-system',
      'Segoe UI',
      'sans-serif',
    ])
    expect(byPath.get('font.weight.bold')?.token.$value).toBe(700)
    expect(byPath.get('motion.duration.fast')?.token.$value).toEqual({ value: 160, unit: 'ms' })
    expect(byPath.get('motion.easing.out')?.token.$value).toEqual([0.22, 1, 0.36, 1])
    expect(byPath.get('motion.stagger')?.type).toBe('duration')
  })

  it('guardam a custom property CSS de cada token, sem repetir', () => {
    const vars = primitiveTokens.map((t) => t.token.$extensions?.['orange.cssVar'])
    expect(vars.every((v) => typeof v === 'string' && v.startsWith('--or-'))).toBe(true)
    expect(new Set(vars).size).toBe(vars.length)
    expect(byPath.get('color.orange.500')?.token.$extensions).toEqual({
      'orange.cssVar': '--or-palette-orange-500',
    })
  })
})

describe.each(themeNames)('modo %s', (name) => {
  const tokens = flattenTokens(buildThemeTokens(name))
  const expected = { ...themes[name], ...vizThemes[name] } as Record<string, string>

  it('tem um token por --or-color-* do tema (inclusive viz)', () => {
    expect(tokens.map((t) => t.path[1]).sort()).toEqual(Object.keys(expected).sort())
    expect(tokens.every((t) => t.type === 'color')).toBe(true)
  })

  it('aliases apontam para a primitiva de mesmo valor; cores cruas têm o mesmo valor do CSS', () => {
    for (const { path, token } of tokens) {
      const alias = parseAlias(token.$value)
      const value = alias
        ? (byPath.get(alias.join('.'))?.token.$value as DtcgColor | undefined)
        : (token.$value as DtcgColor)
      expect(value, `${path.join('.')} → ${String(token.$value)}`).toBeDefined()
      expect(cssOf(value as DtcgColor), path.join('.')).toBe(expected[path[1]].toLowerCase())
    }
  })

  it('a maioria dos tokens é alias (só transparências e ajustes finos ficam crus)', () => {
    const aliases = tokens.filter((t) => parseAlias(t.token.$value)).length
    expect(aliases / tokens.length).toBeGreaterThan(0.75)
  })
})

describe('arquivos', () => {
  const files = buildDtcgFiles()

  it('um arquivo por conjunto — primitivas e um por tema — mais $themes e $metadata', () => {
    expect(Object.keys(files)).toEqual([
      'primitivas.json',
      'tema/dark.json',
      'tema/light.json',
      'tema/dark-hc.json',
      'tema/light-hc.json',
      '$themes.json',
      '$metadata.json',
    ])
    expect(files['$metadata.json']).toEqual({
      tokenSetOrder: ['primitivas', 'tema/dark', 'tema/light', 'tema/dark-hc', 'tema/light-hc'],
    })
  })

  it('temas do Tokens Studio: uma coleção de primitivas e uma de tema com 4 modos', () => {
    const studio = buildTokensStudioThemes()
    expect(studio.filter((t) => t.group === figmaCollections.primitives)).toHaveLength(1)
    const modes = studio.filter((t) => t.group === figmaCollections.theme)
    expect(modes.map((t) => t.name)).toEqual([...themeNames])
    for (const mode of modes) {
      expect(mode.selectedTokenSets).toEqual({
        [dtcgSets.primitives]: 'source',
        [dtcgSets.theme(mode.name as (typeof themeNames)[number])]: 'enabled',
      })
    }
  })

  it('o pacote único traz os mesmos conjuntos', () => {
    const bundle = buildDtcgBundle()
    for (const [file, content] of Object.entries(files)) {
      expect(bundle[file.replace(/\.json$/, '')]).toEqual(content)
    }
  })

  it('nomes de tokens e grupos válidos no DTCG (sem . { } e sem $ no início)', () => {
    const check = (group: DtcgGroup) => {
      for (const { path } of flattenTokens(group)) {
        for (const part of path) expect(part, path.join('.')).toMatch(/^[^$.{}][^.{}]*$/)
      }
    }
    check(primitivesSet)
    for (const name of themeNames) check(buildThemeTokens(name))
  })
})
