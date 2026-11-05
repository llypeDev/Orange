/**
 * Monta o payload da API REST de variáveis do Figma
 * (`POST /v1/files/:file_key/variables`) a partir dos conjuntos DTCG.
 *
 * Funções puras, sem rede — testadas em `figma-variables.test.ts`. A chamada
 * à API fica em `figma-sync.ts`.
 *
 * - Coleções "Orange / Primitivas" (modo único) e "Orange / Tema" (um modo por tema).
 * - Aliases do DTCG (`{color.orange.500}`) viram `VARIABLE_ALIAS` para a variável
 *   `color/orange/500` da coleção de primitivas.
 * - Idempotente pelo nome: coleções, modos e variáveis existentes são
 *   reaproveitados; só vai no payload o que falta ou mudou. Nada é apagado.
 */
import {
  buildPrimitiveTokens,
  buildThemeTokens,
  cssVarExtension,
  figmaCollections,
  flattenTokens,
  parseAlias,
  primitivesMode,
  type DtcgColor,
  type DtcgDimension,
  type DtcgDuration,
  type DtcgType,
  type FlatToken,
} from '../src/dtcg'
import { themeNames } from '../src/index'

/* -------------------------------------------------------------------------- */
/* Tipos da API do Figma                                                      */
/* -------------------------------------------------------------------------- */

export type FigmaResolvedType = 'COLOR' | 'FLOAT' | 'STRING' | 'BOOLEAN'

export type FigmaScope =
  | 'ALL_SCOPES'
  | 'CORNER_RADIUS'
  | 'GAP'
  | 'WIDTH_HEIGHT'
  | 'FONT_FAMILY'
  | 'FONT_SIZE'
  | 'FONT_WEIGHT'

export interface FigmaColor {
  r: number
  g: number
  b: number
  a: number
}

export interface FigmaAlias {
  type: 'VARIABLE_ALIAS'
  id: string
}

export type FigmaValue = FigmaColor | FigmaAlias | number | string | boolean

export interface FigmaCodeSyntax {
  WEB?: string
  ANDROID?: string
  iOS?: string
}

/** Coleção como vem de `GET /v1/files/:file_key/variables/local`. */
export interface FigmaVariableCollection {
  id: string
  name: string
  modes: { modeId: string; name: string }[]
  defaultModeId: string
  remote: boolean
}

/** Variável como vem de `GET /v1/files/:file_key/variables/local`. */
export interface FigmaVariable {
  id: string
  name: string
  variableCollectionId: string
  resolvedType: FigmaResolvedType
  valuesByMode: Record<string, FigmaValue>
  remote: boolean
  description?: string
  scopes?: string[]
  codeSyntax?: FigmaCodeSyntax
  deletedButReferenced?: boolean
}

/** `meta` da resposta de `GET /v1/files/:file_key/variables/local`. */
export interface LocalVariables {
  variables: Record<string, FigmaVariable>
  variableCollections: Record<string, FigmaVariableCollection>
}

export interface VariablesPayload {
  variableCollections: {
    action: 'CREATE'
    id: string
    name: string
    initialModeId: string
  }[]
  variableModes: {
    action: 'CREATE' | 'UPDATE'
    id: string
    name: string
    variableCollectionId: string
  }[]
  variables: {
    action: 'CREATE' | 'UPDATE'
    id: string
    name?: string
    variableCollectionId?: string
    resolvedType?: FigmaResolvedType
    description?: string
    scopes?: FigmaScope[]
    codeSyntax?: FigmaCodeSyntax
  }[]
  variableModeValues: { variableId: string; modeId: string; value: FigmaValue }[]
}

/* -------------------------------------------------------------------------- */
/* Estado desejado (a partir do DTCG)                                         */
/* -------------------------------------------------------------------------- */

/** Valor literal ou alias para outra variável (coleção + nome). */
export type DesiredValue =
  | { value: Exclude<FigmaValue, FigmaAlias> }
  | { alias: { collection: string; name: string } }

