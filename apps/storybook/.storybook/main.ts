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
    // O plugin de docgen do Storybook 10 (vite-plugin-react-docgen-typescript 0.7) só documenta
    // arquivos do tsconfig indicado que casem com `include` (relativo a apps/storybook). Sem isso
    // ele lia o tsconfig deste app e a tabela de props dos componentes de packages/ui ficava vazia
    // (só os args das stories). Padrões com ../ também no exclude: `**` não atravessa `..`.
    reactDocgenTypescriptOptions: {
      tsconfigPath: '../../packages/ui/tsconfig.json',
      include: ['../../packages/ui/src/**/*.tsx'],
      exclude: ['../../packages/ui/src/**/*.stories.tsx', '../../packages/ui/src/**/*.test.tsx'],
    },
  },
}

export default config
