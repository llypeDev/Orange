import {
  createContext,
  forwardRef,
  useContext,
  useMemo,
  type CSSProperties,
  type HTMLAttributes,
  type LiHTMLAttributes,
  type ReactNode,
  type Ref,
} from 'react'
import { cx, mergeRefs } from '../../utils'
import { useStaggerReveal } from './useStaggerReveal'
import './List.css'

export type ListVariant = 'bullet' | 'numbered' | 'icon' | 'divided' | 'inline' | 'plain'
export type ListSize = 'sm' | 'md' | 'lg'

export interface ListProps extends HTMLAttributes<HTMLElement> {
  /**
   * `bullet` (marcador quadrado laranja), `numbered` ("01", "02"…), `icon`
   * (ícone por item), `divided` (linhas entre itens), `inline` (itens na mesma
   * linha separados por "·") ou `plain` (sem marcador). Padrão: `bullet`.
   */
  variant?: ListVariant
  /** Elemento da lista. Padrão: `ol` para `numbered`, `ul` para as demais. */
  as?: 'ul' | 'ol'
  /** Tamanho do texto e do espaçamento entre itens. Padrão: `md`. */
  size?: ListSize
  /** Número inicial da variante `numbered`. Padrão: `1`. */
  start?: number
  /** Ícone padrão dos itens na variante `icon` (cada `ListItem` pode sobrescrever). */
  icon?: ReactNode
  /**
   * Os itens entram escalonados (subindo 24px, 80ms entre eles) quando a lista
   * aparece na tela. Para listas de destaque em páginas de apresentação.
   */
  animated?: boolean
}

interface ListContextValue {
  variant: ListVariant
  icon?: ReactNode
}

const ListContext = createContext<ListContextValue>({ variant: 'bullet' })

/**
 * Lista de itens com marcadores do Orange. Use `ul` quando a ordem não importa
 * e `numbered` (`ol`) para passos e rankings.
 */
export const List = forwardRef<HTMLElement, ListProps>(function List(
  { variant = 'bullet', as, size = 'md', start, icon, animated = false, className, style, children, ...rest },
  ref,
) {
  const reveal = useStaggerReveal<HTMLElement>(animated)
  const composedRef = useMemo(() => mergeRefs(ref, reveal.ref), [ref, reveal.ref])
  const Component = as ?? (variant === 'numbered' ? 'ol' : 'ul')
  const isOrdered = Component === 'ol'
  const counterStyle: CSSProperties | undefined =
    variant === 'numbered' ? { counterReset: `or-list ${(start ?? 1) - 1}`, ...style } : style

  return (
    <ListContext.Provider value={{ variant, icon }}>
      <Component
        ref={composedRef as Ref<HTMLUListElement & HTMLOListElement>}
        // `list-style: none` remove a semântica de lista no Safari/VoiceOver;
        // o papel explícito a restaura.
        role="list"
        className={cx('or-list', `or-list--${variant}`, `or-list--${size}`, className)}
        start={isOrdered ? start : undefined}
        style={counterStyle}
        data-reveal={reveal.state === 'idle' ? undefined : reveal.state}
        {...rest}
      >
        {children}
      </Component>
    </ListContext.Provider>
  )
})

export interface ListItemProps extends LiHTMLAttributes<HTMLLIElement> {
  /** Texto secundário exibido abaixo do conteúdo principal. */
  description?: ReactNode
  /** Ícone do item (variante `icon`). Sobrescreve o `icon` da `List`. */
  icon?: ReactNode
}

/** Item de `List`. Aceita uma descrição secundária opcional. */
export const ListItem = forwardRef<HTMLLIElement, ListItemProps>(function ListItem(
  { description, icon, className, children, ...rest },
  ref,
) {
  const { variant, icon: listIcon } = useContext(ListContext)
  const itemIcon = icon ?? listIcon
  const showIcon = variant === 'icon' && itemIcon !== undefined && itemIcon !== null

  return (
    <li ref={ref} className={cx('or-list__item', className)} {...rest}>
      {showIcon && (
        <span className="or-list__icon" aria-hidden="true">
          {itemIcon}
        </span>
      )}
      <div className="or-list__content">
        {description !== undefined && description !== null ? (
          <>
            <div className="or-list__label">{children}</div>
            <div className="or-list__description">{description}</div>
          </>
        ) : (
          children
        )}
      </div>
    </li>
  )
})
