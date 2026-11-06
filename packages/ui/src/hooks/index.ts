import {
  useCallback,
  useEffect,
  useId as useReactId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type RefCallback,
  type RefObject,
} from 'react'
import { canUseDOM, getFocusableElements } from '../utils'

/** `useLayoutEffect` no navegador, `useEffect` no servidor (SSR seguro). */
export const useIsomorphicLayoutEffect = canUseDOM ? useLayoutEffect : useEffect

/**
 * Gera um id estável e único. Se `providedId` for informado, ele é usado.
 * @example const id = useId('or-field')
 */
export function useId(prefix = 'or', providedId?: string): string {
  const reactId = useReactId()
  return providedId ?? `${prefix}-${reactId.replace(/[:«»]/g, '')}`
}

/**
 * Estado que pode ser controlado (via props) ou não controlado (interno).
 * Segue o padrão `value` / `defaultValue` / `onChange`.
 */
export function useControllableState<T>({
  value,
  defaultValue,
  onChange,
}: {
  value?: T
  defaultValue: T
  onChange?: (value: T) => void
}): [T, (next: T | ((prev: T) => T)) => void] {
  const [internal, setInternal] = useState<T>(defaultValue)
  const isControlled = value !== undefined
  const current = isControlled ? (value as T) : internal
  const currentRef = useRef(current)
  currentRef.current = current
  const onChangeRef = useRef(onChange)
  onChangeRef.current = onChange

  const setValue = useCallback(
    (next: T | ((prev: T) => T)) => {
      const resolved =
        typeof next === 'function' ? (next as (prev: T) => T)(currentRef.current) : next
      if (Object.is(resolved, currentRef.current)) return
      if (!isControlled) setInternal(resolved)
      currentRef.current = resolved
      onChangeRef.current?.(resolved)
    },
    [isControlled],
  )

  return [current, setValue]
}

export interface UseDisclosureReturn {
  isOpen: boolean
  open: () => void
  close: () => void
  toggle: () => void
  setOpen: (open: boolean) => void
}

/** Controla estados abre/fecha (modais, menus, drawers). */
export function useDisclosure(
  options: { open?: boolean; defaultOpen?: boolean; onOpenChange?: (open: boolean) => void } = {},
): UseDisclosureReturn {
  const [isOpen, setOpen] = useControllableState({
    value: options.open,
    defaultValue: options.defaultOpen ?? false,
    onChange: options.onOpenChange,
  })
  const open = useCallback(() => setOpen(true), [setOpen])
  const close = useCallback(() => setOpen(false), [setOpen])
  const toggle = useCallback(() => setOpen((v) => !v), [setOpen])
  return useMemo(() => ({ isOpen, open, close, toggle, setOpen }), [isOpen, open, close, toggle, setOpen])
}

/** Adiciona um listener tipado a `window`, `document` ou um elemento. */
export function useEventListener<K extends keyof WindowEventMap>(
  type: K,
  handler: (event: WindowEventMap[K]) => void,
  target?: Window | Document | HTMLElement | null,
  options?: AddEventListenerOptions,
) {
  const handlerRef = useRef(handler)
  handlerRef.current = handler
  useEffect(() => {
    const el = target === undefined ? (canUseDOM ? window : null) : target
    if (!el) return
    const listener = (e: Event) => handlerRef.current(e as WindowEventMap[K])
    el.addEventListener(type, listener, options)
    return () => el.removeEventListener(type, listener, options)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type, target, options?.capture, options?.passive])
}

/** Chama `handler` quando ocorre clique/toque fora dos elementos informados. */
export function useClickOutside(
  refs: RefObject<HTMLElement | null> | RefObject<HTMLElement | null>[],
  handler: (event: PointerEvent) => void,
  enabled = true,
) {
  const handlerRef = useRef(handler)
  handlerRef.current = handler
  useEffect(() => {
    if (!enabled) return
    const list = Array.isArray(refs) ? refs : [refs]
    const listener = (event: PointerEvent) => {
      const target = event.target as Node
      if (list.some((r) => r.current?.contains(target))) return
      handlerRef.current(event)
    }
    document.addEventListener('pointerdown', listener)
    return () => document.removeEventListener('pointerdown', listener)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled])
}

