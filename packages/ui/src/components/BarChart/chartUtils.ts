/**
 * Utilitários internos dos gráficos (BarChart, LineChart, Sparkline).
 * Não são exportados pela biblioteca.
 */

/** Formato dos valores: uma função ou opções de `Intl.NumberFormat` (ex.: moeda BRL). */
export type ChartValueFormat = ((value: number) => string) | Intl.NumberFormatOptions

/** Uma série do gráfico: chave em `values`, rótulo e cor opcional. */
export interface ChartSeries {
  /** Chave do valor em `data[i].values`. */
  key: string
  /** Nome da série (legenda, dica, tabela). */
  label: string
  /** Cor da série. Padrão: `--or-color-viz-1…5`, na ordem das séries. */
  color?: string
}

/** Uma categoria (barra ou ponto do eixo X) com o valor de cada série. */
export interface ChartDatum {
  /** Rótulo da categoria: mês, canal, região… */
  label: string
  /** Valor de cada série pela `key`. `null`/ausente = sem dado. */
  values: Record<string, number | null | undefined>
}

/** Quantidade de cores categóricas: a partir da sexta série, use "Outros". */
export const VIZ_CATEGORICAL_COUNT = 5

/** Cor da série na posição `index`: a da própria série ou o token categórico. */
export function seriesColor(series: Pick<ChartSeries, 'color'>, index: number): string {
  if (series.color) return series.color
  return index < VIZ_CATEGORICAL_COUNT ? `var(--or-color-viz-${index + 1})` : 'var(--or-color-viz-other)'
}

/** Número finito ou `null` (ausente, `NaN`, `Infinity`). */
export function valueOf(datum: ChartDatum, key: string): number | null {
  const value = datum.values[key]
  return typeof value === 'number' && Number.isFinite(value) ? value : null
}

function numberFormat(locale: string, options?: Intl.NumberFormatOptions): Intl.NumberFormat {
  try {
    return new Intl.NumberFormat(locale, options)
  } catch {
    return new Intl.NumberFormat('pt-BR', options)
  }
}

/** Formata valores completos (dica, tabela, anúncios). */
export function createValueFormatter(locale: string, format?: ChartValueFormat): (value: number) => string {
  if (typeof format === 'function') return format
  const formatter = numberFormat(locale, format)
  return (value) => formatter.format(value)
}

/** Casas decimais de um número (`0.25` → 2). */
function decimalsOf(value: number): number {
  if (!Number.isFinite(value) || Number.isInteger(value)) return 0
  const text = String(value)
  const exp = text.match(/e-(\d+)$/)
  if (exp) return Number(exp[1])
  return text.split('.')[1]?.length ?? 0
}

/**
 * Formata os rótulos do eixo: mesmos estilo e moeda de `format`, sem casas decimais
 * desnecessárias e compactos (10 mil / 10K) quando o eixo chega a 10.000.
 */
export function createAxisFormatter(
  locale: string,
  format: ChartValueFormat | undefined,
  ticks: number[],
  step: number,
): (value: number) => string {
  if (typeof format === 'function') return format
  const options: Intl.NumberFormatOptions = { ...format }
  delete options.minimumSignificantDigits
  delete options.maximumSignificantDigits
  const maxAbs = Math.max(0, ...ticks.map(Math.abs))
  if (!options.notation && maxAbs >= 10_000) {
    options.notation = 'compact'
    options.minimumFractionDigits = 0
    options.maximumFractionDigits = 1
  } else {
    const decimals = Math.max(0, decimalsOf(step) - (options.style === 'percent' ? 2 : 0))
    options.minimumFractionDigits = 0
    options.maximumFractionDigits = decimals
  }
  const formatter = numberFormat(locale, options)
  return (value) => formatter.format(value)
}

const round = (value: number) => Number.parseFloat(value.toPrecision(12))

export interface NiceScale {
  min: number
  max: number
  step: number
  ticks: number[]
}

/**
 * Escala "redonda" para o eixo: passos de 1, 2, 2,5 ou 5 × 10ⁿ, cobrindo [min, max].
 * `target` é a quantidade aproximada de intervalos.
 */
export function niceScale(min: number, max: number, target = 4): NiceScale {
  let lo = Math.min(min, max)
  let hi = Math.max(min, max)
  if (!Number.isFinite(lo) || !Number.isFinite(hi)) {
    lo = 0
    hi = 1
  }
  if (lo === hi) {
    if (hi === 0) hi = 1
    else if (hi > 0) lo = 0
    else hi = 0
  }
  const rough = (hi - lo) / Math.max(1, target)
  const magnitude = 10 ** Math.floor(Math.log10(rough))
  const normalized = rough / magnitude
  const nice = normalized <= 1 ? 1 : normalized <= 2 ? 2 : normalized <= 2.5 ? 2.5 : normalized <= 5 ? 5 : 10
  const step = round(nice * magnitude)
  const start = round(Math.floor(round(lo / step)) * step)
  const end = round(Math.ceil(round(hi / step)) * step)
  const ticks: number[] = []
  for (let i = 0, value = start; value <= end + step / 2 && i < 50; i++, value = round(start + i * step)) {
    ticks.push(value)
  }
  return { min: start, max: end, step, ticks }
}

/** Quantidade de intervalos do eixo de valores para um comprimento em px. */
export function tickTarget(length: number): number {
  return Math.max(2, Math.min(6, Math.round(length / 56)))
}

/** Largura aproximada de um texto na fonte mono do eixo (12px: 0,6em por caractere). */
export function textWidth(text: string, fontSize = 12): number {
  return Math.ceil(text.length * fontSize * 0.6)
}

/** Encurta um texto (com reticências) para caber em `width` px na fonte mono. */
export function truncate(text: string, width: number, fontSize = 12): string {
  const max = Math.floor(width / (fontSize * 0.6))
  if (text.length <= max) return text
  return max <= 1 ? '…' : `${text.slice(0, max - 1).trimEnd()}…`
}

/** Junta nomes com a conjunção do idioma: "Site, App e Marketplace". */
export function formatList(locale: string, items: string[]): string {
  try {
    return new Intl.ListFormat(locale, { type: 'conjunction' }).format(items)
  } catch {
    return items.join(', ')
  }
}

/** Arredonda coordenadas a 2 casas (SVG mais limpo, sem 74.52000000000001). */
export const px = (value: number) => Math.round(value * 100) / 100

/** Arredonda para meio pixel: linhas de 1px nítidas. */
export const crisp = (value: number) => Math.round(value) + 0.5

export interface ChartPoint {
  index: number
  series: number
  value: number
}

/** Maior e menor valor entre todas as séries (ignora vazios). */
export function extremes(data: ChartDatum[], series: ChartSeries[]): { max: ChartPoint; min: ChartPoint } | null {
  let max: ChartPoint | null = null
  let min: ChartPoint | null = null
  for (let index = 0; index < data.length; index++) {
    for (let si = 0; si < series.length; si++) {
      const value = valueOf(data[index], series[si].key)
      if (value === null) continue
      if (!max || value > max.value) max = { index, series: si, value }
      if (!min || value < min.value) min = { index, series: si, value }
    }
  }
  return max && min ? { max, min } : null
}
