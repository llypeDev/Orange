import { describe, expect, it } from 'vitest'
import { figmaCollections, primitivesMode } from '../src/dtcg'
import { themeNames } from '../src/index'
import {
  buildDesiredCollections,
  buildVariablesPayload,
  describePayload,
  isEmptyPayload,
  parseSyncArgs,
  requireSyncEnvironment,
  type FigmaAlias,
  type FigmaColor,
  type FigmaValue,
  type LocalVariables,
  type VariablesPayload,
} from './figma-variables'

const desired = buildDesiredCollections()
const [primitives, theme] = desired

const isAlias = (value: unknown): value is FigmaAlias =>
  typeof value === 'object' && value !== null && (value as FigmaAlias).type === 'VARIABLE_ALIAS'

/**
 * Simula o Figma aplicando um payload: troca ids temporários por reais, cria o
 * modo inicial como "Mode 1" e devolve as cores com precisão reduzida, como a API.
 */
function applyPayload(local: LocalVariables, payload: VariablesPayload): LocalVariables {
  const next: LocalVariables = structuredClone(local)
  const real = new Map<string, string>()
  let n = 100
  const resolve = (id: string) => real.get(id) ?? id
  const round = (value: FigmaValue): FigmaValue => {
    if (isAlias(value)) return { ...value, id: resolve(value.id) }
    if (typeof value === 'object') {
      const c = value as FigmaColor
      const r4 = (x: number) => Math.round(x * 10000) / 10000
      return { r: r4(c.r), g: r4(c.g), b: r4(c.b), a: r4(c.a) }
    }
    return value
  }
  for (const c of payload.variableCollections) {
    const id = `VariableCollectionId:${n++}`
    const modeId = `${n++}:0`
    real.set(c.id, id)
    real.set(c.initialModeId, modeId)
    next.variableCollections[id] = {
      id,
      name: c.name,
      modes: [{ modeId, name: 'Mode 1' }],
      defaultModeId: modeId,
      remote: false,
    }
  }
  for (const m of payload.variableModes) {
    const collection = next.variableCollections[resolve(m.variableCollectionId)]
    if (m.action === 'CREATE') {
      const id = `${n++}:1`
      real.set(m.id, id)
      collection.modes.push({ modeId: id, name: m.name })
    } else {
      const mode = collection.modes.find((x) => x.modeId === resolve(m.id))
      if (!mode) throw new Error(`modo inexistente: ${m.id}`)
      mode.name = m.name
    }
  }
  for (const v of payload.variables) {
    if (v.action === 'CREATE') {
      const id = `VariableID:${n++}`
      real.set(v.id, id)
      next.variables[id] = {
        id,
        name: v.name as string,
        variableCollectionId: resolve(v.variableCollectionId as string),
        resolvedType: v.resolvedType ?? 'COLOR',
        valuesByMode: {},
        remote: false,
        description: v.description ?? '',
        scopes: v.scopes ?? ['ALL_SCOPES'],
        codeSyntax: v.codeSyntax ?? {},
      }
    } else {
      const current = next.variables[resolve(v.id)]
      if (v.description !== undefined) current.description = v.description
      if (v.scopes) current.scopes = v.scopes
      if (v.codeSyntax) current.codeSyntax = v.codeSyntax
    }
  }
  for (const mv of payload.variableModeValues) {
    next.variables[resolve(mv.variableId)].valuesByMode[resolve(mv.modeId)] = round(mv.value)
  }
  return next
}

const findVariable = (local: LocalVariables, collection: string, name: string) => {
  const c = Object.values(local.variableCollections).find((x) => x.name === collection)
  return Object.values(local.variables).find((v) => v.variableCollectionId === c?.id && v.name === name)
}