/** Chama `handler` quando a tecla Escape é pressionada. */
export function useEscapeKey(handler: (event: KeyboardEvent) => void, enabled = true) {
  const handlerRef = useRef(handler)
  handlerRef.current = handler
  useEffect(() => {
    if (!enabled) return
    const listener = (event: KeyboardEvent) => {
      if (event.key === 'Escape') handlerRef.current(event)
    }
    document.addEventListener('keydown', listener)
    return () => document.removeEventListener('keydown', listener)
  }, [enabled])
}

/** Retorna `true` enquanto a media query corresponder. */
export function useMediaQuery(query: string, defaultValue = false): boolean {
  const [matches, setMatches] = useState(() =>
    canUseDOM && window.matchMedia ? window.matchMedia(query).matches : defaultValue,
  )
  useEffect(() => {
    if (!canUseDOM || !window.matchMedia) return
    const mql = window.matchMedia(query)
    const update = () => setMatches(mql.matches)
    update()
    mql.addEventListener?.('change', update)
    return () => mql.removeEventListener?.('change', update)
  }, [query])
  return matches
}

/** `true` quando o usuário pediu menos movimento no sistema operacional. */
export function useReducedMotion(): boolean {
  return useMediaQuery('(prefers-reduced-motion: reduce)')
}

/** Bloqueia o scroll do `body` enquanto `locked` for verdadeiro. */
export function useLockBodyScroll(locked: boolean) {
  useIsomorphicLayoutEffect(() => {
    if (!locked || !canUseDOM) return
    const { body, documentElement } = document
    const prevOverflow = body.style.overflow
    const prevPadding = body.style.paddingRight
    // clientWidth é 0 em ambientes sem layout (jsdom, SSR hidratado); ignore nesses casos.
    const scrollbar = documentElement.clientWidth > 0 ? window.innerWidth - documentElement.clientWidth : 0
    body.style.overflow = 'hidden'
    if (scrollbar > 0 && scrollbar < 64) body.style.paddingRight = `${scrollbar}px`
    return () => {
      body.style.overflow = prevOverflow
      body.style.paddingRight = prevPadding
    }
  }, [locked])
}

/**
 * Prende o foco do teclado dentro de `ref` enquanto `active` for verdadeiro.
 * Ao desativar, devolve o foco para o elemento que estava focado antes.
 */
export function useFocusTrap(
  ref: RefObject<HTMLElement | null>,
  active: boolean,
  options: { initialFocus?: RefObject<HTMLElement | null>; restoreFocus?: boolean } = {},
) {
  const { initialFocus, restoreFocus = true } = options
  useEffect(() => {
    if (!active) return
    const root = ref.current
    if (!root) return
    const previouslyFocused = document.activeElement as HTMLElement | null

    const focusFirst = () => {
      const target = initialFocus?.current ?? getFocusableElements(root)[0] ?? root
      if (target === root && !root.hasAttribute('tabindex')) root.setAttribute('tabindex', '-1')
      target.focus({ preventScroll: true })
    }
    // aguarda o próximo frame para garantir que o conteúdo foi renderizado
    const raf = requestAnimationFrame(focusFirst)

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return
      const focusables = getFocusableElements(root)
      if (focusables.length === 0) {
        event.preventDefault()
        return
      }
      const first = focusables[0]
      const last = focusables[focusables.length - 1]
      const activeEl = document.activeElement
      if (event.shiftKey && (activeEl === first || activeEl === root)) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && activeEl === last) {
        event.preventDefault()
        first.focus()
      }
    }
    root.addEventListener('keydown', onKeyDown)
    return () => {
      cancelAnimationFrame(raf)
      root.removeEventListener('keydown', onKeyDown)
      if (restoreFocus && previouslyFocused && document.contains(previouslyFocused)) {
        previouslyFocused.focus({ preventScroll: true })
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active])
}

