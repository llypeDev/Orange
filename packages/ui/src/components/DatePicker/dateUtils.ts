/*
 * Utilitários de datas internos do DatePicker/Calendar (não exportados pela
 * biblioteca). Todas as datas são tratadas no fuso local, à meia-noite.
 */

export type WeekDay = 0 | 1 | 2 | 3 | 4 | 5 | 6

/** Zera horas, minutos, segundos e milissegundos. */
export function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

export function addDays(date: Date, amount: number): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + amount)
}

/** Soma meses mantendo o dia, limitado ao último dia do mês de destino. */
export function addMonths(date: Date, amount: number): Date {
  const target = new Date(date.getFullYear(), date.getMonth() + amount, 1)
  const lastDay = daysInMonth(target.getFullYear(), target.getMonth())
  return new Date(target.getFullYear(), target.getMonth(), Math.min(date.getDate(), lastDay))
}

export function addYears(date: Date, amount: number): Date {
  return addMonths(date, amount * 12)
}

export function daysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate()
}

export function isSameDay(a: Date | null | undefined, b: Date | null | undefined): boolean {
  return (
    !!a &&
    !!b &&
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
}

export function isSameMonth(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth()
}

/** Compara apenas o dia (ignora horário). */
export function compareDay(a: Date, b: Date): number {
  return startOfDay(a).getTime() - startOfDay(b).getTime()
}

export function startOfWeek(date: Date, weekStartsOn: WeekDay): Date {
  const diff = (date.getDay() - weekStartsOn + 7) % 7
  return addDays(date, -diff)
}

export function endOfWeek(date: Date, weekStartsOn: WeekDay): Date {
  return addDays(startOfWeek(date, weekStartsOn), 6)
}

/** Limita `date` ao intervalo [min, max] (comparando apenas o dia). */
export function clampDate(date: Date, min?: Date | null, max?: Date | null): Date {
  if (min && compareDay(date, min) < 0) return startOfDay(min)
  if (max && compareDay(date, max) > 0) return startOfDay(max)
  return date
}

export function isOutOfRange(date: Date, min?: Date | null, max?: Date | null): boolean {
  return (!!min && compareDay(date, min) < 0) || (!!max && compareDay(date, max) > 0)
}

/** Semanas (linhas de 7 dias) exibidas na grade do mês. Sempre 6 linhas. */
export function getMonthGrid(year: number, month: number, weekStartsOn: WeekDay): Date[][] {
  const first = startOfWeek(new Date(year, month, 1), weekStartsOn)
  return Array.from({ length: 6 }, (_, w) =>
    Array.from({ length: 7 }, (_, d) => addDays(first, w * 7 + d)),
  )
}

/** `aaaa-mm-dd` (formato ISO de data, usado no input oculto de formulário). */
export function toISODate(date: Date): string {
  const y = String(date.getFullYear()).padStart(4, '0')
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

/** Primeira letra em maiúscula, respeitando o locale. */
export function capitalize(text: string, locale: string): string {
  return text.charAt(0).toLocaleUpperCase(locale) + text.slice(1)
}

export type DateSegment = 'day' | 'month' | 'year'

export interface DateFormatPattern {
  /** Ordem dos segmentos conforme o locale (ex.: pt-BR → dia, mês, ano). */
  order: DateSegment[]
  /** Separador entre segmentos (`/`, `.`, `-`). */
  separator: string
}

const patternCache = new Map<string, DateFormatPattern>()

/** Descobre a ordem dia/mês/ano e o separador usados pelo locale. */
export function getDateFormatPattern(locale: string): DateFormatPattern {
  const cached = patternCache.get(locale)
  if (cached) return cached
  let pattern: DateFormatPattern = { order: ['day', 'month', 'year'], separator: '/' }
  try {
    const parts = new Intl.DateTimeFormat(locale, {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).formatToParts(new Date(2026, 10, 23))
    const order = parts
      .filter((p) => p.type === 'day' || p.type === 'month' || p.type === 'year')
      .map((p) => p.type as DateSegment)
    const literal = parts.find((p) => p.type === 'literal')?.value.trim()
    if (order.length === 3)
      pattern = { order, separator: literal && literal.length === 1 ? literal : '/' }
  } catch {
    // locale inválido: mantém o padrão dd/mm/aaaa
  }
  patternCache.set(locale, pattern)
  return pattern
}

const segmentLength: Record<DateSegment, number> = { day: 2, month: 2, year: 4 }

/**
 * Aplica a máscara de data ao texto digitado: mantém só dígitos (até 8) e
 * insere o separador entre os segmentos conforme a ordem do locale.
 */
export function maskDateInput(raw: string, pattern: DateFormatPattern): string {
  // Um separador digitado depois de um só dígito completa o segmento com zero
  // ("5/3/2026" → "05/03/2026").
  const groups = raw.split(/\D+/)
  let digits = ''
  groups.forEach((group, i) => {
    const isLast = i === groups.length - 1
    let consumed = 0
    let segment = 0
    while (
      segment < pattern.order.length &&
      consumed + segmentLength[pattern.order[segment]] <= digits.length
    ) {
      consumed += segmentLength[pattern.order[segment]]
      segment++
    }
    const needed = segment < pattern.order.length ? segmentLength[pattern.order[segment]] : 0
    const atBoundary = consumed === digits.length
    if (
      !isLast &&
      atBoundary &&
      group.length > 0 &&
      group.length < needed &&
      segment < pattern.order.length - 1
    ) {
      digits += group.padStart(needed, '0')
    } else {
      digits += group
    }
  })
  digits = digits.slice(0, 8)
  let out = ''
  let index = 0
  for (let i = 0; i < pattern.order.length; i++) {
    const len = segmentLength[pattern.order[i]]
    const chunk = digits.slice(index, index + len)
    if (!chunk) break
    out += chunk
    index += len
    if (chunk.length === len && i < pattern.order.length - 1 && digits.length > index)
      out += pattern.separator
  }
  return out
}

/** Formata uma data no padrão numérico do locale (ex.: 23/11/2026). */
export function formatDateInput(date: Date, pattern: DateFormatPattern): string {
  const values: Record<DateSegment, string> = {
    day: String(date.getDate()).padStart(2, '0'),
    month: String(date.getMonth() + 1).padStart(2, '0'),
    year: String(date.getFullYear()).padStart(4, '0'),
  }
  return pattern.order.map((s) => values[s]).join(pattern.separator)
}

/**
 * Converte o texto mascarado em data. Retorna `null` se incompleto ou se a
 * data não existir (ex.: 31/02/2026).
 */
export function parseDateInput(text: string, pattern: DateFormatPattern): Date | null {
  const digits = text.replace(/\D/g, '')
  if (digits.length !== 8) return null
  const values: Partial<Record<DateSegment, number>> = {}
  let index = 0
  for (const segment of pattern.order) {
    const len = segmentLength[segment]
    values[segment] = Number(digits.slice(index, index + len))
    index += len
  }
  const { day = 0, month = 0, year = 0 } = values
  if (year < 1000 || month < 1 || month > 12 || day < 1) return null
  const date = new Date(year, month - 1, day)
  if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day)
    return null
  return date
}
