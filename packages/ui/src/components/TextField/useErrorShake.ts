import { useCallback, useRef, useState, type AnimationEvent } from 'react'
import { useIsomorphicLayoutEffect } from '../../hooks'

/**
 * Tremor de validação (interno ao grupo de formulários). Liga a classe
 * `or-forms-shake` UMA vez quando `invalid` passa de `false` para `true` —
 * nunca na montagem já inválida nem enquanto o erro continua. A classe é
 * removida no `animationend` do próprio elemento (ou quando o erro some).
 */
export function useErrorShake(invalid: boolean) {
  const [shaking, setShaking] = useState(false)
  const previous = useRef(invalid)

  useIsomorphicLayoutEffect(() => {
    if (invalid && !previous.current) setShaking(true)
    if (!invalid) setShaking(false)
    previous.current = invalid
  }, [invalid])

  const onAnimationEnd = useCallback((event: AnimationEvent<HTMLElement>) => {
    if (event.target === event.currentTarget && event.animationName === 'or-shake') setShaking(false)
  }, [])

  return { shakeClassName: shaking ? 'or-forms-shake' : undefined, onAnimationEnd }
}
