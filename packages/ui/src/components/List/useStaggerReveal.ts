import { useEffect, useState } from 'react'
import { useInView, useIsomorphicLayoutEffect, useReducedMotion } from '../../hooks'

export type StaggerRevealState = 'idle' | 'hidden' | 'shown'

/**
 * Uso interno (List, Timeline): com `enabled`, esconde os itens antes da
 * primeira pintura e os revela quando o contêiner entra na viewport. O CSS de
 * cada componente escalona os filhos com `--or-stagger`. Com movimento
 * reduzido, nada é escondido (`idle`). Opacidade não remove o conteúdo da
 * árvore de acessibilidade: leitores de tela leem tudo desde o início.
 */
export function useStaggerReveal<T extends HTMLElement>(enabled: boolean) {
  const reduced = useReducedMotion()
  const [viewRef, inView] = useInView<T>({ once: true })
  const [state, setState] = useState<StaggerRevealState>('idle')

  useIsomorphicLayoutEffect(() => {
    setState(enabled && !reduced ? 'hidden' : 'idle')
  }, [enabled, reduced])

  useEffect(() => {
    if (!inView || state !== 'hidden') return
    // Um quadro com o estado escondido já pintado garante que a transição rode.
    const raf = requestAnimationFrame(() => setState('shown'))
    return () => cancelAnimationFrame(raf)
  }, [inView, state])

  return { ref: viewRef, state: enabled ? state : ('idle' as StaggerRevealState) }
}
