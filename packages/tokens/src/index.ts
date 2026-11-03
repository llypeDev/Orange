/**
 * Orange design tokens — fonte única da verdade.
 *
 * `primitives` são valores crus (paletas). `themes` mapeiam esses valores para
 * tokens semânticos (`--or-color-*`) usados por todos os componentes.
 * O script `scripts/build.ts` gera `css/tokens.css` a partir deste arquivo.
 */

export const primitives = {
  carbon: {
    0: '#0a0a0d',
    50: '#0f0f12',
    100: '#16161a',
    150: '#1c1c21',
    200: '#2a2a30',
    300: '#3a3a42',
    400: '#55555e',
    500: '#75757f',
    600: '#9c9588',
    700: '#b8b0a0',
    800: '#d4cdb5',
    900: '#f0ebdb',
    950: '#faf7ec',
  },
  paper: {
    0: '#fffdf6',
    50: '#faf7ec',
    100: '#f0ebdb',
    200: '#ece7d7',
    300: '#e2ddcd',
    400: '#d9d3bf',
    500: '#c9c4b5',
    600: '#8a8478',
    700: '#666057',
    800: '#525252',
    900: '#2a2a2a',
    950: '#0f0f12',
  },
  orange: {
    50: '#fff3eb',
    100: '#fde2cf',
    200: '#fbc6a2',
    300: '#f8a675',
    400: '#f6945f',
    500: '#f58549',
    550: '#e06a2c',
    600: '#d4622a',
    700: '#b85a24',
    800: '#9c4416',
    900: '#6b2e0e',
  },
  green: {
    100: '#e4f1d1',
    300: '#a6d16a',
    500: '#7fb236',
    700: '#3d6614',
    900: '#22390b',
  },
  blue: {
    100: '#dfe5f8',
    300: '#8da2ea',
    400: '#6b85e0',
    500: '#4a66d4',
    700: '#2a4494',
    900: '#18275a',
  },
  red: {
    100: '#fde4e1',
    300: '#f79a8f',
    500: '#ef6a5a',
    700: '#b42318',
    900: '#6e140d',
  },
  amber: {
    100: '#faefcd',
    300: '#efd27f',
    500: '#e8c15a',
    700: '#8a5a00',
    900: '#4d3200',
  },
} as const

export type ThemeName = 'dark' | 'light'

/** Tokens semânticos de cor. As chaves viram `--or-color-<chave>`. */
export interface ColorTokens {
  bg: string
  'bg-subtle': string
  surface: string
  'surface-raised': string
  'surface-hover': string
  'surface-active': string
  'surface-inverse': string
  overlay: string
  text: string
  'text-muted': string
  'text-subtle': string
  'text-disabled': string
  'text-inverse': string
  'text-on-accent': string
  border: string
  'border-subtle': string
  'border-strong': string
  'border-control': string
  accent: string
  'accent-hover': string
  'accent-active': string
  'accent-subtle': string
  'accent-text': string
  'accent-border': string
  neutral: string
  'neutral-hover': string
  'text-on-neutral': string
  success: string
  'success-subtle': string
  'success-text': string
  warning: string
  'warning-subtle': string
  'warning-text': string
  danger: string
  'danger-hover': string
  'danger-subtle': string
  'danger-text': string
  'text-on-danger': string
  info: string
  'info-subtle': string
  'info-text': string
  focus: string
  'grid-line': string
  'code-bg': string
  'code-text': string
  selection: string
}

const { carbon, paper, orange, green, blue, red, amber } = primitives

export const themes: Record<ThemeName, ColorTokens> = {
  dark: {
    bg: carbon[50],
    'bg-subtle': carbon[100],
    surface: carbon[50],
    'surface-raised': carbon[150],
    'surface-hover': carbon[200],
    'surface-active': carbon[300],
    'surface-inverse': carbon[900],
    overlay: 'rgba(5, 5, 7, 0.72)',
    text: carbon[900],
    'text-muted': carbon[700],
    'text-subtle': carbon[600],
    'text-disabled': carbon[400],
    'text-inverse': carbon[50],
    'text-on-accent': carbon[50],
    border: carbon[200],
    'border-subtle': '#1f1f26',
    'border-strong': carbon[300],
    'border-control': carbon[500],
    accent: orange[500],
    'accent-hover': orange[400],
    'accent-active': orange[550],
    'accent-subtle': 'rgba(245, 133, 73, 0.12)',
    'accent-text': orange[500],
    'accent-border': 'rgba(245, 133, 73, 0.45)',
    neutral: carbon[900],
    'neutral-hover': carbon[950],
    'text-on-neutral': carbon[50],
    success: green[500],
    'success-subtle': 'rgba(127, 178, 54, 0.14)',
    'success-text': green[300],
    warning: amber[500],
    'warning-subtle': 'rgba(232, 193, 90, 0.14)',
    'warning-text': amber[300],
    danger: red[500],
    'danger-hover': red[300],
    'danger-subtle': 'rgba(239, 106, 90, 0.14)',
    'danger-text': red[300],
    'text-on-danger': carbon[50],
    info: blue[500],
    'info-subtle': 'rgba(74, 102, 212, 0.16)',
    'info-text': blue[300],
    focus: orange[400],
    'grid-line': 'rgba(240, 235, 219, 0.045)',
    'code-bg': carbon[0],
    'code-text': carbon[800],
    selection: 'rgba(245, 133, 73, 0.32)',
  },
  light: {
    bg: paper[50],
    'bg-subtle': paper[100],
    surface: paper[0],
    'surface-raised': paper[0],
    'surface-hover': paper[200],
    'surface-active': paper[300],
    'surface-inverse': paper[950],
    overlay: 'rgba(15, 15, 18, 0.48)',
    text: paper[950],
    'text-muted': paper[800],
    'text-subtle': paper[700],
    'text-disabled': paper[600],
    'text-inverse': paper[50],
    'text-on-accent': paper[950],
    border: paper[400],
    'border-subtle': paper[300],
    'border-strong': paper[500],
    'border-control': '#7a7468',
    // Laranja mais fechado no tema claro: ≥ 3:1 contra o papel (WCAG 1.4.11)
    // e ≥ 4.5:1 para o texto escuro sobre ele.
    accent: orange[600],
    'accent-hover': orange[550],
    'accent-active': orange[700],
    'accent-subtle': 'rgba(212, 98, 42, 0.12)',
    'accent-text': orange[800],
    'accent-border': 'rgba(184, 90, 36, 0.5)',
    neutral: paper[950],
    'neutral-hover': '#2b2b2c',
    'text-on-neutral': paper[50],
    success: green[500],
    'success-subtle': 'rgba(127, 178, 54, 0.16)',
    'success-text': green[700],
    warning: amber[500],
    'warning-subtle': 'rgba(232, 193, 90, 0.22)',
    'warning-text': amber[700],
    danger: red[700],
    'danger-hover': '#c9301f',
    'danger-subtle': 'rgba(180, 35, 24, 0.1)',
    'danger-text': red[700],
    'text-on-danger': '#ffffff',
    info: blue[700],
    'info-subtle': 'rgba(42, 68, 148, 0.1)',
    'info-text': blue[700],
    focus: orange[700],
    'grid-line': 'rgba(15, 15, 18, 0.05)',
    'code-bg': carbon[50],
    'code-text': carbon[800],
    selection: 'rgba(245, 133, 73, 0.28)',
  },
}