export type RovingOrientation = 'horizontal' | 'vertical' | 'both'

/**
 * Navegação por setas entre itens (padrão "roving tabindex" do WAI-ARIA).
 * Retorna um handler de `onKeyDown` para o contêiner. Os itens devem ter o
 * atributo `data-roving-item` e não estar desabilitados.
 */
export function useRovingFocus(
  containerRef: RefObject<HTMLElement | null>,
  options: { orientation?: RovingOrientation; loop?: boolean; selector?: string } = {},
) {
  const { orientation = 'horizontal', loop = true, selector = '[data-roving-item]:not([disabled])' } = options
  return useCallback(
    (event: React.KeyboardEvent) => {
      const container = containerRef.current
      if (!container) return
      const items = Array.from(container.querySelectorAll<HTMLElement>(selector))
      if (items.length === 0) return
      const index = items.indexOf(document.activeElement as HTMLElement)
      const prevKeys = orientation === 'vertical' ? ['ArrowUp'] : orientation === 'horizontal' ? ['ArrowLeft'] : ['ArrowUp', 'ArrowLeft']
      const nextKeys = orientation === 'vertical' ? ['ArrowDown'] : orientation === 'horizontal' ? ['ArrowRight'] : ['ArrowDown', 'ArrowRight']
      let next = -1
      if (nextKeys.includes(event.key)) next = index + 1 >= items.length ? (loop ? 0 : index) : index + 1
      else if (prevKeys.includes(event.key)) next = index - 1 < 0 ? (loop ? items.length - 1 : 0) : index - 1
      else if (event.key === 'Home') next = 0
      else if (event.key === 'End') next = items.length - 1
      else return
      event.preventDefault()
      items.forEach((el, i) => el.setAttribute('tabindex', i === next ? '0' : '-1'))
      items[next]?.focus()
    },
    [containerRef, orientation, loop, selector],
  )
}

/** Copia texto para a área de transferência e expõe o estado `copied`. */
export function useClipboard(timeout = 2000) {
  const [copied, setCopied] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined)
  const copy = useCallback(
    async (text: string) => {
      try {
        if (navigator.clipboard?.writeText) {
          await navigator.clipboard.writeText(text)
        } else {
          const el = document.createElement('textarea')
          el.value = text
          el.setAttribute('readonly', '')
          el.style.position = 'absolute'
          el.style.left = '-9999px'
          document.body.appendChild(el)
          el.select()
          document.execCommand('copy')
          document.body.removeChild(el)
        }
        setCopied(true)
        clearTimeout(timer.current)
        timer.current = setTimeout(() => setCopied(false), timeout)
        return true
      } catch {
        setCopied(false)
        return false
      }
    },
    [timeout],
  )
  useEffect(() => () => clearTimeout(timer.current), [])
  return { copy, copied }
}

/** Retorna `value` somente após `delay` ms sem alterações. */
export function useDebouncedValue<T>(value: T, delay = 300): T {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(t)
  }, [value, delay])
  return debounced
}

/** Guarda o valor da renderização anterior. */
export function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T | undefined>(undefined)
  useEffect(() => {
    ref.current = value
  }, [value])
  return ref.current
}

/** `true` depois que o componente montou no cliente (útil para portais/SSR). */
export function useMounted(): boolean {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  return mounted
}

/* -------------------------------------------------------------------------- */
/* Motion                                                                      */
/* -------------------------------------------------------------------------- */

export type PresenceState = 'open' | 'closed'

/**
 * Mantém um elemento montado enquanto a animação (ou transição) de saída roda.
 *
 * - `present`: renderizar o elemento?
 * - `state`: `open` | `closed` — aplique em `data-state` e anime
 *   `[data-state='closed']` com uma keyframe de saída (ex.: `or-pop-out`).
 * - `nodeRef`: ligue ao elemento animado.
 *
 * Sem animação (jsdom, CSS ausente, movimento reduzido) desmonta na hora.
 *
 * @example
 * const { present, state, nodeRef } = usePresence(open)
 * return present ? <div ref={nodeRef} data-state={state} className="or-popover" /> : null
 */
