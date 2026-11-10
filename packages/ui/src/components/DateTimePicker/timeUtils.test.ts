import { describe, expect, it } from 'vitest'
import { combineDateTime, timeLimitOn, timeOfDate, toISODateTime, usesSeconds } from './timeUtils'

const day = new Date(2026, 2, 10)

describe('timeUtils do DateTimePicker', () => {
  it('usesSeconds: só um step que não fecha em minutos pede o segmento de segundos', () => {
    expect(usesSeconds(undefined)).toBe(false)
    expect(usesSeconds(900)).toBe(false)
    expect(usesSeconds(1)).toBe(true)
    expect(usesSeconds(90)).toBe(true)
    expect(usesSeconds(0)).toBe(false)
  })

  it('timeOfDate e combineDateTime vão e voltam no fuso local', () => {
    const time = timeOfDate(new Date(2026, 5, 7, 8, 0, 5))
    expect(time).toEqual({ hour: 8, minute: 0, second: 5 })
    expect(combineDateTime(day, time)).toEqual(new Date(2026, 2, 10, 8, 0, 5))
  })

  it('toISODateTime escreve a hora local, com segundos só quando pedido', () => {
    const date = new Date(2026, 2, 15, 14, 30, 45)
    expect(toISODateTime(date, false)).toBe('2026-03-15T14:30')
    expect(toISODateTime(date, true)).toBe('2026-03-15T14:30:45')
  })

  describe('timeLimitOn', () => {
    it('só há limite de horário no dia do próprio limite', () => {
      const min = new Date(2026, 2, 10, 8, 0)
      expect(timeLimitOn(day, min, 'min', false)).toEqual({ hour: 8, minute: 0, second: 0 })
      expect(timeLimitOn(new Date(2026, 2, 11), min, 'min', false)).toBeNull()
      expect(timeLimitOn(null, min, 'min', false)).toBeNull()
      expect(timeLimitOn(day, undefined, 'max', false)).toBeNull()
    })

    it('sem segundos no campo, min sobe e max desce para o minuto inteiro', () => {
      const limit = new Date(2026, 2, 10, 14, 23, 37)
      expect(timeLimitOn(day, limit, 'min', false)).toEqual({ hour: 14, minute: 24, second: 0 })
      expect(timeLimitOn(day, limit, 'max', false)).toEqual({ hour: 14, minute: 23, second: 0 })
    })

    it('com segundos no campo, só os milissegundos são arredondados', () => {
      const limit = new Date(2026, 2, 10, 14, 23, 37, 512)
      expect(timeLimitOn(day, limit, 'min', true)).toEqual({ hour: 14, minute: 23, second: 38 })
      expect(timeLimitOn(day, limit, 'max', true)).toEqual({ hour: 14, minute: 23, second: 37 })
    })

    it('um min no último minuto do dia fica no último horário que existe', () => {
      const late = new Date(2026, 2, 10, 23, 59, 30)
      expect(timeLimitOn(day, late, 'min', false)).toEqual({ hour: 23, minute: 59, second: 0 })
      expect(timeLimitOn(day, late, 'min', true)).toEqual({ hour: 23, minute: 59, second: 30 })
    })
  })
})
