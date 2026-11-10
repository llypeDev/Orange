import { describe, expect, it } from 'vitest'
import {
  clampTime,
  dayPeriodInfo,
  displayTime,
  formatInterval,
  formatTime,
  fromSeconds,
  hourCycleOf,
  parseLooseTime,
  parseTime,
  timeOptions,
  timeProblem,
  to12Hour,
  to24Hour,
  toSeconds,
} from './time'

const at = (hour: number, minute = 0, second = 0) => ({ hour, minute, second })
const AM_PM = { am: 'AM', pm: 'PM', first: false }

describe('time: ler e escrever o valor', () => {
  it('lê HH:mm e HH:mm:ss e recusa o que não é horário', () => {
    expect(parseTime('09:30')).toEqual(at(9, 30))
    expect(parseTime('23:59:58')).toEqual(at(23, 59, 58))
    expect(parseTime('14:30:00.000')).toEqual(at(14, 30))
    expect(parseTime('')).toBeNull()
    expect(parseTime(undefined)).toBeNull()
    expect(parseTime('24:00')).toBeNull()
    expect(parseTime('12:60')).toBeNull()
    expect(parseTime('meio-dia')).toBeNull()
  })

  it('escreve com dois dígitos, com ou sem segundos', () => {
    expect(formatTime(at(9, 5), false)).toBe('09:05')
    expect(formatTime(at(9, 5, 7), true)).toBe('09:05:07')
  })

  it('converte para segundos e de volta, dando a volta no dia', () => {
    expect(toSeconds(at(1, 1, 1))).toBe(3661)
    expect(fromSeconds(3661)).toEqual(at(1, 1, 1))
    expect(fromSeconds(86400 + 60)).toEqual(at(0, 1))
    expect(fromSeconds(-60)).toEqual(at(23, 59))
  })

  it('entende o que uma pessoa colaria', () => {
    expect(parseLooseTime('14:30')).toEqual(at(14, 30))
    expect(parseLooseTime(' 14h30 ')).toEqual(at(14, 30))
    expect(parseLooseTime('9')).toEqual(at(9))
    expect(parseLooseTime('0930')).toEqual(at(9, 30))
    expect(parseLooseTime('2:30 pm')).toEqual(at(14, 30))
    expect(parseLooseTime('12:15 AM')).toEqual(at(0, 15))
    expect(parseLooseTime('12 p.m.')).toEqual(at(12))
    expect(parseLooseTime('08:15:42')).toEqual(at(8, 15, 42))
    expect(parseLooseTime('25:00')).toBeNull()
    expect(parseLooseTime('13:00 pm')).toBeNull()
    expect(parseLooseTime('amanhã')).toBeNull()
  })
})

describe('time: formato do idioma', () => {
  it('relógio de 24 horas em português e espanhol, de 12 em inglês americano', () => {
    expect(hourCycleOf('pt-BR')).toBe(24)
    expect(hourCycleOf('es-ES')).toBe(24)
    expect(hourCycleOf('en-US')).toBe(12)
    expect(hourCycleOf('idioma inválido')).toBe(24)
  })

  it('descobre como o idioma escreve AM e PM', () => {
    expect(dayPeriodInfo('en-US')).toEqual(AM_PM)
    expect(dayPeriodInfo('idioma inválido')).toEqual(AM_PM)
    // Coreano: o período vem antes da hora.
    expect(dayPeriodInfo('ko-KR').first).toBe(true)
  })

  it('converte entre 24 e 12 horas (meia-noite é 12 AM, meio-dia é 12 PM)', () => {
    expect(to12Hour(0)).toEqual({ hour: 12, period: 'am' })
    expect(to12Hour(12)).toEqual({ hour: 12, period: 'pm' })
    expect(to12Hour(15)).toEqual({ hour: 3, period: 'pm' })
    expect(to24Hour(12, 'am')).toBe(0)
    expect(to24Hour(12, 'pm')).toBe(12)
    expect(to24Hour(3, 'pm')).toBe(15)
  })

  it('mostra o horário no relógio pedido', () => {
    const base = { withSeconds: false, periods: AM_PM }
    expect(displayTime(at(14, 30), { ...base, hourCycle: 24 })).toBe('14:30')
    expect(displayTime(at(14, 30), { ...base, hourCycle: 12 })).toBe('02:30 PM')
    expect(displayTime(at(0, 5, 9), { hourCycle: 12, withSeconds: true, periods: AM_PM })).toBe(
      '12:05:09 AM',
    )
    expect(
      displayTime(at(9), { ...base, hourCycle: 12, periods: { am: '오전', pm: '오후', first: true } }),
    ).toBe('오전 09:00')
  })

  it('escreve o intervalo do passo por extenso', () => {
    expect(formatInterval(900, 'pt-BR')).toBe('15 minutos')
    expect(formatInterval(7200, 'pt-BR')).toBe('2 horas')
    expect(formatInterval(30, 'en-US')).toBe('30 seconds')
    expect(formatInterval(60, 'en-US')).toBe('1 minute')
  })
})

describe('time: limites e passo', () => {
  const office = { min: at(8), max: at(18), step: 900 }

  it('acusa horário antes do mínimo, depois do máximo e fora do passo', () => {
    expect(timeProblem(at(7, 45), office)).toBe('early')
    expect(timeProblem(at(18, 15), office)).toBe('late')
    expect(timeProblem(at(10, 7), office)).toBe('step')
    expect(timeProblem(at(8), office)).toBeNull()
    expect(timeProblem(at(18), office)).toBeNull()
    expect(timeProblem(at(10, 7), { min: null, max: null, step: 60 })).toBeNull()
  })

  it('conta o passo a partir do mínimo', () => {
    const limits = { min: at(8, 10), max: null, step: 900 }
    expect(timeProblem(at(8, 25), limits)).toBeNull()
    expect(timeProblem(at(8, 30), limits)).toBe('step')
  })

  it('aceita intervalo que atravessa a meia-noite (mínimo depois do máximo)', () => {
    const night = { min: at(22), max: at(6), step: 60 }
    expect(timeProblem(at(23, 30), night)).toBeNull()
    expect(timeProblem(at(2), night)).toBeNull()
    expect(timeProblem(at(12), night)).toBe('early')
  })

  it('traz o horário para o limite mais próximo', () => {
    expect(clampTime(at(7), office)).toEqual(at(8))
    expect(clampTime(at(19, 30), office)).toEqual(at(18))
    expect(clampTime(at(12, 30), office)).toEqual(at(12, 30))
    const night = { min: at(22), max: at(6) }
    expect(clampTime(at(7), night)).toEqual(at(6))
    expect(clampTime(at(21), night)).toEqual(at(22))
    expect(clampTime(at(23), night)).toEqual(at(23))
  })

  it('monta a lista do mínimo ao máximo, no intervalo pedido', () => {
    expect(timeOptions(office, 3600).map((time) => time.hour)).toEqual([
      8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18,
    ])
    const day = timeOptions({ min: null, max: null }, 1800)
    expect(day).toHaveLength(48)
    expect(day[0]).toEqual(at(0))
    expect(day[47]).toEqual(at(23, 30))
  })

  it('a lista atravessa a meia-noite e nunca passa de 1440 itens', () => {
    const night = timeOptions({ min: at(22), max: at(1) }, 3600)
    expect(night.map((time) => time.hour)).toEqual([22, 23, 0, 1])
    expect(timeOptions({ min: null, max: null }, 1)).toHaveLength(1440)
    expect(timeOptions({ min: null, max: null }, 0)).toEqual([])
  })
})