export interface DesiredVariable {
  name: string
  resolvedType: FigmaResolvedType
  description: string
  scopes: FigmaScope[]
  codeSyntax: FigmaCodeSyntax
  valuesByMode: Record<string, DesiredValue>
}

export interface DesiredCollection {
  name: string
  modes: string[]
  variables: DesiredVariable[]
}

/** 1rem em px (o Figma não tem rem: dimensões viram números em px). */
const REM = 16

const figmaName = (path: string[]) => path.join('/')

function toFigmaColor(color: DtcgColor): FigmaColor {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(color.hex.slice(i, i + 2), 16) / 255)
  return { r, g, b, a: color.alpha ?? 1 }
}

const figmaTypes: Record<DtcgType, FigmaResolvedType> = {
  color: 'COLOR',
  dimension: 'FLOAT',
  duration: 'FLOAT',
  number: 'FLOAT',
  fontWeight: 'FLOAT',
  fontFamily: 'STRING',
  cubicBezier: 'STRING',
}

/** Valor literal do token no formato da API (dimensões em px, durações em ms). */
function toFigmaValue(token: FlatToken): Exclude<FigmaValue, FigmaAlias> {
  const value = token.token.$value
  switch (token.type) {
    case 'color':
      return toFigmaColor(value as DtcgColor)
    case 'dimension': {
      const dim = value as DtcgDimension
      return dim.unit === 'rem' ? dim.value * REM : dim.value
    }
    case 'duration': {
      const duration = value as DtcgDuration
      return duration.unit === 's' ? duration.value * 1000 : duration.value
    }
    case 'number':
    case 'fontWeight':
      return value as number
    case 'fontFamily':
      return Array.isArray(value) ? String(value[0]) : String(value)
    case 'cubicBezier':
      return `cubic-bezier(${(value as number[]).join(', ')})`
  }
}

/**
 * Onde cada variável aparece nos seletores do Figma. Primitivas de cor ficam fora
 * dos seletores (servem de origem para os aliases): quem desenha usa as semânticas.
 */
function scopesFor(path: string[]): FigmaScope[] {
  if (path[0] === 'space') return ['GAP', 'WIDTH_HEIGHT']
  if (path[0] === 'radius') return ['CORNER_RADIUS']
  if (path[0] === 'font' && path[1] === 'family') return ['FONT_FAMILY']
  if (path[0] === 'font' && path[1] === 'size') return ['FONT_SIZE']
  if (path[0] === 'font' && path[1] === 'weight') return ['FONT_WEIGHT']
  // Cores primitivas, entrelinha e espaçamento entre letras (sem unidade/em) e movimento:
  // só referência (Dev Mode mostra o codeSyntax), sem aparecer em seletores.
  return []
}

function describeValue(token: FlatToken): string {
  const value = token.token.$value as Partial<DtcgDimension>
  const unit = token.type === 'dimension' && value.unit === 'rem' ? `${value.value}rem` : ''
  return [unit, token.description].filter(Boolean).join(' — ')
}

function variableFrom(token: FlatToken, scopes: FigmaScope[]): Omit<DesiredVariable, 'valuesByMode'> {
  const cssVar = token.token.$extensions?.[cssVarExtension]
  return {
    name: figmaName(token.path),
    resolvedType: figmaTypes[token.type],
    description: describeValue(token),
    scopes,
    codeSyntax: typeof cssVar === 'string' ? { WEB: `var(${cssVar})` } : {},
  }
}

