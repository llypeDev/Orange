import '@orange/ui/styles.css'
import { OrangeProvider } from '@orange/ui'
import { withThemeByDataAttribute } from '@storybook/addon-themes'
import type { Decorator, Preview } from '@storybook/react-vite'
import { orangeTheme } from './theme'

const withOrangeProvider: Decorator = (Story, context) => {
  const locale = (context.globals.locale as string) ?? 'pt-BR'
  return (
    <OrangeProvider locale={locale} themeTarget="scoped" theme={(context.globals.theme as 'dark' | 'light') ?? 'dark'}>
      <div style={{ padding: 4 }}>
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
  },
  initialGlobals: {
    locale: 'pt-BR',
  },
  decorators: [
    withOrangeProvider,
    withThemeByDataAttribute({
      themes: { dark: 'dark', light: 'light' },
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
