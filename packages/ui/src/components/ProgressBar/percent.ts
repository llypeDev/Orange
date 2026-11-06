import { clamp } from '../../utils'

/**
 * Percentual inteiro exibido e anunciado pelos indicadores de progresso.
 * Arredonda para baixo, então só chega a 100% quando `value` chega a `max`:
 * 99,6% mostra "99%", não "100%" antes de concluir. A tolerância absorve o
 * erro de ponto flutuante (0.29 × 100 = 28.999…96 continua 29%).
 */
export function displayPercent(value: number, min: number, max: number): number {
  if (!(max > min)) return 0
  if (value >= max) return 100
  return clamp(Math.floor(((value - min) / (max - min)) * 100 + 1e-9), 0, 99)
}
