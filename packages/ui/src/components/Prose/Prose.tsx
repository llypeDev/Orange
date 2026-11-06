import { forwardRef, type ElementType, type HTMLAttributes } from 'react'
import { cx } from '../../utils'
import './Prose.css'

export type ProseSize = 'sm' | 'md' | 'lg'

export interface ProseProps extends HTMLAttributes<HTMLElement> {
  /** Elemento renderizado. Padrão: `div`. Use `article` para um artigo completo. */
  as?: ElementType
  /**
   * Tamanho do texto e do ritmo vertical: `sm` (13px), `md` (15px, padrão) ou
   * `lg` (17px). Os títulos seguem a escala do `Heading` — `sm` desce um
   * degrau e `lg` sobe um.
   */
  size?: ProseSize
  /**
   * Limita a largura a uma medida confortável de leitura (68 caracteres).
   * Use `false` para ocupar toda a largura do contêiner. Padrão: `true`.
   */
  measure?: boolean
}

/**
 * Aplica a tipografia do Orange a conteúdo rico que a aplicação não controla
 * — HTML de um CMS, Markdown convertido, artigos de ajuda, termos de uso.
 * Estiliza os elementos descendentes (títulos, parágrafos, listas, tabelas,
 * código…) com seletores de baixa especificidade: componentes do Orange e
 * trechos marcados com `className="or-not-prose"` mantêm o próprio estilo.
 *
 * Para HTML pronto, passe `dangerouslySetInnerHTML` — **sanitizar o HTML é
 * responsabilidade da aplicação** (ex.: DOMPurify no servidor).
 */
export const Prose = forwardRef<HTMLElement, ProseProps>(function Prose(
  { as: Component = 'div', size = 'md', measure = true, className, ...rest },
  ref,
) {
  return (
    <Component
      ref={ref}
      className={cx('or-prose', `or-prose--${size}`, measure && 'or-prose--measure', className)}
      {...rest}
    />
  )
})
