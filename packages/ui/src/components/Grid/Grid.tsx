import { forwardRef, type CSSProperties, type ElementType, type HTMLAttributes } from 'react'
import { cx, devWarning } from '../../utils'
import {
  addResponsive,
  createResponsiveStyles,
  gapToCss,
  isListElement,
  toTrackCount,
  type LayoutGap,
  type ResponsiveValue,
} from '../Stack/responsive'
import './Grid.css'

export type GridVariant = 'plain' | 'bordered'
export type GridSpan = number | 'full'

export interface GridProps extends HTMLAttributes<HTMLElement> {
  /**
   * Elemento renderizado. Padrão: `div`. Use `ul`/`ol` (com itens `li`) para
   * coleções e `dl` para pares rótulo/valor; listas ganham `role="list"`.
   */
  as?: ElementType
  /**
   * Número de colunas de mesma largura. Responsivo:
   * `{ base: 1, sm: 2, lg: 4 }`. Padrão: `1`.
   */
  columns?: ResponsiveValue<number>
  /**
   * Largura mínima de cada item (`'16rem'`, `'240px'`). Cabem quantas colunas
   * a largura permitir — sem media queries. Tem prioridade sobre `columns`.
   */
  minItemWidth?: string
  /** Espaço entre linhas e colunas na escala de espaço (`4` = 1rem). Responsivo. Padrão: `4`. */
  gap?: ResponsiveValue<LayoutGap>
  /** Espaço só entre linhas (substitui `gap` nesse eixo). Responsivo. */
  rowGap?: ResponsiveValue<LayoutGap>
  /** Espaço só entre colunas (substitui `gap` nesse eixo). Responsivo. */
  columnGap?: ResponsiveValue<LayoutGap>
  /**
   * `plain` (padrão) ou `bordered`: as células encostam, separadas por linhas
   * de 1px e com moldura externa, como as grades de números do zop.dev. Em
   * `bordered`, `gap`/`rowGap`/`columnGap` viram o respiro interno de cada
   * célula (o espaço entre a linha e o conteúdo).
   */
  variant?: GridVariant
}

/**
 * Layout em duas dimensões: colunas de mesma largura (fixas por breakpoint ou
 * automáticas por largura mínima) com espaçamento da escala do sistema.
 */
export const Grid = forwardRef<HTMLElement, GridProps>(function Grid(
  {
    as: Component = 'div',
    columns,
    minItemWidth,
    gap,
    rowGap,
    columnGap,
    variant = 'plain',
    className,
    style,
    ...rest
  },
  ref,
) {
  devWarning(
    columns !== undefined && minItemWidth !== undefined,
    'Grid: use `columns` ou `minItemWidth`, não os dois — `minItemWidth` tem prioridade.',
  )
  const responsive = createResponsiveStyles()
  if (minItemWidth) responsive.style['--_grid-min'] = minItemWidth
  else addResponsive(responsive, columns, '--_grid-cols', 'or-grid--cols', toTrackCount)
  addResponsive(responsive, rowGap ?? gap, '--_grid-row-gap', 'or-grid--row-gap', gapToCss)
  addResponsive(responsive, columnGap ?? gap, '--_grid-col-gap', 'or-grid--col-gap', gapToCss)

  const hasVars = Object.keys(responsive.style).length > 0
  return (
    <Component
      ref={ref}
      className={cx(
        'or-grid',
        `or-grid--${variant}`,
        minItemWidth && 'or-grid--auto',
        ...responsive.classes,
        className,
      )}
      style={hasVars || style ? ({ ...responsive.style, ...style } as CSSProperties) : undefined}
      role={isListElement(Component) ? 'list' : undefined}
      {...rest}
    />
  )
})

export interface GridItemProps extends HTMLAttributes<HTMLElement> {
  /** Elemento renderizado. Padrão: `div`. Dentro de `Grid as="ul"`, use `li`. */
  as?: ElementType
  /**
   * Quantas colunas o item ocupa, ou `full` para a linha inteira. Responsivo:
   * `{ base: 'full', lg: 2 }`. Não passe de `columns` no mesmo breakpoint.
   */
  span?: ResponsiveValue<GridSpan>
}

const spanToCss = (span: GridSpan) => {
  if (span === 'full') return '1 / -1'
  const count = toTrackCount(span)
  return `span ${count} / span ${count}`
}

/** Item de `Grid` que ocupa mais de uma coluna. Itens simples não precisam dele. */
export const GridItem = forwardRef<HTMLElement, GridItemProps>(function GridItem(
  { as: Component = 'div', span, className, style, ...rest },
  ref,
) {
  const responsive = createResponsiveStyles()
  addResponsive(responsive, span, '--_grid-span', 'or-grid-item--span', spanToCss)
  const hasVars = Object.keys(responsive.style).length > 0
  return (
    <Component
      ref={ref}
      className={cx('or-grid-item', ...responsive.classes, className)}
      style={hasVars || style ? ({ ...responsive.style, ...style } as CSSProperties) : undefined}
      {...rest}
    />
  )
})
