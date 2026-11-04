/**
 * Helpers internos de movimento do grupo "Seleção e entrada" (não exportados
 * pela biblioteca): saída animada de itens de lista (chips/tags) e tremor
 * de erro disparado uma vez quando o erro surge.
 */
import { useCallback, useEffect, useRef, useState, type AnimationEvent } from 'react'
import { usePresence } from '../../hooks'
import { canUseDOM } from '../../utils'

/** `true` quando o elemento tem uma animação CSS com duração > 0 (falso no jsdom). */
function hasRunningAnimation(el: Element): boolean {
  if (!canUseDOM) return false
  const style = getComputedStyle(el)
  if (!style.animationName || style.animationName === 'none') return false
  return style.animationDuration.split(',').some((d) => parseFloat(d) > 0)
}

export interface ExitingEntry<T> {
  item: T
  key: string
  /** O item já foi removido e está tocando a animação de saída. */
  leaving: boolean
}

/**
 * Mantém na lista, por uma animação curta, os itens que acabaram de ser
 * removidos — na mesma posição — para que saiam com fade/scale em vez de
 * sumir de uma vez. Itens que saem são marcados `leaving` (renderize-os com
 * `aria-hidden`, `inert` e `data-state="closed"`) e liberados no
 * `animationend` (ou na hora, se não houver animação).
 */
export function useExitingItems<T>(items: T[], keyOf: (item: T) => string) {
  const keys = items.map(keyOf)
  const signature = keys.join('\u0000')
  const [prev, setPrev] = useState({ items, signature })
  const [leaving, setLeaving] = useState<{ item: T; key: string; index: number }[]>([])

  // Estado derivado durante a renderização (compara as chaves, não a identidade do array):
  // evita desmontar e remontar o item que sai.
  if (prev.signature !== signature) {
    const nextKeys = new Set(keys)
    const removed = prev.items
      .map((item, index) => ({ item, key: keyOf(item), index }))
      .filter((entry) => !nextKeys.has(entry.key))
    setPrev({ items, signature })
    setLeaving((current) => [
      ...current.filter(
        (entry) => !nextKeys.has(entry.key) && !removed.some((r) => r.key === entry.key),
      ),
      ...removed,
    ])
  }

  const release = useCallback((key: string) => {
    setLeaving((current) =>
      current.some((e) => e.key === key) ? current.filter((e) => e.key !== key) : current,
    )
  }, [])

  // Rede de segurança: libera tudo depois de 1s mesmo sem animationend.
  useEffect(() => {
    if (leaving.length === 0) return
    const timer = setTimeout(() => setLeaving([]), 1000)
    return () => clearTimeout(timer)
  }, [leaving])

  const entries: ExitingEntry<T>[] = items.map((item) => ({
    item,
    key: keyOf(item),
    leaving: false,
  }))
  for (const entry of [...leaving].sort((a, b) => a.index - b.index)) {
    entries.splice(Math.min(entry.index, entries.length), 0, {
      item: entry.item,
      key: entry.key,
      leaving: true,
    })
  }

  /** Props para o elemento de um item que está saindo. */
  const leavingProps = (key: string) => ({
    'aria-hidden': true as const,
    inert: true,
    'data-state': 'closed' as const,
    ref: (el: HTMLElement | null) => {
      if (el && !hasRunningAnimation(el)) release(key)
    },
    onAnimationEnd: (event: AnimationEvent<HTMLElement>) => {
      if (event.target === event.currentTarget) release(key)
    },
  })

  return { entries, leavingProps }
}

/**
 * Liga um tremor curto (`data-shake`) quando `signal` muda para um valor
 * verdadeiro — ex.: a mensagem de erro surge ou muda. Não dispara na
 * montagem, para que erros já presentes não "pisquem" ao carregar a página.
 */
export function useShake(signal: unknown) {
  const [shaking, setShaking] = useState(false)
  const previous = useRef(signal)
  useEffect(() => {
    if (signal && signal !== previous.current) setShaking(true)
    previous.current = signal
  }, [signal])
  useEffect(() => {
    if (!shaking) return
    const timer = setTimeout(() => setShaking(false), 800)
    return () => clearTimeout(timer)
  }, [shaking])
  const onAnimationEnd = useCallback((event: AnimationEvent<HTMLElement>) => {
    if (event.target === event.currentTarget) setShaking(false)
  }, [])
  return { 'data-shake': shaking || undefined, onAnimationEnd }
}

/**
 * `usePresence` para elementos pequenos dentro do campo (botão limpar):
 * `dataState` só é definido depois da primeira mudança, para que um botão
 * já visível ao carregar não anime na montagem.
 */
export function useInlinePresence<T extends HTMLElement = HTMLElement>(open: boolean) {
  const { present, state, nodeRef } = usePresence<T>(open)
  const initial = useRef(open)
  const changed = useRef(false)
  if (open !== initial.current) changed.current = true
  return { present, closing: !open, nodeRef, dataState: changed.current ? state : undefined }
}
