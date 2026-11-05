/*
 * Utilitários internos do DateRangePicker/RangeCalendar (não exportados pela
 * biblioteca, exceto os tipos públicos reexportados no index). Complementam
 * `../DatePicker/dateUtils` — todas as datas no fuso local, à meia-noite.
 */
import type { MessageKey } from '../../providers'
import {
  addDays,
  addMonths,
  addYears,
  daysInMonth,
  endOfWeek,
  formatDateInput,
  isOutOfRange,
  maskDateInput,
  parseDateInput,
  startOfDay,
  startOfWeek,
  type DateFormatPattern,
  type WeekDay,
} from '../DatePicker/dateUtils'

/** Período com início e fim (cada um pode estar vazio enquanto é preenchido). */
export interface DateRange {
  start: Date | null
  end: Date | null
}

/** Período completo — o que o `RangeCalendar` emite e um atalho retorna. */
export interface CompleteDateRange {
  start: Date
  end: Date
}

/** Atalhos prontos, com rótulos traduzidos pelo `OrangeProvider`. */
export type DateRangePresetKey =
  | 'today'
  | 'last7Days'
  | 'last30Days'
  | 'thisWeek'
  | 'thisMonth'
  | 'lastMonth'
  | 'thisYear'

/** Atalho de período exibido ao lado do calendário. */
export interface DateRangePreset {
  /** Texto do botão ("Últimos 7 dias"). */
  label: string
  /** Calcula o período na hora (datas relativas a hoje). */
  range: () => CompleteDateRange
}

export const presetLabelKeys: Record<DateRangePresetKey, MessageKey> = {
  today: 'today',
  last7Days: 'dateRangeLast7Days',
  last30Days: 'dateRangeLast30Days',
  thisWeek: 'dateRangeThisWeek',
  thisMonth: 'dateRangeThisMonth',
  lastMonth: 'dateRangeLastMonth',
  thisYear: 'dateRangeThisYear',
}

/**
 * Períodos dos atalhos prontos. "Esta semana", "Este mês" e "Este ano" vão
 * do primeiro dia até hoje (filtros de relatório olham para o passado).
 */
export function resolvePresetRange(
  key: DateRangePresetKey,
  today: Date,
  weekStartsOn: WeekDay,
): CompleteDateRange {
  const day = startOfDay(today)
  const year = day.getFullYear()
  const month = day.getMonth()
  switch (key) {
    case 'today':
      return { start: day, end: day }
    case 'last7Days':
      return { start: addDays(day, -6), end: day }
    case 'last30Days':
      return { start: addDays(day, -29), end: day }
    case 'thisWeek':
      return { start: startOfWeek(day, weekStartsOn), end: day }
    case 'thisMonth':
      return { start: new Date(year, month, 1), end: day }
    case 'lastMonth': {
      const previous = new Date(year, month - 1, 1)
      return {
        start: previous,
        end: new Date(
          previous.getFullYear(),
          previous.getMonth(),
          daysInMonth(previous.getFullYear(), previous.getMonth()),
        ),
      }
    }
    case 'thisYear':
      return { start: new Date(year, 0, 1), end: day }
  }
}

const DAY_MS = 24 * 60 * 60 * 1000

/** `a − b` em dias inteiros (seguro com horário de verão). */
export function differenceInDays(a: Date, b: Date): number {
  return Math.round((startOfDay(a).getTime() - startOfDay(b).getTime()) / DAY_MS)
}

/** Chave numérica do dia (ou `null`), para comparar e usar em dependências. */
export function dayKey(date: Date | null | undefined): number | null {
  return date ? startOfDay(date).getTime() : null
}

export function isSameRange(a: DateRange, b: DateRange): boolean {
  return dayKey(a.start) === dayKey(b.start) && dayKey(a.end) === dayKey(b.end)
}

/** Primeiro dia do mês de `date`. */
export function startOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1)
}

export type RangeErrorKind = 'order' | 'tooShort' | 'tooLong'

