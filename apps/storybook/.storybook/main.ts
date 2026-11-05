import { createRequire } from 'node:module'
import { dirname, join } from 'node:path'
import type { StorybookConfig } from '@storybook/react-vite'

const require = createRequire(import.meta.url)

/**
 * Caminho absoluto de um pacote, resolvido a partir deste app. Em monorepos com
 * pnpm o mesmo pacote pode existir em mais de uma variante (peers diferentes) e
 * deixar de ser içado; resolvendo daqui, o Storybook sempre acha o framework e
 * os addons declarados em apps/storybook.
 */
function getAbsolutePath<T extends string>(value: T): T {
  return dirname(require.resolve(join(value, 'package.json'))) as T
}

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(ts|tsx)', '../../../packages/ui/src/**/*.stories.@(ts|tsx)'],
  addons: [
    getAbsolutePath('@storybook/addon-docs'),
    getAbsolutePath('@storybook/addon-a11y'),
    getAbsolutePath('@storybook/addon-themes'),
  ],
  framework: {
    name: getAbsolutePath('@storybook/react-vite'),
    options: {},
  },
  core: {
    disableTelemetry: true,
  },
  typescript: {
    reactDocgen: 'react-docgen-typescript',
  },
}

export default config
