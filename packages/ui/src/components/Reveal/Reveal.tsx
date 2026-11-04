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
  /**
   * Anima também quando o conteúdo já está visível ao montar (entrada de
   * página/hero). Sem `appear`, conteúdo acima da dobra aparece direto.
   */
  appear?: boolean
}

type RevealState = 'idle' | 'hidden' | 'shown'

/** Converte uma lista CSS de tempos ("0.6s, 80ms") em milissegundos. */
function toMsList(value: string): number[] {
  return value.split(',').map((part) => {
    const v = part.trim()
    const n = parseFloat(v)
    if (Number.isNaN(n)) return 0
    return v.endsWith('ms') ? n : n * 1000
  })
}

/** Maior "atraso + duração" entre as transições dos elementos. */
function longestTransition(elements: Element[]): number {
  let longest = 0
  for (const el of elements) {
    const cs = getComputedStyle(el)
    const durations = toMsList(cs.transitionDuration)
    const delays = toMsList(cs.transitionDelay)
    durations.forEach((d, i) => {
      longest = Math.max(longest, d + (delays[i % delays.length] ?? 0))
    })
  }
  return longest
}

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
    appear = false,
    className,
    style,
    children,
    ...rest
  },
  ref,
) {
  const reduced = useReducedMotion()
  // threshold 0: revela assim que o topo passa da margem. Com uma fração
  // (ex.: 8%), contêineres mais altos que ~12 telas — como uma grade de 86
  // cartões em uma coluna no celular — nunca atingiam a fração e ficavam
  // invisíveis para sempre.
  const [viewRef, inView] = useInView<HTMLElement>({ rootMargin, once, threshold: 0 })
  const [node, setNode] = useState<HTMLElement | null>(null)
  // 'idle' no servidor e na primeira pintura: nada fica escondido sem JS.
  const [state, setState] = useState<RevealState>('idle')
  // Depois que a entrada termina, as transições da revelação saem de cena e
  // os filhos voltam a usar as próprias (hover de cartões, por exemplo) —
  // sem herdar o atraso escalonado nem perder propriedades como box-shadow.
  const [settled, setSettled] = useState(false)

  useIsomorphicLayoutEffect(() => {
    if (!node || reduced) return
    const rect = node.getBoundingClientRect()
    const alreadyVisible = rect.top < window.innerHeight && rect.bottom >= 0
    if (!alreadyVisible) {
      // Abaixo da dobra: aguarda o scroll.
      setSettled(false)
      setState('hidden')
      return
    }
    if (!appear) return
    // Já visível e `appear`: esconde, e revela dois frames depois (a transição precisa de um frame).
    setSettled(false)
    setState('hidden')
    let raf2 = 0
    const raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => setState('shown'))
    })
    return () => {
      cancelAnimationFrame(raf1)
      cancelAnimationFrame(raf2)
    }
  }, [node, reduced, appear])

  useEffect(() => {
    if (inView) setState((s) => (s === 'hidden' ? 'shown' : s))
    else if (!once) {
      setSettled(false)
      setState((s) => (s === 'shown' ? 'hidden' : s))
    }
  }, [inView, once])

  // Marca a revelação como concluída quando a transição mais longa termina.
  useEffect(() => {
    if (state !== 'shown' || !node) return
    const targets = stagger ? Array.from(node.children) : [node]
    const id = window.setTimeout(() => setSettled(true), longestTransition(targets) + 50)
    return () => window.clearTimeout(id)
  }, [state, node, stagger])

  return (
    <Component
      ref={mergeRefs(ref, viewRef, setNode)}
      className={cx(
        stagger ? 'or-reveal-group' : ['or-reveal', `or-reveal--${variant}`].join(' '),
        className,
      )}
      data-reveal={state === 'hidden' ? 'hidden' : 'shown'}
      data-reveal-settled={state === 'idle' || (state === 'shown' && settled) ? '' : undefined}
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
