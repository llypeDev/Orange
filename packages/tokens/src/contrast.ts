/** Utilitários de contraste WCAG 2.x usados nos testes e na documentação. */

function parseColor(input: string): [number, number, number] {
  const hex = input.trim().replace('#', '')
  if (/^[0-9a-f]{6}$/i.test(hex)) {
    return [0, 2, 4].map((i) => parseInt(hex.slice(i, i + 2), 16)) as [number, number, number]
  }
  if (/^[0-9a-f]{3}$/i.test(hex)) {
    return hex.split('').map((c) => parseInt(c + c, 16)) as [number, number, number]
  }
  throw new Error(`Cor não suportada para cálculo de contraste: ${input}`)
}

function channel(value: number): number {
  const c = value / 255
  return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
}

/** Luminância relativa (0–1). */
export function luminance(color: string): number {
  const [r, g, b] = parseColor(color).map(channel)
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

/** Razão de contraste entre duas cores sólidas (1–21). */
export function contrastRatio(a: string, b: string): number {
  const [l1, l2] = [luminance(a), luminance(b)].sort((x, y) => y - x)
  return (l1 + 0.05) / (l2 + 0.05)
}

export type WcagLevel = 'AAA' | 'AA' | 'AA Large' | 'Fail'

/** Classifica a razão de contraste para texto. */
export function wcagLevel(ratio: number): WcagLevel {
  if (ratio >= 7) return 'AAA'
  if (ratio >= 4.5) return 'AA'
  if (ratio >= 3) return 'AA Large'
  return 'Fail'
}