describe('estado desejado', () => {
  it('duas coleções: primitivas com um modo e tema com um modo por tema', () => {
    expect(desired.map((c) => c.name)).toEqual([figmaCollections.primitives, figmaCollections.theme])
    expect(primitives.modes).toEqual([primitivesMode])
    expect(theme.modes).toEqual([...themeNames])
  })

  it('converte unidades e tipos para a API do Figma', () => {
    const byName = new Map(primitives.variables.map((v) => [v.name, v]))
    expect(byName.get('space/4')).toMatchObject({
      resolvedType: 'FLOAT',
      scopes: ['GAP', 'WIDTH_HEIGHT'],
      codeSyntax: { WEB: 'var(--or-space-4)' },
      valuesByMode: { valor: { value: 16 } },
    })
    expect(byName.get('radius/md')?.valuesByMode.valor).toEqual({ value: 4 })
    expect(byName.get('font/family/display')).toMatchObject({
      resolvedType: 'STRING',
      scopes: ['FONT_FAMILY'],
      valuesByMode: { valor: { value: 'Space Grotesk' } },
    })
    expect(byName.get('font/weight/bold')?.valuesByMode.valor).toEqual({ value: 700 })
    expect(byName.get('motion/duration/fast')?.valuesByMode.valor).toEqual({ value: 160 })
    expect(byName.get('motion/easing/out')?.valuesByMode.valor).toEqual({
      value: 'cubic-bezier(0.22, 1, 0.36, 1)',
    })
    expect(byName.get('color/orange/500')).toMatchObject({
      resolvedType: 'COLOR',
      scopes: [],
      codeSyntax: { WEB: 'var(--or-palette-orange-500)' },
      valuesByMode: { valor: { value: { r: 245 / 255, g: 133 / 255, b: 73 / 255, a: 1 } } },
    })
  })

  it('semânticas: aliases para as primitivas e cores cruas com alfa', () => {
    const bg = theme.variables.find((v) => v.name === 'color/bg')
    expect(bg?.valuesByMode).toEqual({
      dark: { alias: { collection: figmaCollections.primitives, name: 'color/carbon/50' } },
      light: { alias: { collection: figmaCollections.primitives, name: 'color/paper/50' } },
      'dark-hc': { alias: { collection: figmaCollections.primitives, name: 'color/carbon/0' } },
      'light-hc': { alias: { collection: figmaCollections.primitives, name: 'color/paper/0' } },
    })
    const overlay = theme.variables.find((v) => v.name === 'color/overlay')
    expect(overlay?.valuesByMode.dark).toEqual({ value: { r: 5 / 255, g: 5 / 255, b: 7 / 255, a: 0.72 } })
    expect(theme.variables.find((v) => v.name === 'color/viz-1')?.codeSyntax).toEqual({
      WEB: 'var(--or-color-viz-1)',
    })
  })
})

describe('payload para um arquivo vazio', () => {
  const payload = buildVariablesPayload(desired)

  it('cria as coleções e nomeia os modos', () => {
    expect(payload.variableCollections.map((c) => [c.action, c.name])).toEqual([
      ['CREATE', figmaCollections.primitives],
      ['CREATE', figmaCollections.theme],
    ])
    const [prim, tema] = payload.variableCollections
    expect(payload.variableModes).toEqual([
      { action: 'UPDATE', id: prim.initialModeId, name: 'valor', variableCollectionId: prim.id },
      { action: 'UPDATE', id: tema.initialModeId, name: 'dark', variableCollectionId: tema.id },
      ...['light', 'dark-hc', 'light-hc'].map((name) => ({
        action: 'CREATE',
        id: expect.any(String),
        name,
        variableCollectionId: tema.id,
      })),
    ])
  })

  it('cria todas as variáveis com um valor por modo', () => {
    const total = primitives.variables.length + theme.variables.length
    expect(payload.variables).toHaveLength(total)
    expect(payload.variables.every((v) => v.action === 'CREATE')).toBe(true)
    expect(payload.variableModeValues).toHaveLength(primitives.variables.length + theme.variables.length * 4)
  })

  it('aliases apontam para os ids temporários das primitivas do mesmo payload', () => {
    const primitiveIds = new Set(
      payload.variables
        .filter((v) => v.variableCollectionId === payload.variableCollections[0].id)
        .map((v) => v.id),
    )
    const aliases = payload.variableModeValues.filter((mv) => isAlias(mv.value))
    expect(aliases.length).toBeGreaterThan(200)
    for (const mv of aliases) expect(primitiveIds.has((mv.value as FigmaAlias).id)).toBe(true)
  })

  it('ids temporários são únicos e o payload cabe no limite de 4 MB da API', () => {
    const ids = [
      ...payload.variableCollections.map((c) => c.id),
      ...payload.variableModes.filter((m) => m.action === 'CREATE').map((m) => m.id),
      ...payload.variables.map((v) => v.id),
    ]
    expect(new Set(ids).size).toBe(ids.length)
    expect(JSON.stringify(payload).length).toBeLessThan(4 * 1024 * 1024)
  })

  it('descreve o payload numa linha', () => {
    expect(describePayload(payload)).toMatch(/^2 coleção\(ões\) nova\(s\), 3 modo\(s\) novo\(s\), 2 modo\(s\) renomeado\(s\)/)
  })
})

