/*
 * Contas de horário do TimeField: ler e escrever `HH:mm`, formato do idioma (12 ou 24 horas),
 * passo e a lista de horários. Interno — não é exportado pela biblioteca.
 */

/** Um horário em 24 horas. */
export interface TimeParts {
  hour: number
  minute: number
  second: number
}

export type HourCycle = 12 | 24
export type DayPeriod = 'am' | 'pm'

const DAY = 86400

export const toSeconds = (time: TimeParts) => time.hour * 3600 + time.minute * 60 + time.second

export function fromSeconds(total: number): TimeParts {
  const seconds = ((Math.round(total) % DAY) + DAY) % DAY
  return {
    hour: Math.floor(seconds / 3600),
    minute: Math.floor((seconds % 3600) / 60),
    second: seconds % 60,
  }
}

const pad = (value: number) => String(value).padStart(2, '0')

/** `HH:mm` ou `HH:mm:ss` (o valor do campo) → partes. `null` se não for um horário válido. */
export function parseTime(value: string | null | undefined): TimeParts | null {
  const match = /^(\d{1,2}):(\d{2})(?::(\d{2})(?:\.\d+)?)?$/.exec((value ?? '').trim())
  if (!match) return null
  const [hour, minute, second] = [Number(match[1]), Number(match[2]), Number(match[3] ?? 0)]
  return hour > 23 || minute > 59 || second > 59 ? null : { hour, minute, second }
}

/** Partes → o valor do campo: `HH:mm`, ou `HH:mm:ss` com segundos. */
export function formatTime(time: TimeParts, withSeconds: boolean): string {
  const base = `${pad(time.hour)}:${pad(time.minute)}`
  return withSeconds ? `${base}:${pad(time.second)}` : base
}

/**
 * Texto livre (colado) → horário: `14:30`, `14h30`, `2:30 pm`, `0930`, `9`. Aceita o que uma
 * pessoa escreveria; devolve `null` quando não dá para entender.
 */
export function parseLooseTime(text: string): TimeParts | null {
  const clean = text.trim().toLowerCase()
  const period = /p\.?\s*m\.?$/.test(clean) ? 'pm' : /a\.?\s*m\.?$/.test(clean) ? 'am' : null
  const digits = clean.replace(/[ap]\.?\s*m\.?$/, '').trim()
  let hour: number
  let minute = 0
  let second = 0
  const separated = /^(\d{1,2})\s*[:h.]\s*(\d{2})(?:\s*[:m.]\s*(\d{2}))?\s*s?$/.exec(digits)
  const compact = /^(\d{1,2})(\d{2})?(\d{2})?$/.exec(digits.replace(/h$/, ''))
  if (separated) {
    hour = Number(separated[1])
    minute = Number(separated[2])
    second = Number(separated[3] ?? 0)
  } else if (compact) {
    hour = Number(compact[1])
    minute = Number(compact[2] ?? 0)
    second = Number(compact[3] ?? 0)
  } else return null
  if (period) {
    if (hour < 1 || hour > 12) return null
    hour = (hour % 12) + (period === 'pm' ? 12 : 0)
  }
  return hour > 23 || minute > 59 || second > 59 ? null : { hour, minute, second }
}

/** O idioma usa relógio de 12 horas (com AM/PM) ou de 24? */
export function hourCycleOf(locale: string): HourCycle {
  try {
    const cycle = new Intl.DateTimeFormat(locale, { hour: 'numeric' }).resolvedOptions().hourCycle
    return cycle === 'h12' || cycle === 'h11' ? 12 : 24
  } catch {
    return 24
  }
}

export interface DayPeriodInfo {
  /** Como o idioma escreve AM e PM (`AM`/`PM`, `a. m.`/`p. m.`). */
  am: string
  pm: string
  /** O período vem antes da hora (coreano, chinês, japonês)? */
  first: boolean
}

export function dayPeriodInfo(locale: string): DayPeriodInfo {
  const fallback: DayPeriodInfo = { am: 'AM', pm: 'PM', first: false }
  try {
    const format = new Intl.DateTimeFormat(locale, { hour: 'numeric', minute: '2-digit', hour12: true })
    const partsAt = (hour: number) => format.formatToParts(new Date(2020, 0, 1, hour, 0))
    const morning = partsAt(9)
    const name = (parts: Intl.DateTimeFormatPart[]) =>
      parts.find((part) => part.type === 'dayPeriod')?.value.trim()
    const am = name(morning)
    const pm = name(partsAt(21))
    if (!am || !pm) return fallback
    const first =
      morning.findIndex((part) => part.type === 'dayPeriod') <
      morning.findIndex((part) => part.type === 'hour')
    return { am, pm, first }
  } catch {
    return fallback
  }
}

