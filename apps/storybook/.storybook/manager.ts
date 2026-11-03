import { addons } from 'storybook/manager-api'
import { orangeTheme } from './theme'

addons.setConfig({
  theme: orangeTheme,
  sidebar: {
    showRoots: true,
  },
})