export function usePresence<T extends HTMLElement = HTMLElement>(open: boolean, options: { timeout?: number } = {}) {
  const { timeout = 1000 } = options
  const [mounted, setMounted] = useState(open)
  const nodeRef = useRef<T | null>(null)

  useEffect(() => {
    if (open) {
      setMounted(true)
      return
    }
    if (!mounted) return
    const node = nodeRef.current
    const style = node && canUseDOM ? getComputedStyle(node) : null
    const seconds = (value: string | undefined) =>
      Math.max(0, ...(value ?? '0s').split(',').map((v) => (v.trim().endsWith('ms') ? parseFloat(v) / 1000 : parseFloat(v) || 0)))
    // Movimento reduzido: o base.css força durações de 0.01ms em tudo — trate como sem animação
    // (senão o hook esperaria um animationend/transitionend que nunca vem até o fallback).
    const reduced = canUseDOM && !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    const MIN = 0.002 // segundos; abaixo disso não há animação perceptível
    const hasAnimation =
      !!style && !!style.animationName && style.animationName !== 'none' && seconds(style.animationDuration) > MIN
    const hasTransition = !!style && seconds(style.transitionDuration) > MIN
    if (!node || reduced || (!hasAnimation && !hasTransition)) {
      setMounted(false)
      return
    }
    // Espera TODAS as animações/transições do nó terminarem (ex.: opacidade em 160ms
    // e transform em 250ms) — não só o primeiro *end que chegar.
    const done = (event: Event) => {
      if (event.target !== node) return
      const running =
        typeof node.getAnimations === 'function'
          ? node.getAnimations().some((a) => a.playState === 'running' || a.pending)
          : false
      if (!running) setMounted(false)
    }
    node.addEventListener('animationend', done)
    node.addEventListener('animationcancel', done)
    node.addEventListener('transitionend', done)
    node.addEventListener('transitioncancel', done)
    // Só transição (sem keyframe de saída): se nenhuma propriedade começar a
    // transicionar logo, não há o que esperar — desmonta sem aguardar o fallback.
    let started = hasAnimation
    const onRun = (event: Event) => {
      if (event.target === node) started = true
    }
    node.addEventListener('transitionrun', onRun)
    const noTransition = hasAnimation ? 0 : window.setTimeout(() => !started && setMounted(false), 50)
    const fallback = window.setTimeout(() => setMounted(false), timeout)
    return () => {
      node.removeEventListener('animationend', done)
      node.removeEventListener('animationcancel', done)
      node.removeEventListener('transitionend', done)
      node.removeEventListener('transitioncancel', done)
      node.removeEventListener('transitionrun', onRun)
      window.clearTimeout(noTransition)
      window.clearTimeout(fallback)
    }
  }, [open, mounted, timeout])

  return {
    present: open || mounted,
    state: (open ? 'open' : 'closed') as PresenceState,
    nodeRef,
  }
}

/** `true` quando a margem inferior de um `rootMargin` (1 a 4 valores) é negativa. */
function hasNegativeBottomMargin(rootMargin: string): boolean {
  const parts = rootMargin.trim().split(/\s+/)
  return Number.parseFloat(parts.length > 2 ? parts[2] : parts[0]) < 0
}

/**
 * `true` quando o elemento entra na viewport (IntersectionObserver).
 * Por padrão dispara uma vez (`once`) — ideal para revelações no scroll.
 * Sem suporte a IntersectionObserver, retorna `true`.
 *
 * Com margem inferior negativa (o padrão, `-60px`), um elemento nos últimos pixels da
 * página nunca entraria na faixa observada — nem no fim da rolagem. Por isso, quando a
 * rolagem chega ao fim (ou a página não rola), o que não ficou acima da área visível
 * conta como visto.
 */