/**
 * Valida um período completo. O comprimento é medido em dias entre as datas
 * (`fim − início`), como noites de hospedagem: 10/03 → 12/03 = 2.
 */
export function getRangeError(
  start: Date,
  end: Date,
  minLength?: number,
  maxLength?: number,
): RangeErrorKind | null {
  const length = differenceInDays(end, start)
  if (length < 0) return 'order'
  if (minLength !== undefined && length < minLength) return 'tooShort'
  if (maxLength !== undefined && length > maxLength) return 'tooLong'
  return null
}

export interface RangeConstraints {
  min?: Date
  max?: Date
  isDateDisabled?: (date: Date) => boolean
  minLength?: number
  maxLength?: number
}

export function isDateUnavailable(date: Date, { min, max, isDateDisabled }: RangeConstraints) {
  return isOutOfRange(date, min, max) || !!isDateDisabled?.(date)
}

/** O período inteiro respeita min/max, datas desabilitadas nas pontas e o comprimento. */
export function isRangeAllowed(range: CompleteDateRange, constraints: RangeConstraints): boolean {
  return (
    !isDateUnavailable(range.start, constraints) &&
    !isDateUnavailable(range.end, constraints) &&
    getRangeError(range.start, range.end, constraints.minLength, constraints.maxLength) === null
  )
}

/**
 * Destino do foco para uma tecla na grade (padrão "grid" do WAI-ARIA APG).
 * Retorna `null` para teclas que não navegam.
 */
export function getKeyboardTarget(
  key: string,
  shiftKey: boolean,
  date: Date,
  weekStartsOn: WeekDay,
): Date | null {
  switch (key) {
    case 'ArrowLeft':
      return addDays(date, -1)
    case 'ArrowRight':
      return addDays(date, 1)
    case 'ArrowUp':
      return addDays(date, -7)
    case 'ArrowDown':
      return addDays(date, 7)
    case 'Home':
      return startOfWeek(date, weekStartsOn)
    case 'End':
      return endOfWeek(date, weekStartsOn)
    case 'PageUp':
      return shiftKey ? addYears(date, -1) : addMonths(date, -1)
    case 'PageDown':
      return shiftKey ? addYears(date, 1) : addMonths(date, 1)
    default:
      return null
  }
}

/**
 * Aplica a máscara do locale (a mesma do DatePicker) e calcula onde o cursor
 * deve ficar. Aceita colar uma data ISO (`aaaa-mm-dd`).
 */
export function applyDateMask(
  raw: string,
  caret: number,
  pattern: DateFormatPattern,
): { text: string; caret: number } {
  const iso = /^\s*(\d{4})-(\d{2})-(\d{2})\s*$/.exec(raw)
  const text = iso
    ? formatDateInput(new Date(Number(iso[1]), Number(iso[2]) - 1, Number(iso[3])), pattern)
    : maskDateInput(raw, pattern)
  const digitsBefore = raw.slice(0, caret).replace(/\D/g, '').length
  let position = 0
  for (let count = 0; position < text.length && count < digitsBefore; position++) {
    if (/\d/.test(text[position])) count++
  }
  // Digitando no fim (caso comum) o cursor acompanha o fim do texto mascarado.
  return { text, caret: iso || caret >= raw.length ? text.length : position }
}

export type DateInputStatus = 'empty' | 'incomplete' | 'invalid' | 'unavailable' | 'valid'

/** Lê o texto mascarado de um dos campos do período. */
export function readDateInput(
  text: string,
  pattern: DateFormatPattern,
  isUnavailable: (date: Date) => boolean,
): { status: DateInputStatus; date: Date | null } {
  const digits = text.replace(/\D/g, '').length
  if (digits === 0) return { status: 'empty', date: null }
  if (digits < 8) return { status: 'incomplete', date: null }
  const date = parseDateInput(text, pattern)
  if (!date) return { status: 'invalid', date: null }
  return { status: isUnavailable(date) ? 'unavailable' : 'valid', date }
}
