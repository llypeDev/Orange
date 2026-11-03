import { create } from 'storybook/theming'

export const orangeTheme = create({
  base: 'dark',
  brandTitle: 'Orange Design System',
  brandUrl: '../pt/',
  brandTarget: '_self',

  colorPrimary: '#f58549',
  colorSecondary: '#f58549',

  appBg: '#0f0f12',
  appContentBg: '#0f0f12',
  appPreviewBg: '#0f0f12',
  appBorderColor: '#2a2a30',
  appBorderRadius: 0,

  fontBase: 'Inter, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
  fontCode: '"JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, monospace',

  textColor: '#f0ebdb',
  textMutedColor: '#9c9588',
  textInverseColor: '#0f0f12',

  barBg: '#16161a',
  barTextColor: '#b8b0a0',
  barSelectedColor: '#f58549',
  barHoverColor: '#f6945f',

  buttonBg: '#16161a',
  buttonBorder: '#3a3a42',
  booleanBg: '#16161a',
  booleanSelectedBg: '#2a2a30',

  inputBg: '#16161a',
  inputBorder: '#3a3a42',
  inputTextColor: '#f0ebdb',
  inputBorderRadius: 0,
})
