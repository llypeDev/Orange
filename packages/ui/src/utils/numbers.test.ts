import { describe, expect, it } from 'vitest'
import { decimalsOf, roundTo } from './index'

describe('decimalsOf', () => {
  it('conta as casas decimais de números comuns', () => {
    expect(decimalsOf(0)).toBe(0)
    expect(decimalsOf(42)).toBe(0)
    expect(decimalsOf(-3)).toBe(0)
    expect(decimalsOf(0.5)).toBe(1)
    expect(decimalsOf(0.25)).toBe(2)
    expect(decimalsOf(-1.125)).toBe(3)
  })

  it('entende notação exponencial, somando as casas da mantissa ao expoente', () => {
    expect(decimalsOf(1e-7)).toBe(7)
    expect(decimalsOf(1.5e-7)).toBe(8)
    expect(decimalsOf(2.25e-8)).toBe(10)
    expect(decimalsOf(1e21)).toBe(0)
    expect(decimalsOf(1.5e21)).toBe(0)
  })

  it('infinito e NaN valem 0', () => {
    expect(decimalsOf(Infinity)).toBe(0)
    expect(decimalsOf(-Infinity)).toBe(0)
    expect(decimalsOf(Number.NaN)).toBe(0)
  })
})

describe('roundTo', () => {
  it('arredonda para as casas pedidas, sem erro de ponto flutuante', () => {
    expect(roundTo(0.1 + 0.2, 1)).toBe(0.3)
    expect(roundTo(1.5e-7 + 1.5e-7, decimalsOf(1.5e-7))).toBe(3e-7)
    expect(roundTo(2.345, 0)).toBe(2)
  })

  it('limita as casas à faixa de toFixed (0–20)', () => {
    expect(roundTo(1.25, -3)).toBe(1)
    expect(() => roundTo(1 / 3, 50)).not.toThrow()
  })
})