/** As duas coleções do Orange, com todos os modos e valores, prontas para comparar. */
export function buildDesiredCollections(): DesiredCollection[] {
  const primitives: DesiredCollection = {
    name: figmaCollections.primitives,
    modes: [primitivesMode],
    variables: flattenTokens(buildPrimitiveTokens()).map((token) => ({
      ...variableFrom(token, scopesFor(token.path)),
      valuesByMode: { [primitivesMode]: { value: toFigmaValue(token) } },
    })),
  }
  const primitiveNames = new Set(primitives.variables.map((v) => v.name))

  const theme: DesiredCollection = { name: figmaCollections.theme, modes: [...themeNames], variables: [] }
  const byName = new Map<string, DesiredVariable>()
  for (const mode of themeNames) {
    for (const token of flattenTokens(buildThemeTokens(mode))) {
      const name = figmaName(token.path)
      let variable = byName.get(name)
      if (!variable) {
        variable = { ...variableFrom(token, ['ALL_SCOPES']), valuesByMode: {} }
        byName.set(name, variable)
        theme.variables.push(variable)
      }
      const alias = parseAlias(token.token.$value)
      if (alias && !primitiveNames.has(figmaName(alias))) {
        throw new Error(`Alias sem primitiva correspondente: ${token.path.join('.')} → ${alias.join('.')}`)
      }
      variable.valuesByMode[mode] = alias
        ? { alias: { collection: primitives.name, name: figmaName(alias) } }
        : { value: toFigmaValue(token) }
    }
  }
  return [primitives, theme]
}

/* -------------------------------------------------------------------------- */
/* Diferença com o arquivo do Figma                                           */
/* -------------------------------------------------------------------------- */

const isAlias = (value: unknown): value is FigmaAlias =>
  typeof value === 'object' && value !== null && (value as FigmaAlias).type === 'VARIABLE_ALIAS'

const isColor = (value: unknown): value is FigmaColor =>
  typeof value === 'object' && value !== null && 'r' in value && 'g' in value && 'b' in value

function sameValue(current: FigmaValue | undefined, next: FigmaValue): boolean {
  if (current === undefined) return false
  if (isAlias(next)) return isAlias(current) && current.id === next.id
  if (isColor(next)) {
    if (!isColor(current) || isAlias(current)) return false
    const near = (a: number, b: number) => Math.abs(a - b) < 0.5 / 255
    return (
      near(current.r, next.r) &&
      near(current.g, next.g) &&
      near(current.b, next.b) &&
      Math.abs((current.a ?? 1) - next.a) < 0.001
    )
  }
  if (typeof next === 'number') return typeof current === 'number' && Math.abs(current - next) < 1e-6
  return current === next
}

const sameScopes = (a: readonly string[] = [], b: readonly string[]) =>
  a.length === b.length && b.every((scope) => a.includes(scope))

/** Ids temporários legíveis e únicos dentro de um payload. */
function tempIds() {
  const used = new Set<string>()
  return (kind: string, ...parts: string[]) => {
    const base = `tmp-${kind}-${parts.join('-')}`.toLowerCase().replace(/[^a-z0-9-]+/g, '-')
    let id = base
    for (let n = 2; used.has(id); n++) id = `${base}-${n}`
    used.add(id)
    return id
  }
}

const emptyLocal: LocalVariables = { variables: {}, variableCollections: {} }

/**
 * Compara o estado desejado com as variáveis locais do arquivo e devolve o
 * corpo do `POST /v1/files/:file_key/variables` — só com o que falta ou mudou.
 * Sem `local` (ex.: `--dry-run`), gera o payload completo de um arquivo vazio.
 */
