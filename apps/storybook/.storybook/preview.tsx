import '@orangesys/ui/styles.css'
import { isThemeSetting, OrangeProvider, themeNames } from '@orangesys/ui'
import { withThemeByDataAttribute } from '@storybook/addon-themes'
import type { Decorator, Preview } from '@storybook/react-vite'
import { orangeTheme } from './theme'

const withOrangeProvider: Decorator = (Story, context) => {
  const locale = (context.globals.locale as string) ?? 'pt-BR'
  const motion = (context.globals.motion as string) ?? 'full'
  const theme = isThemeSetting(context.globals.theme) ? context.globals.theme : 'dark'
  return (
    <OrangeProvider locale={locale} themeTarget="scoped" theme={theme}>
      <div style={{ padding: 4 }} data-motion={motion}>
        <Story />
      </div>
    </OrangeProvider>
  )
}

const preview: Preview = {
  globalTypes: {
    locale: {
      description: 'Idioma das mensagens internas dos componentes',
      toolbar: {
        title: 'Idioma',
        icon: 'globe',
        items: [
          { value: 'pt-BR', title: 'Português (BR)' },
          { value: 'en-US', title: 'English (US)' },
        ],
        dynamicTitle: true,
      },
    },
    motion: {
      description: 'Simula prefers-reduced-motion nas stories',
      toolbar: {
        title: 'Movimento',
        icon: 'lightning',
        items: [
          { value: 'full', title: 'Movimento completo' },
          { value: 'reduced', title: 'Movimento reduzido' },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: {
    locale: 'pt-BR',
    motion: 'full',
  },
  decorators: [
    withOrangeProvider,
    // Toolbar de tema: escuro, claro e os dois de alto contraste (dark-hc, light-hc).
    withThemeByDataAttribute({
      themes: Object.fromEntries(themeNames.map((name) => [name, name])),
      defaultTheme: 'dark',
      attributeName: 'data-theme',
    }),
  ],
  parameters: {
    layout: 'padded',
    controls: {
      expanded: true,
      matchers: { color: /(background|color)$/i, date: /Date$/i },
    },
    backgrounds: { disable: true },
    docs: { theme: orangeTheme },
    a11y: {
      // Falha a story quando houver violações WCAG (visível no painel Accessibility).
      test: 'error',
      config: {},
      options: { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'] } },
    },
    options: {
      storySort: {
        order: ['Introdução', 'Fundamentos', 'Componentes'],
      },
    },
  },
}

export default preview
