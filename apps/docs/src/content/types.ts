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

/** Detalhes de um componente depreciado, exibidos no cabeçalho da página. */
export interface ComponentDeprecation {
  /** Slug da página do componente que o substitui (`text-field`). */
  replacement?: string
  /** Versão que marcou a depreciação: `0.5.0`. */
  since?: string
  /** Major em que o componente será removido: `1.0.0`. */
  removal?: string
  /** Nota curta de migração, quando trocar não é só renomear. */
  note?: Localized<string>
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
  /**
   * `deprecated`: ainda funciona, mas sai na próxima major (ver /usage/versioning).
   * Preencha também `deprecation` com o substituto.
   */
  status?: 'stable' | 'beta' | 'new' | 'deprecated'
  /** Só com `status: 'deprecated'`: o que usar no lugar e quando sai. */
  deprecation?: ComponentDeprecation
  /**
   * Id da story principal no Storybook (`componentes-button--docs`).
   * Padrão: `componentes-<name em minúsculas>--docs`.
   */
  storyId?: string
  /** Pasta do código-fonte em packages/ui/src/components. Padrão: `name`. */
  sourceDir?: string
}