export function buildVariablesPayload(
  desired: DesiredCollection[],
  local: LocalVariables = emptyLocal,
): VariablesPayload {
  const payload: VariablesPayload = {
    variableCollections: [],
    variableModes: [],
    variables: [],
    variableModeValues: [],
  }
  const tempId = tempIds()
  const collections = Object.values(local.variableCollections).filter((c) => !c.remote)
  const variables = Object.values(local.variables).filter((v) => !v.remote && !v.deletedButReferenced)

  // 1. Coleções e modos → ids (reais ou temporários).
  const plans = desired.map((collection) => {
    const existing = collections.find((c) => c.name === collection.name)
    const modeIds = new Map<string, string>()
    let collectionId: string
    if (!existing) {
      collectionId = tempId('collection', collection.name)
      const initialModeId = tempId('mode', collection.name, collection.modes[0])
      payload.variableCollections.push({ action: 'CREATE', id: collectionId, name: collection.name, initialModeId })
      // O modo inicial nasce como "Mode 1": renomeia para o primeiro modo do Orange.
      payload.variableModes.push({
        action: 'UPDATE',
        id: initialModeId,
        name: collection.modes[0],
        variableCollectionId: collectionId,
      })
      modeIds.set(collection.modes[0], initialModeId)
    } else {
      collectionId = existing.id
      for (const mode of existing.modes) {
        if (collection.modes.includes(mode.name)) modeIds.set(mode.name, mode.modeId)
      }
      // Coleção criada à mão com um único modo genérico: adota esse modo como o primeiro.
      if (modeIds.size === 0 && existing.modes.length === 1) {
        const [only] = existing.modes
        payload.variableModes.push({
          action: 'UPDATE',
          id: only.modeId,
          name: collection.modes[0],
          variableCollectionId: collectionId,
        })
        modeIds.set(collection.modes[0], only.modeId)
      }
    }
    for (const mode of collection.modes) {
      if (modeIds.has(mode)) continue
      const id = tempId('mode', collection.name, mode)
      payload.variableModes.push({ action: 'CREATE', id, name: mode, variableCollectionId: collectionId })
      modeIds.set(mode, id)
    }
    const existingVariables = existing ? variables.filter((v) => v.variableCollectionId === existing.id) : []
    return { collection, collectionId, modeIds, existingVariables }
  })

  // 2. Variáveis → ids; cria as que faltam e atualiza metadados que mudaram.
  const variableIds = new Map<string, string>()
  const key = (collection: string, name: string) => `${collection}\u0000${name}`
  const existingById = new Map<string, FigmaVariable>()
  for (const { collection, collectionId, existingVariables } of plans) {
    for (const variable of collection.variables) {
      const current = existingVariables.find((v) => v.name === variable.name)
      if (current) {
        if (current.resolvedType !== variable.resolvedType) {
          throw new Error(
            `A variável "${variable.name}" em "${collection.name}" já existe como ${current.resolvedType}, ` +
              `mas o Orange espera ${variable.resolvedType}. Apague ou renomeie a variável no Figma e rode de novo.`,
          )
        }
        variableIds.set(key(collection.name, variable.name), current.id)
        existingById.set(current.id, current)
        const update: VariablesPayload['variables'][number] = { action: 'UPDATE', id: current.id }
        if ((current.description ?? '') !== variable.description) update.description = variable.description
        if (!sameScopes(current.scopes, variable.scopes)) update.scopes = variable.scopes
        if ((current.codeSyntax?.WEB ?? '') !== (variable.codeSyntax.WEB ?? '')) {
          update.codeSyntax = { ...current.codeSyntax, ...variable.codeSyntax }
        }
        if (Object.keys(update).length > 2) payload.variables.push(update)
      } else {
        const id = tempId('variable', collection.name, variable.name)
        variableIds.set(key(collection.name, variable.name), id)
        payload.variables.push({
          action: 'CREATE',
          id,
          name: variable.name,
          variableCollectionId: collectionId,
          resolvedType: variable.resolvedType,
          description: variable.description,
          scopes: variable.scopes,
          codeSyntax: variable.codeSyntax,
        })
      }
    }
  }

  // 3. Valores por modo (aliases resolvidos para ids reais ou temporários).
  for (const { collection, modeIds } of plans) {
    for (const variable of collection.variables) {
      const variableId = variableIds.get(key(collection.name, variable.name)) as string
      const current = existingById.get(variableId)
      for (const mode of collection.modes) {
        const wanted = variable.valuesByMode[mode]
        if (!wanted) throw new Error(`"${variable.name}" não tem valor para o modo "${mode}".`)
        let value: FigmaValue
        if ('alias' in wanted) {
          const target = variableIds.get(key(wanted.alias.collection, wanted.alias.name))
          if (!target) throw new Error(`Alias sem destino: ${variable.name} → ${wanted.alias.name}`)
          value = { type: 'VARIABLE_ALIAS', id: target }
        } else {
          value = wanted.value
        }
        const modeId = modeIds.get(mode) as string
        if (current && sameValue(current.valuesByMode[modeId], value)) continue
        payload.variableModeValues.push({ variableId, modeId, value })
      }
    }
  }

  return payload
}

