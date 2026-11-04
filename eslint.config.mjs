import js from '@eslint/js'
import jsxA11y from 'eslint-plugin-jsx-a11y'
import reactHooks from 'eslint-plugin-react-hooks'
import globals from 'globals'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  {
    ignores: ['**/dist/**', '**/storybook-static/**', '**/node_modules/**', '**/coverage/**', 'packages/tokens/css/**'],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.{js,mjs,cjs}'],
    languageOptions: { globals: { ...globals.node } },
  },
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2022,
      globals: { ...globals.browser, ...globals.node },
    },
    plugins: {
      'react-hooks': reactHooks,
      'jsx-a11y': jsxA11y,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      ...jsxA11y.flatConfigs.recommended.rules,
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
      '@typescript-eslint/no-explicit-any': 'warn',
      // Componentes do Orange recebem rótulos via props (label, aria-label) — o plugin não os enxerga.
      'jsx-a11y/label-has-associated-control': 'off',
      'jsx-a11y/no-autofocus': 'off',
      // Regiões roláveis (pre, tabelas largas) precisam ser focáveis pelo teclado (WCAG 2.1.1).
      'jsx-a11y/no-noninteractive-tabindex': ['error', { tags: ['pre'], roles: ['tabpanel', 'region'] }],
      // <ul role="list"> é intencional: o Safari remove a semântica de lista com list-style: none.
      'jsx-a11y/no-redundant-roles': ['error', { ul: ['list'], ol: ['list'] }],
      // Wrappers de roteador (<a {...props} />) recebem o texto via spread; o plugin não enxerga.
      // Links sem nome acessível são pegos em runtime pelos testes axe (regra link-name).
      'jsx-a11y/anchor-has-content': 'off',
    },
  },
  {
    files: ['**/*.test.{ts,tsx}', '**/*.stories.tsx', 'apps/docs/src/content/**/examples/**'],
    rules: {
      'jsx-a11y/no-static-element-interactions': 'off',
      'jsx-a11y/click-events-have-key-events': 'off',
      // Demos de regiões roláveis focáveis.
      'jsx-a11y/no-noninteractive-tabindex': 'off',
    },
  },
  {
    // Hooks dentro de `render` são o padrão documentado do Storybook.
    files: ['**/*.stories.tsx'],
    rules: { 'react-hooks/rules-of-hooks': 'off' },
  },
)