describe('idempotência pelo nome', () => {
  const synced = applyPayload({ variables: {}, variableCollections: {} }, buildVariablesPayload(desired))

  it('rodar de novo sobre o arquivo sincronizado não gera nada', () => {
    const again = buildVariablesPayload(desired, synced)
    expect(again).toEqual({ variableCollections: [], variableModes: [], variables: [], variableModeValues: [] })
    expect(isEmptyPayload(again)).toBe(true)
  })

  it('o arquivo sincronizado preserva os aliases entre coleções', () => {
    const bg = findVariable(synced, figmaCollections.theme, 'color/bg')
    const carbon = findVariable(synced, figmaCollections.primitives, 'color/carbon/0')
    const tema = Object.values(synced.variableCollections).find((c) => c.name === figmaCollections.theme)
    const darkHc = tema?.modes.find((m) => m.name === 'dark-hc')?.modeId as string
    expect(bg?.valuesByMode[darkHc]).toEqual({ type: 'VARIABLE_ALIAS', id: carbon?.id })
  })

  it('só envia o que mudou no Figma (valor e metadados)', () => {
    const edited = structuredClone(synced)
    const accent = findVariable(edited, figmaCollections.theme, 'color/accent')
    const tema = Object.values(edited.variableCollections).find((c) => c.name === figmaCollections.theme)
    const light = tema?.modes.find((m) => m.name === 'light')?.modeId as string
    if (!accent) throw new Error('color/accent não encontrada')
    accent.valuesByMode[light] = { r: 1, g: 0, b: 0, a: 1 }
    accent.description = 'editada à mão'
    const extra = { ...accent, id: 'VariableID:extra', name: 'color/minha-cor' }
    edited.variables[extra.id] = extra

    const payload = buildVariablesPayload(desired, edited)
    expect(payload.variableCollections).toEqual([])
    expect(payload.variableModes).toEqual([])
    expect(payload.variables).toEqual([{ action: 'UPDATE', id: accent.id, description: '' }])
    expect(payload.variableModeValues).toEqual([
      { variableId: accent.id, modeId: light, value: { type: 'VARIABLE_ALIAS', id: expect.any(String) } },
    ])
    // Variáveis que não são do Orange ficam intactas: nada é apagado.
    expect(JSON.stringify(payload)).not.toContain('VariableID:extra')
  })

  it('adota uma coleção criada à mão com um único modo genérico', () => {
    const local: LocalVariables = {
      variables: {},
      variableCollections: {
        'VariableCollectionId:1': {
          id: 'VariableCollectionId:1',
          name: figmaCollections.theme,
          modes: [{ modeId: '1:0', name: 'Mode 1' }],
          defaultModeId: '1:0',
          remote: false,
        },
      },
    }
    const payload = buildVariablesPayload(desired, local)
    expect(payload.variableCollections.map((c) => c.name)).toEqual([figmaCollections.primitives])
    expect(payload.variableModes).toContainEqual({
      action: 'UPDATE',
      id: '1:0',
      name: 'dark',
      variableCollectionId: 'VariableCollectionId:1',
    })
  })

  it('ignora coleções remotas (de bibliotecas) com o mesmo nome', () => {
    const local: LocalVariables = {
      variables: {},
      variableCollections: {
        remote: {
          id: 'remote',
          name: figmaCollections.primitives,
          modes: [{ modeId: '9:0', name: 'valor' }],
          defaultModeId: '9:0',
          remote: true,
        },
      },
    }
    const payload = buildVariablesPayload(desired, local)
    expect(payload.variableCollections.map((c) => c.name)).toContain(figmaCollections.primitives)
  })

  it('falha com mensagem clara se uma variável existe com outro tipo', () => {
    const local = structuredClone(synced)
    const space = findVariable(local, figmaCollections.primitives, 'space/4')
    if (!space) throw new Error('space/4 não encontrada')
    space.resolvedType = 'STRING'
    expect(() => buildVariablesPayload(desired, local)).toThrow(/"space\/4".*STRING.*FLOAT/)
  })
})

describe('linha de comando', () => {
  it('lê --dry-run e --allow-ci e recusa opções desconhecidas', () => {
    expect(parseSyncArgs(['--dry-run'])).toEqual({ dryRun: true, allowCi: false, help: false })
    expect(parseSyncArgs(['--', '--allow-ci'])).toEqual({ dryRun: false, allowCi: true, help: false })
    expect(() => parseSyncArgs(['--force'])).toThrow(/desconhecida/)
  })

  it('não roda em CI por padrão', () => {
    const env = { CI: 'true', FIGMA_TOKEN: 'x', FIGMA_FILE_KEY: 'y' }
    expect(() => requireSyncEnvironment(parseSyncArgs([]), env)).toThrow(/não roda em CI/)
    expect(requireSyncEnvironment(parseSyncArgs(['--allow-ci']), env)).toEqual({ token: 'x', fileKey: 'y' })
  })

  it('explica as variáveis de ambiente que faltam', () => {
    expect(() => requireSyncEnvironment(parseSyncArgs([]), {})).toThrow(
      /Faltam variáveis de ambiente: FIGMA_TOKEN, FIGMA_FILE_KEY[\s\S]*--dry-run/,
    )
    expect(() => requireSyncEnvironment(parseSyncArgs([]), { FIGMA_TOKEN: 'x' })).toThrow(
      /Faltam variáveis de ambiente: FIGMA_FILE_KEY\./,
    )
  })
})
