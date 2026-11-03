import { primitives, themes, type ThemeName } from '@orange/tokens'
import { contrastRatio, wcagLevel, type WcagLevel } from '@orange/tokens/contrast'

/** Converte `rgba(r, g, b, a)` (ou hex) em hex opaco, compondo sobre `background`. */
export function flatten(value: string, background: string): string {
  const match = value.match(/rgba?\(([^)]+)\)/)
  if (!match) return value
  const [r, g, b, a = 1] = match[1].split(',').map((part) => parseFloat(part))
  const bg = hexToRgb(background)
  const mix = (fg: number, base: number) => Math.round(fg * a + base * (1 - a))
  return rgbToHex(mix(r, bg[0]), mix(g, bg[1]), mix(b, bg[2]))
}

export function hexToRgb(hex: string): [number, number, number] {
  const clean = hex.replace('#', '')
  const full = clean.length === 3 ? clean.split('').map((c) => c + c).join('') : clean
  return [0, 2, 4].map((i) => parseInt(full.slice(i, i + 2), 16)) as [number, number, number]
}

export function rgbToHex(r: number, g: number, b: number): string {
  return `#${[r, g, b].map((n) => Math.max(0, Math.min(255, n)).toString(16).padStart(2, '0')).join('')}`
}

/** Escolhe a tinta (carvão ou creme) com maior contraste sobre `background`. */
export function inkOn(background: string): string {
  const dark = primitives.carbon[50]
  const light = primitives.carbon[900]
  return contrastRatio(dark, background) >= contrastRatio(light, background) ? dark : light
}

/** Valor de um token semântico como hex opaco (rgba é composto sobre o `bg` do tema). */
export function solid(theme: ThemeName, token: string): string {
  const palette = themes[theme] as unknown as Record<string, string>
  return flatten(palette[token], palette.bg)
}

export function ratioOf(theme: ThemeName, fg: string, bg: string): number {
  return contrastRatio(solid(theme, fg), solid(theme, bg))
}

export function formatRatio(ratio: number): string {
  return `${ratio.toFixed(2)}:1`
}

export { contrastRatio, wcagLevel }
export type { WcagLevel }
