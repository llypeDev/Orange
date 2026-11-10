/*
 * Utilitários internos do DateTimePicker (não exportados pela biblioteca).
 * Complementam `../DatePicker/dateUtils` (datas no fuso local) e `../TimeField/time` (horários).
 */
import { isSameDay, toISODate } from '../DatePicker/dateUtils'
import { formatTime, fromSeconds, toSeconds, type TimeParts } from '../TimeField/time'

/** O `step` (em segundos, como no `TimeField`) pede o segmento de segundos? */
export function usesSeconds(step: number | undefined): boolean {
  return typeof step === 'number' && step > 0 && step % 60 !== 0
}

/** O horário de uma data (fuso local). */
export function timeOfDate(date: Date): TimeParts {
  return { hour: date.getHours(), minute: date.getMinutes(), second: date.getSeconds() }
}

/** O dia de `day` no horário de `time` (fuso local). */
export function combineDateTime(day: Date, time: TimeParts): Date {
  return new Date(
    day.getFullYear(),
    day.getMonth(),
    day.getDate(),
    time.hour,
    time.minute,
    time.second,
  )
}

/**
 * O limite de horário que `limit` (o `min` ou o `max` do campo) impõe no dia `day`: só existe
 * quando os dois caem no mesmo dia — nos outros, qualquer horário vale. O limite é o primeiro
 * (`min`) ou o último (`max`) horário que o campo consegue escrever sem sair dele: um `min` às
 * 14:23:37 vira 14:24 sem o segmento de segundos, e 14:23:37 com ele.
 */
export function timeLimitOn(
  day: Date | null | undefined,
  limit: Date | null | undefined,
  side: 'min' | 'max',
  withSeconds: boolean,
): TimeParts | null {
  if (!day || !limit || !isSameDay(day, limit)) return null
  const unit = withSeconds ? 1 : 60
  const exact = toSeconds(timeOfDate(limit)) + limit.getMilliseconds() / 1000
  const rounded = (side === 'min' ? Math.ceil(exact / unit) : Math.floor(exact / unit)) * unit
  // Um `min` no último minuto do dia não tem horário seguinte: fica no último que existe.
  return fromSeconds(Math.min(rounded, 86400 - unit))
}

/**
 * `aaaa-mm-ddTHH:mm` (ou `…:ss`) em hora local, sem fuso — o mesmo formato do
 * `<input type="datetime-local">`, usado no input oculto de formulário.
 */
export function toISODateTime(date: Date, withSeconds: boolean): string {
  return `${toISODate(date)}T${formatTime(timeOfDate(date), withSeconds)}`
}
