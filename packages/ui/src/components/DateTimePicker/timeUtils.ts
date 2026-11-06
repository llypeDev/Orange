/*
 * Utilitários internos do DateTimePicker (não exportados pela biblioteca).
 * Complementam `../DatePicker/dateUtils`: todas as datas no fuso local.
 */
import { toISODate } from '../DatePicker/dateUtils'

/** Horário lido do `<input type="time">` (ou de `defaultTime`). */
export interface TimeParts {
  hours: number
  minutes: number
  seconds: number
}

/**
 * Lê `HH:mm`, `HH:mm:ss` ou `HH:mm:ss.sss` — o valor do `<input type="time">`.
 * Retorna `null` para texto vazio ou fora do formato.
 */
export function parseTimeValue(text: string | null | undefined): TimeParts | null {
  const match = /^\s*(\d{1,2}):(\d{2})(?::(\d{2})(?:\.\d{1,3})?)?\s*$/.exec(text ?? '')
  if (!match) return null
  const hours = Number(match[1])
  const minutes = Number(match[2])
  const seconds = Number(match[3] ?? 0)
  if (hours > 23 || minutes > 59 || seconds > 59) return null
  return { hours, minutes, seconds }
}

/** O `step` (em segundos, como no `<input type="time">`) pede segundos? */
export function usesSeconds(step: number | undefined): boolean {
  return typeof step === 'number' && step > 0 && step % 60 !== 0
}

const pad = (value: number) => String(value).padStart(2, '0')

/** `HH:mm` (ou `HH:mm:ss`) — o valor que o `<input type="time">` aceita. */
export function formatTimeValue(time: Date | TimeParts, withSeconds: boolean): string {
  const parts =
    time instanceof Date
      ? { hours: time.getHours(), minutes: time.getMinutes(), seconds: time.getSeconds() }
      : time
  const base = `${pad(parts.hours)}:${pad(parts.minutes)}`
  return withSeconds ? `${base}:${pad(parts.seconds)}` : base
}

/** O dia de `day` no horário de `time` (fuso local). */
export function combineDateTime(day: Date, time: TimeParts): Date {
  return new Date(
    day.getFullYear(),
    day.getMonth(),
    day.getDate(),
    time.hours,
    time.minutes,
    time.seconds,
  )
}

/**
 * `aaaa-mm-ddTHH:mm` (ou `…:ss`) em hora local, sem fuso — o mesmo formato do
 * `<input type="datetime-local">`, usado no input oculto de formulário.
 */
export function toISODateTime(date: Date, withSeconds: boolean): string {
  return `${toISODate(date)}T${formatTimeValue(date, withSeconds)}`
}