export const typography = {
  fontFamily: {
    display: '"Space Grotesk", system-ui, -apple-system, "Segoe UI", sans-serif',
    body: 'Inter, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
    mono: '"JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
  },
  fontSize: {
    '2xs': '0.6875rem', // 11px
    xs: '0.75rem', // 12px
    sm: '0.8125rem', // 13px
    md: '0.9375rem', // 15px
    lg: '1.0625rem', // 17px
    xl: '1.25rem', // 20px
    '2xl': '1.5rem', // 24px
    '3xl': '2rem', // 32px
    '4xl': '2.75rem', // 44px
    '5xl': '3.75rem', // 60px
    display: '5.375rem', // 86px
  },
  fontWeight: {
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
  lineHeight: {
    display: '1',
    heading: '1.1',
    tight: '1.35',
    body: '1.55',
    loose: '1.7',
  },
  letterSpacing: {
    display: '-0.045em',
    heading: '-0.03em',
    body: '-0.005em',
    meta: '0.14em',
  },
} as const

export const space = {
  0: '0',
  1: '0.25rem',
  2: '0.5rem',
  3: '0.75rem',
  4: '1rem',
  5: '1.25rem',
  6: '1.5rem',
  7: '1.75rem',
  8: '2rem',
  10: '2.5rem',
  12: '3rem',
  14: '3.5rem',
  16: '4rem',
  20: '5rem',
  24: '6rem',
} as const

export const radius = {
  none: '0',
  sm: '2px',
  md: '4px',
  full: '9999px',
} as const

export const borderWidth = {
  thin: '1px',
  thick: '2px',
  accent: '3px',
} as const

export const shadow = {
  none: 'none',
  'hover-accent': '0 8px 0 -4px var(--or-color-accent)',
  'hover-ink': '0 4px 0 -2px var(--or-color-text)',
  raised: '0 1px 0 0 var(--or-color-border-strong)',
  overlay: '0 24px 64px -16px rgba(0, 0, 0, 0.55), 0 0 0 1px var(--or-color-border-strong)',
} as const

export const motion = {
  duration: {
    instant: '80ms',
    fast: '160ms',
    medium: '250ms',
    slow: '400ms',
    slower: '640ms',
  },
  easing: {
    out: 'cubic-bezier(0.22, 1, 0.36, 1)',
    'in-out': 'cubic-bezier(0.65, 0, 0.35, 1)',
    spring: 'cubic-bezier(0.2, 0.9, 0.3, 1.05)',
    snap: 'cubic-bezier(0.19, 1, 0.22, 1)',
  },
} as const

export const zIndex = {
  base: '0',
  raised: '10',
  sticky: '100',
  header: '200',
  dropdown: '1000',
  overlay: '1100',
  modal: '1200',
  popover: '1300',
  toast: '1400',
  tooltip: '1500',
} as const

export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1440px',
} as const

export const layout = {
  'max-width': '1200px',
  gutter: '2rem',
  'header-height': '4rem',
  'sidebar-width': '17.5rem',
} as const

/** Tamanhos de controles interativos (altura). Todos ≥ 24px (WCAG 2.5.8). */
export const controlSize = {
  sm: '2rem', // 32px
  md: '2.5rem', // 40px
  lg: '3rem', // 48px
} as const

export const tokens = {
  primitives,
  themes,
  typography,
  space,
  radius,
  borderWidth,
  shadow,
  motion,
  zIndex,
  breakpoints,
  layout,
  controlSize,
} as const

export type Tokens = typeof tokens

/** Converte um caminho de token no nome da CSS custom property. */
export function cssVar(name: string): string {
  return `var(--or-${name})`
}

export default tokens
