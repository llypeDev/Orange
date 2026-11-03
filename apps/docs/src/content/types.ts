import type { Localized } from '../i18n'

export type ComponentCategory =
  | 'actions'
  | 'forms'
  | 'feedback'
  | 'overlays'
  | 'navigation'
  | 'data-display'
  | 'layout'
  | 'utilities'

export const categoryLabels: Record<ComponentCategory, Localized<string>> = {
  actions: { pt: 'Ações', en: 'Actions' },
  forms: { pt: 'Formulários', en: 'Forms' },
  feedback: { pt: 'Feedback', en: 'Feedback' },
  overlays: { pt: 'Sobreposições', en: 'Overlays' },
  navigation: { pt: 'Navegação', en: 'Navigation' },
  'data-display': { pt: 'Exibição de dados', en: 'Data display' },
  layout: { pt: 'Layout', en: 'Layout' },
  utilities: { pt: 'Utilitários', en: 'Utilities' },
}

/**
 * Metadados de uma página de componente. Cada pasta em
 * `src/content/components/<slug>/` exporta `meta` em `meta.ts`.
 */
export interface ComponentMeta {
  /** Segmento da URL em kebab-case: `button`, `text-field`. */
  slug: string
  /** Nome do componente como exportado: `Button`, `TextField`. */
  name: string
  category: ComponentCategory
  /** Uma frase descrevendo para que serve. */
  description: Localized<string>
  status?: 'stable' | 'beta' | 'new'
  /**
   * Id da story principal no Storybook (`componentes-button--docs`).
   * Padrão: `componentes-<name em minúsculas>--docs`.
   */
  storyId?: string
  /** Pasta do código-fonte em packages/ui/src/components. Padrão: `name`. */
  sourceDir?: string
}
