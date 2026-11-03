import { lazy, type ComponentType, type LazyExoticComponent } from 'react'
import type { ComponentMeta } from './types'

/*
 * Descoberta automática das páginas de componentes: basta criar
 * `src/content/components/<slug>/meta.ts` + `index.tsx` que a página aparece
 * no menu lateral, na visão geral e ganha a rota /:lang/components/<slug>.
 */

const metaModules = import.meta.glob<{ meta: ComponentMeta }>('./components/*/meta.ts', {
  eager: true,
})

const pageModules = import.meta.glob<{ default: ComponentType }>('./components/*/index.tsx')

export const componentMetas: ComponentMeta[] = Object.values(metaModules)
  .map((m) => m.meta)
  .filter(Boolean)
  .sort((a, b) => a.name.localeCompare(b.name))

const lazyCache = new Map<string, LazyExoticComponent<ComponentType>>()

export function getComponentPage(slug: string): LazyExoticComponent<ComponentType> | null {
  const loader = pageModules[`./components/${slug}/index.tsx`]
  if (!loader) return null
  let page = lazyCache.get(slug)
  if (!page) {
    page = lazy(loader)
    lazyCache.set(slug, page)
  }
  return page
}

export function getComponentMeta(slug: string): ComponentMeta | undefined {
  return componentMetas.find((m) => m.slug === slug)
}

export const STORYBOOK_URL: string = import.meta.env.VITE_STORYBOOK_URL ?? `${import.meta.env.BASE_URL}storybook/`

export const REPO_URL = 'https://github.com/llypeDev/Orange'

export function storybookUrl(meta?: Pick<ComponentMeta, "name" | "storyId">): string {
  if (!meta) return STORYBOOK_URL
  const id = meta.storyId ?? `componentes-${meta.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}--docs`
  return `${STORYBOOK_URL}?path=/docs/${id}`
}

export function sourceUrl(meta: Pick<ComponentMeta, 'name' | 'sourceDir'>): string {
  return `${REPO_URL}/tree/main/packages/ui/src/components/${meta.sourceDir ?? meta.name}`
}