export function isEmptyPayload(payload: VariablesPayload): boolean {
  return Object.values(payload).every((list) => list.length === 0)
}

/** Resumo de uma linha, para o terminal. */
export function describePayload(payload: VariablesPayload): string {
  const count = <T>(list: T[], test: (item: T) => boolean) => list.filter(test).length
  return [
    `${payload.variableCollections.length} coleção(ões) nova(s)`,
    `${count(payload.variableModes, (m) => m.action === 'CREATE')} modo(s) novo(s)`,
    `${count(payload.variableModes, (m) => m.action === 'UPDATE')} modo(s) renomeado(s)`,
    `${count(payload.variables, (v) => v.action === 'CREATE')} variável(is) nova(s)`,
    `${count(payload.variables, (v) => v.action === 'UPDATE')} atualizada(s)`,
    `${payload.variableModeValues.length} valor(es)`,
  ].join(', ')
}

/* -------------------------------------------------------------------------- */
/* Linha de comando                                                           */
/* -------------------------------------------------------------------------- */

export interface SyncOptions {
  dryRun: boolean
  allowCi: boolean
  help: boolean
}

export function parseSyncArgs(argv: string[]): SyncOptions {
  const known = new Set(['--dry-run', '--allow-ci', '--help', '-h'])
  const unknown = argv.filter((arg) => arg !== '--' && !known.has(arg))
  if (unknown.length) throw new Error(`Opção desconhecida: ${unknown.join(' ')}. Use --help.`)
  return {
    dryRun: argv.includes('--dry-run'),
    allowCi: argv.includes('--allow-ci'),
    help: argv.includes('--help') || argv.includes('-h'),
  }
}

export const usage = `Uso: pnpm --filter @orange/tokens figma:sync [--dry-run] [--allow-ci]

Envia os tokens do Orange para as variáveis de um arquivo do Figma
(coleções "${figmaCollections.primitives}" e "${figmaCollections.theme}").

  --dry-run   mostra o payload (como para um arquivo vazio) sem chamar a API
  --allow-ci  permite rodar com CI=true (por padrão, o script se recusa)

Variáveis de ambiente:
  FIGMA_TOKEN     token pessoal do Figma com os escopos file_variables:read e file_variables:write
  FIGMA_FILE_KEY  chave do arquivo (o trecho depois de /design/ na URL)

A API REST de variáveis exige um plano do Figma com acesso de escrita à API.`

const truthy = (value: string | undefined) => !!value && value !== '0' && value !== 'false'

/** Confere o ambiente antes de chamar a API; lança um erro com instruções claras. */
export function requireSyncEnvironment(
  options: SyncOptions,
  env: Record<string, string | undefined>,
): { token: string; fileKey: string } {
  if (truthy(env.CI) && !options.allowCi) {
    throw new Error(
      'figma:sync não roda em CI por padrão (CI está definido). ' +
        'Use --dry-run para só ver o payload, ou --allow-ci se a sincronização em CI for intencional.',
    )
  }
  const token = env.FIGMA_TOKEN?.trim()
  const fileKey = env.FIGMA_FILE_KEY?.trim()
  const missing = [!token && 'FIGMA_TOKEN', !fileKey && 'FIGMA_FILE_KEY'].filter(Boolean)
  if (missing.length) {
    throw new Error(
      [
        `Faltam variáveis de ambiente: ${missing.join(', ')}.`,
        '  FIGMA_TOKEN     token pessoal do Figma com os escopos file_variables:read e file_variables:write',
        '  FIGMA_FILE_KEY  chave do arquivo (o trecho depois de /design/ na URL do Figma)',
        'Para ver o payload sem chamar a API: pnpm --filter @orange/tokens figma:sync --dry-run',
      ].join('\n'),
    )
  }
  return { token: token as string, fileKey: fileKey as string }
}