/** Hora de 24h → a que aparece no relógio de 12h (12, 1, 2 … 11) e o período. */
export function to12Hour(hour: number): { hour: number; period: DayPeriod } {
  return { hour: hour % 12 || 12, period: hour < 12 ? 'am' : 'pm' }
}

export function to24Hour(hour: number, period: DayPeriod): number {
  return (hour % 12) + (period === 'pm' ? 12 : 0)
}

export interface DisplayOptions {
  hourCycle: HourCycle
  withSeconds: boolean
  periods: DayPeriodInfo
}

/** Como o horário aparece para a pessoa: `14:30`, `02:30 PM`. */
export function displayTime(time: TimeParts, { hourCycle, withSeconds, periods }: DisplayOptions) {
  const seconds = withSeconds ? `:${pad(time.second)}` : ''
  if (hourCycle === 24) return `${pad(time.hour)}:${pad(time.minute)}${seconds}`
  const { hour, period } = to12Hour(time.hour)
  const clock = `${pad(hour)}:${pad(time.minute)}${seconds}`
  return periods.first ? `${periods[period]} ${clock}` : `${clock} ${periods[period]}`
}

export interface TimeLimits {
  min: TimeParts | null
  max: TimeParts | null
  /** Passo em segundos (o mesmo do atributo `step` do HTML). */
  step: number
}

export type TimeProblem = 'early' | 'late' | 'step'

/**
 * O horário respeita `min`, `max` e o passo? Com `min` depois de `max`, o intervalo atravessa a
 * meia-noite (22:00–06:00), como no `<input type="time">`.
 */
export function timeProblem(time: TimeParts, { min, max, step }: TimeLimits): TimeProblem | null {
  const seconds = toSeconds(time)
  const low = min ? toSeconds(min) : null
  const high = max ? toSeconds(max) : null
  if (low !== null && high !== null && low > high) {
    if (seconds < low && seconds > high) return 'early'
  } else {
    if (low !== null && seconds < low) return 'early'
    if (high !== null && seconds > high) return 'late'
  }
  // O passo conta a partir de `min` (ou da meia-noite).
  if (step > 0 && (((seconds - (low ?? 0)) % step) + step) % step !== 0) return 'step'
  return null
}

/** Traz o horário para dentro de `min`/`max` (o mais próximo dos dois limites). */
export function clampTime(time: TimeParts, { min, max }: Pick<TimeLimits, 'min' | 'max'>): TimeParts {
  const seconds = toSeconds(time)
  const low = min ? toSeconds(min) : null
  const high = max ? toSeconds(max) : null
  if (low !== null && high !== null && low > high) {
    if (seconds < low && seconds > high) return seconds - high < low - seconds ? max! : min!
    return time
  }
  if (low !== null && seconds < low) return min!
  if (high !== null && seconds > high) return max!
  return time
}

/** Os horários da lista: de `min` a `max` (ou o dia inteiro), de `interval` em `interval` segundos. */
export function timeOptions({ min, max }: Pick<TimeLimits, 'min' | 'max'>, interval: number): TimeParts[] {
  if (!(interval > 0)) return []
  const start = min ? toSeconds(min) : 0
  let end = max ? toSeconds(max) : DAY - 1
  // Intervalo que atravessa a meia-noite: segue até o `max` do dia seguinte.
  if (min && max && start > end) end += DAY
  const options: TimeParts[] = []
  for (let seconds = start; seconds <= end && options.length < 1440; seconds += interval)
    options.push(fromSeconds(seconds))
  return options
}

/** "15 minutos", "2 horas", "30 segundos" no idioma — para a mensagem do passo. */
export function formatInterval(seconds: number, locale: string): string {
  const [amount, unit] =
    seconds % 3600 === 0
      ? [seconds / 3600, 'hour']
      : seconds % 60 === 0
        ? [seconds / 60, 'minute']
        : [seconds, 'second']
  try {
    return new Intl.NumberFormat(locale, { style: 'unit', unit, unitDisplay: 'long' }).format(amount)
  } catch {
    return `${amount} ${unit === 'hour' ? 'h' : unit === 'minute' ? 'min' : 's'}`
  }
}
