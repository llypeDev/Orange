import {
  forwardRef,
  type CSSProperties,
  type HTMLAttributes,
  type Key,
  type ReactNode,
} from 'react'
import { cx } from '../../utils'
import './DescriptionList.css'

export type DescriptionListLayout = 'horizontal' | 'vertical' | 'grid'
export type DescriptionTermVariant = 'eyebrow' | 'strong'

export interface DescriptionListItem {
  /** Termo (rótulo) — vira um `<dt>`. */
  term: ReactNode
  /** Descrição (valor) — vira um `<dd>`. Use um array para vários valores do mesmo termo. */
  description: ReactNode | ReactNode[]
  /** Chave estável (padrão: índice). */
  key?: Key
}

export interface DescriptionListProps extends HTMLAttributes<HTMLDListElement> {
  /** Pares termo/descrição. Alternativa a compor com `DescriptionGroup`/`DescriptionTerm`/`DescriptionDetails`. */
  items?: DescriptionListItem[]
  /**
   * `horizontal` (termo à esquerda, padrão), `vertical` (termo acima) ou
   * `grid` (células com bordas de 1px — exige `items` ou `DescriptionGroup`).
   */
  layout?: DescriptionListLayout
  /** Estilo dos termos: `eyebrow` (caixa alta, padrão) ou `strong` (negrito). */
  termVariant?: DescriptionTermVariant
  /** Colunas do layout `grid` em telas largas. Padrão: `3`. */
  columns?: 1 | 2 | 3 | 4 | 5 | 6
  /** Largura da coluna de termos no layout `horizontal` (valor CSS). Padrão: `12rem`. */
  termWidth?: string
  /** Linhas de 1px entre os pares (layouts `horizontal` e `vertical`). Padrão: `true`. */
  divided?: boolean
  /** Tamanho do texto. Padrão: `md`. */
  size?: 'sm' | 'md'
}

/**
 * Lista de pares termo/descrição (`<dl>`) para metadados, especificações e
 * resumos — "Plano: Pro", "Vencimento: 12/03".
 */
export const DescriptionList = forwardRef<HTMLDListElement, DescriptionListProps>(function DescriptionList(
  {
    items,
    layout = 'horizontal',
    termVariant = 'eyebrow',
    columns = 3,
    termWidth,
    divided = true,
    size = 'md',
    className,
    style,
    children,
    ...rest
  },
  ref,
) {
  const vars = {
    ...(layout === 'grid' ? { '--_cols': columns } : null),
    ...(termWidth ? { '--_term-width': termWidth } : null),
    ...style,
  } as CSSProperties

  return (
    <dl
      ref={ref}
      className={cx(
        'or-dl',
        `or-dl--${layout}`,
        `or-dl--term-${termVariant}`,
        `or-dl--${size}`,
        divided && layout !== 'grid' && 'or-dl--divided',
        className,
      )}
      style={vars}
      {...rest}
    >
      {items
        ? items.map((item, index) => (
            <DescriptionGroup key={item.key ?? index}>
              <DescriptionTerm>{item.term}</DescriptionTerm>
              {Array.isArray(item.description) ? (
                item.description.map((d, i) => <DescriptionDetails key={i}>{d}</DescriptionDetails>)
              ) : (
                <DescriptionDetails>{item.description}</DescriptionDetails>
              )}
            </DescriptionGroup>
          ))
        : children}
    </dl>
  )
})

export type DescriptionGroupProps = HTMLAttributes<HTMLDivElement>

/** Agrupa um termo e suas descrições (`<div>` dentro do `<dl>`). Necessário no layout `grid`. */
export const DescriptionGroup = forwardRef<HTMLDivElement, DescriptionGroupProps>(function DescriptionGroup(
  { className, ...rest },
  ref,
) {
  return <div ref={ref} className={cx('or-dl__group', className)} {...rest} />
})

export type DescriptionTermProps = HTMLAttributes<HTMLElement>

/** Termo de uma `DescriptionList` (`<dt>`). */
export const DescriptionTerm = forwardRef<HTMLElement, DescriptionTermProps>(function DescriptionTerm(
  { className, ...rest },
  ref,
) {
  return <dt ref={ref} className={cx('or-dl__term', className)} {...rest} />
})

export type DescriptionDetailsProps = HTMLAttributes<HTMLElement>

/** Descrição de um termo (`<dd>`). */
export const DescriptionDetails = forwardRef<HTMLElement, DescriptionDetailsProps>(function DescriptionDetails(
  { className, ...rest },
  ref,
) {
  return <dd ref={ref} className={cx('or-dl__details', className)} {...rest} />
})