export function useInView<T extends Element = HTMLElement>(
  options: { rootMargin?: string; threshold?: number | number[]; once?: boolean; root?: Element | null } = {},
): [RefCallback<T>, boolean] {
  const { rootMargin = '0px 0px -60px 0px', threshold = 0.08, once = true, root = null } = options
  const [inView, setInView] = useState(false)
  const [node, setNode] = useState<T | null>(null)
  const ref = useCallback<RefCallback<T>>((el) => setNode(el), [])

  useEffect(() => {
    if (!node) return
    if (typeof IntersectionObserver === 'undefined') {
      setInView(true)
      return
    }
    const checkEnd = hasNegativeBottomMargin(rootMargin)
    let intersecting = false
    let frame = 0
    const reachedEnd = () => {
      const box = root ?? document.scrollingElement ?? document.documentElement
      const scrollTop = root ? root.scrollTop : window.scrollY
      if (box.scrollHeight - scrollTop - box.clientHeight > 1) return false
      const viewTop = root ? root.getBoundingClientRect().top : 0
      return node.getBoundingClientRect().bottom > viewTop
    }
    const update = () => {
      frame = 0
      if (intersecting || (checkEnd && reachedEnd())) {
        setInView(true)
        if (once) stop()
      } else if (!once) {
        setInView(false)
      }
    }
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        intersecting = !!entry?.isIntersecting
        update()
      },
      { rootMargin, threshold, root },
    )
    observer.observe(node)
    if (checkEnd) {
      window.addEventListener('scroll', schedule, { capture: true, passive: true })
      window.addEventListener('resize', schedule)
      schedule()
    }
    function stop() {
      observer.disconnect()
      if (frame) cancelAnimationFrame(frame)
      frame = 0
      window.removeEventListener('scroll', schedule, { capture: true })
      window.removeEventListener('resize', schedule)
    }
    return stop
  }, [node, rootMargin, once, root, JSON.stringify(threshold)]) // eslint-disable-line react-hooks/exhaustive-deps

  return [ref, inView]
}

/**
 * Anima um número de 0 (ou `from`) até `target` com desaceleração cúbica.
 * Com movimento reduzido (ou `enabled=false`), retorna o valor final direto.
 */
export function useCountUp(target: number, options: { duration?: number; from?: number; enabled?: boolean } = {}) {
  const { duration = 900, from = 0, enabled = true } = options
  const reduced = useReducedMotion()
  const [value, setValue] = useState(enabled && !reduced ? from : target)

  useEffect(() => {
    if (!enabled || reduced || !canUseDOM) {
      setValue(target)
      return
    }
    let raf = 0
    const start = performance.now()
    const tick = (now: number) => {
      // O timestamp do rAF pode ser anterior a `start`: limita o progresso a [0, 1].
      const p = Math.min(1, Math.max(0, (now - start) / duration))
      setValue(from + (target - from) * (1 - Math.pow(1 - p, 3)))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [target, duration, from, enabled, reduced])

  return value
}

/**
 * Direção da rolagem da página (`up` | `down`) e se já passou de `threshold`.
 * Útil para cabeçalhos que se escondem ao rolar para baixo.
 */
export function useScrollDirection(options: { threshold?: number; tolerance?: number } = {}) {
  const { threshold = 120, tolerance = 6 } = options
  const [state, setState] = useState<{ direction: 'up' | 'down'; pastThreshold: boolean }>({
    direction: 'up',
    pastThreshold: false,
  })
  useEffect(() => {
    if (!canUseDOM) return
    let last = window.scrollY
    let ticking = false
    const update = () => {
      ticking = false
      const y = window.scrollY
      const delta = y - last
      if (Math.abs(delta) < tolerance) return
      setState({ direction: delta > 0 ? 'down' : 'up', pastThreshold: y > threshold })
      last = y
    }
    const onScroll = () => {
      if (!ticking) {
        ticking = true
        requestAnimationFrame(update)
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [threshold, tolerance])
  return state
}
