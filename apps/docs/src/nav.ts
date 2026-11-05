import type { IconName } from '@orange/ui'
import { lazy, type ComponentType, type LazyExoticComponent } from 'react'
import type { Localized } from './i18n'

export interface StaticPage {
  /** Caminho sem o prefixo de idioma: `/design-guidelines/color`. */
  path: string
  label: Localized<string>
  component: LazyExoticComponent<ComponentType>
}

const page = (loader: () => Promise<{ default: ComponentType }>) => lazy(loader)

export const guidelinePages: StaticPage[] = [
  { path: '/design-guidelines/accessibility', label: { pt: 'Acessibilidade', en: 'Accessibility' }, component: page(() => import('./content/pages/guidelines/Accessibility')) },
  { path: '/design-guidelines/color', label: { pt: 'Cor', en: 'Color' }, component: page(() => import('./content/pages/guidelines/Color')) },
  { path: '/design-guidelines/data-visualization', label: { pt: 'Visualização de dados', en: 'Data visualization' }, component: page(() => import('./content/pages/guidelines/DataVisualization')) },
  { path: '/design-guidelines/grid', label: { pt: 'Grid', en: 'Grid' }, component: page(() => import('./content/pages/guidelines/Grid')) },
  { path: '/design-guidelines/iconography', label: { pt: 'Iconografia', en: 'Iconography' }, component: page(() => import('./content/pages/guidelines/Iconography')) },
  { path: '/design-guidelines/motion', label: { pt: 'Movimento', en: 'Motion' }, component: page(() => import('./content/pages/guidelines/Motion')) },
  { path: '/design-guidelines/typography', label: { pt: 'Tipografia', en: 'Typography' }, component: page(() => import('./content/pages/guidelines/Typography')) },
]

export const usagePages: StaticPage[] = [
  { path: '/usage/styles', label: { pt: 'Estilos', en: 'Styles' }, component: page(() => import('./content/pages/usage/Styles')) },
  { path: '/usage/theme', label: { pt: 'Tema', en: 'Theme' }, component: page(() => import('./content/pages/usage/Theme')) },
  { path: '/usage/figma', label: { pt: 'Figma', en: 'Figma' }, component: page(() => import('./content/pages/usage/Figma')) },
  { path: '/usage/i18n', label: { pt: 'Internacionalização', en: 'Internationalization' }, component: page(() => import('./content/pages/usage/I18n')) },
  { path: '/usage/hooks', label: { pt: 'Hooks', en: 'Hooks' }, component: page(() => import('./content/pages/usage/Hooks')) },
  { path: '/usage/versioning', label: { pt: 'Versionamento e depreciação', en: 'Versioning and deprecation' }, component: page(() => import('./content/pages/usage/Versioning')) },
]

/** Modelos de página inteira (login, painel, configurações). */
export const templatePages: StaticPage[] = [
  { path: '/templates/sign-in', label: { pt: 'Entrar', en: 'Sign in' }, component: page(() => import('./content/templates/sign-in')) },
  { path: '/templates/dashboard', label: { pt: 'Painel', en: 'Dashboard' }, component: page(() => import('./content/templates/dashboard')) },
  { path: '/templates/settings', label: { pt: 'Configurações', en: 'Settings' }, component: page(() => import('./content/templates/settings')) },
]

export const topPages: StaticPage[] = [
  { path: '/getting-started', label: { pt: 'Começando', en: 'Getting started' }, component: page(() => import('./content/pages/GettingStarted')) },
  { path: '/about', label: { pt: 'Sobre', en: 'About' }, component: page(() => import('./content/pages/About')) },
  { path: '/resources', label: { pt: 'Recursos', en: 'Resources' }, component: page(() => import('./content/pages/Resources')) },
  { path: '/changelog', label: { pt: 'Novidades', en: 'Changelog' }, component: page(() => import('./content/pages/Changelog')) },
  { path: '/components/overview', label: { pt: 'Visão geral', en: 'Overview' }, component: page(() => import('./content/pages/ComponentsOverview')) },
]

export const allStaticPages: StaticPage[] = [...topPages, ...guidelinePages, ...usagePages, ...templatePages]

export const navIcons: Record<string, IconName> = {
  'getting-started': 'rocket',
  about: 'info',
  guidelines: 'droplet',
  usage: 'code',
  components: 'grid',
  templates: 'layout',
  resources: 'book',
  changelog: 'sparkle',
  storybook: 'layers',
}
