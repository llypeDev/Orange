import { forwardRef, useEffect, useState, type CSSProperties, type ElementType, type HTMLAttributes } from 'react'
import { useInView, useIsomorphicLayoutEffect, useReducedMotion } from '../../hooks'
import { cx, mergeRefs } from '../../utils'

export type RevealVariant = 'up' | 'fade' | 'scale'

export interface RevealProps extends HTMLAttributes<HTMLElement> {
  /** Elemento renderizado. Padrão: `div`. */
  as?: ElementType
  /** Tipo de entrada: subir 24px (padrão), só opacidade ou leve escala. */
  variant?: RevealVariant
  /** Atraso antes de começar, em ms. */
  delay?: number
  /** Posição numa sequência: cada índice soma `--or-stagger` (80ms) ao atraso. */
  index?: number
  /** Escalona os filhos diretos (cada um entra 80ms depois do anterior). */
  stagger?: boolean
  /** Revela só uma vez (padrão) ou sempre que entrar na viewport. */
  once?: boolean
  /** Margem do IntersectionObserver. */
  rootMargin?: string
}

type RevealState = 'idle' | 'hidden' | 'shown'

/**
 * Revela o conteúdo quando ele entra na viewport: sobe 24px e aparece em
 * 600ms, com escalonamento opcional entre os filhos. Conteúdo já visível na
 * carga não pisca; sem JavaScript ou com movimento reduzido, tudo aparece
 * imediatamente. Puramente visual: nada é escondido de leitores de tela.
 */
export const Reveal = forwardRef<HTMLElement, RevealProps>(function Reveal(
  {
    as: Component = 'div',
    variant = 'up',
    delay,
    index,
    stagger = false,
    once = true,
    rootMargin = '0px 0px -60px 0px',
    className,
    style,
    children,
    ...rest
  },
  ref,
) {
  const reduced = useReducedMotion()
  const [viewRef, inView] = useInView<HTMLElement>({ rootMargin, once })
  const [node, setNode] = useState<HTMLElement | null>(null)
  // 'idle' no servidor e na primeira pintura: nada fica escondido sem JS.
  const [state, setState] = useState<RevealState>('idle')

  useIsomorphicLayoutEffect(() => {
    if (!node || reduced) return
    const rect = node.getBoundingClientRect()
    const alreadyVisible = rect.top < window.innerHeight && rect.bottom >= 0
    // Acima da dobra já aparece; o resto aguarda o scroll.
    if (!alreadyVisible) setState('hidden')
  }, [node, reduced])

  useEffect(() => {
    if (inView) setState((s) => (s === 'hidden' ? 'shown' : s))
    else if (!once) setState((s) => (s === 'shown' ? 'hidden' : s))
  }, [inView, once])

  return (
    <Component
      ref={mergeRefs(ref, viewRef, setNode)}
      className={cx(
        stagger ? 'or-reveal-group' : ['or-reveal', `or-reveal--${variant}`].join(' '),
        className,
      )}
      data-reveal={state === 'hidden' ? 'hidden' : 'shown'}
      style={
        {
          ...(delay ? { '--or-reveal-delay': `${delay}ms` } : null),
          ...(index !== undefined ? { '--or-reveal-index': index } : null),
          ...style,
        } as CSSProperties
      }
      {...rest}
    >
      {children}
    </Component>
  )
})
