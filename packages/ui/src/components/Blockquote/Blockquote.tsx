import { forwardRef, type HTMLAttributes, type ReactNode, type Ref } from 'react'
import { cx, devWarning } from '../../utils'
import './Blockquote.css'

export type BlockquoteSize = 'sm' | 'md' | 'lg'

export interface BlockquoteProps extends HTMLAttributes<HTMLElement> {
  /**
   * URL do documento citado (atributo `cite` do `<blockquote>`). Não é
   * exibido — a atribuição visível vai em `source`.
   */
  cite?: string
  /**
   * Atribuição visível: autor, cargo, obra (`<cite>`). Com ela, a citação é
   * envolvida em `<figure>` e a fonte vai para uma `<figcaption>` precedida
   * de travessão.
   */
  source?: ReactNode
  /** Tamanho do texto: `sm` (13px), `md` (15px, padrão) ou `lg` (17px). */
  size?: BlockquoteSize
  /**
   * Elemento do trecho. `blockquote` (padrão) para citações de outra fonte;
   * `div` para "texto em destaque" (inset text) que não é citação — um aviso
   * de prazo, um exemplo, um resumo.
   */
  as?: 'blockquote' | 'div'
}

/**
 * Citação com barra de acento à esquerda e fonte opcional. Sem `source`,
 * renderiza só o `<blockquote>`; com `source`, usa
 * `<figure><blockquote /><figcaption /></figure>`. A `ref` e os demais
 * atributos vão para o elemento raiz.
 */
export const Blockquote = forwardRef<HTMLElement, BlockquoteProps>(function Blockquote(
  { cite, source, size = 'md', as: Component = 'blockquote', className, children, ...rest },
  ref,
) {
  devWarning(
    Component === 'div' && cite !== undefined,
    'Blockquote: `cite` só vale com `as="blockquote"` — em texto em destaque (`as="div"`) ele é ignorado.',
  )
  const citeProps = Component === 'blockquote' && cite ? { cite } : {}
  const hasSource = source !== undefined && source !== null && source !== false && source !== ''
  const rootClassName = cx('or-blockquote', `or-blockquote--${size}`, className)

  if (!hasSource) {
    return (
      <Component
        ref={ref as Ref<HTMLQuoteElement & HTMLDivElement>}
        className={cx(rootClassName, 'or-blockquote__quote')}
        {...citeProps}
        {...rest}
      >
        {children}
      </Component>
    )
  }

  return (
    <figure ref={ref} className={rootClassName} {...rest}>
      <Component className="or-blockquote__quote" {...citeProps}>
        {children}
      </Component>
      <figcaption className="or-blockquote__source">{source}</figcaption>
    </figure>
  )
})
