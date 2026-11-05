import {
  Children,
  forwardRef,
  type CSSProperties,
  type ElementType,
  type HTMLAttributes,
} from 'react'
import { cx } from '../../utils'
import {
  addResponsive,
  createResponsiveStyles,
  gapToCss,
  isListElement,
  type LayoutGap,
  type ResponsiveValue,
} from './responsive'
import './Stack.css'

export type StackDirection = 'vertical' | 'horizontal'
export type StackAlign = 'start' | 'center' | 'end' | 'stretch' | 'baseline'
export type StackJustify = 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly'

export interface StackProps extends HTMLAttributes<HTMLElement> {
  /**
   * Elemento renderizado. Padrão: `div`. `ul`/`ol` mantêm a semântica de lista
   * (com `role="list"`); `nav` e `section` precisam de um nome acessível.
   */
  as?: ElementType
  /**
   * Eixo principal: `vertical` (coluna, padrão) ou `horizontal` (linha).
   * Responsivo: `{ base: 'vertical', md: 'horizontal' }` empilha no celular e
   * vira linha a partir de 768px. Não existe `reverse`: a ordem visual é sempre
   * a ordem do DOM (WCAG 1.3.2).
   */
  direction?: ResponsiveValue<StackDirection>
  /** Espaço entre os filhos na escala de espaço (`4` = 1rem). Responsivo. Padrão: `4`. */
  gap?: ResponsiveValue<LayoutGap>
  /** Alinhamento no eixo cruzado (`align-items`). Padrão: `stretch`. */
  align?: StackAlign
  /** Distribuição no eixo principal (`justify-content`). Padrão: `start`. */
  justify?: StackJustify
  /** Quebra os filhos em novas linhas quando não cabem. */
  wrap?: boolean
  /**
   * Linha de 1px (`--or-color-border`) entre os filhos, com `gap` de cada lado.
   * Acompanha a direção (horizontal ou vertical) sozinha. Decorativa: fica
   * oculta para leitores de tela. Pensada para pilhas sem `wrap`.
   */
  separator?: boolean
}

/**
 * Layout em uma dimensão: empilha os filhos na vertical ou na horizontal com
 * espaçamento da escala do sistema. Direção e espaço podem mudar por
 * breakpoint, só com CSS.
 */
export const Stack = forwardRef<HTMLElement, StackProps>(function Stack(
  {
    as: Component = 'div',
    direction,
    gap,
    align = 'stretch',
    justify = 'start',
    wrap = false,
    separator = false,
    className,
    style,
    children,
    ...rest
  },
  ref,
) {
  const responsive = createResponsiveStyles()
  addResponsive(responsive, direction, '--_stack-dir', 'or-stack--dir', (d) =>
    d === 'horizontal' ? 'row' : 'column',
  )
  addResponsive(responsive, gap, '--_stack-gap', 'or-stack--gap', gapToCss)
  const isList = isListElement(Component)

  let content = children
  if (separator) {
    // Em listas o separador é um <li> oculto (ul/ol só aceitam li); em <dl>, um <div>.
    const Separator: ElementType = isList ? 'li' : Component === 'dl' ? 'div' : 'span'
    content = Children.toArray(children).flatMap((child, index) =>
      index === 0
        ? [child]
        : [
            <Separator
              key={`or-stack-separator-${index}`}
              className="or-stack__separator"
              aria-hidden="true"
            />,
            child,
          ],
    )
  }

  const hasVars = Object.keys(responsive.style).length > 0
  return (
    <Component
      ref={ref}
      className={cx(
        'or-stack',
        `or-stack--align-${align}`,
        `or-stack--justify-${justify}`,
        wrap && 'or-stack--wrap',
        separator && 'or-stack--separated',
        ...responsive.classes,
        className,
      )}
      style={hasVars || style ? ({ ...responsive.style, ...style } as CSSProperties) : undefined}
      role={isList ? 'list' : undefined}
      {...rest}
    >
      {content}
    </Component>
  )
})
