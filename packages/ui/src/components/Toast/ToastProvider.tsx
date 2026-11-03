import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from 'react'
import { useReducedMotion } from '../../hooks'
import { useLocale } from '../../providers'
import { cx, getFocusableElements } from '../../utils'
import { Button } from '../Button'
import { Portal } from '../Portal'
import { Toast, type ToastTone } from './Toast'

export type ToastPosition =
  'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right'

export interface ToastAction {
  /** Rótulo do botão (ex.: "Desfazer"). */
  label: string
  /** Chamado no clique. O toast é fechado em seguida. */
  onClick: () => void
}

export interface ToastOptions {
  /** Id próprio. Chamar `toast()` com um id existente substitui o conteúdo daquele toast. */
  id?: string
  title?: ReactNode
  description?: ReactNode
  /** Padrão: `neutral`. */
  tone?: ToastTone
  /** Substitui o ícone do tom. `false` remove o ícone. */
  icon?: ReactNode | false
  action?: ToastAction
  /**
   * Tempo em ms até fechar sozinho. `Infinity` mantém o toast até ser fechado.
   * Padrão: o `duration` do provider — ou `Infinity` quando há `action`.
   */
  duration?: number
  /** Mostra o botão de fechar. Padrão: `true`. */
  dismissible?: boolean
  /** Chamado quando o toast é fechado (pelo usuário, pelo tempo ou por `dismiss`). */
  onDismiss?: () => void
}

export interface UseToastReturn {
  /** Mostra um toast e retorna o seu id. */
  toast: (options: ToastOptions) => string
  /** Fecha o toast com o id informado. */
  dismiss: (id: string) => void
  /** Fecha todos os toasts. */
  dismissAll: () => void
}

export interface ToastProviderProps {
  children?: ReactNode
  /** Canto da tela onde a pilha aparece. */
  position?: ToastPosition
  /** Máximo de toasts visíveis ao mesmo tempo; os demais aguardam na fila. */
  limit?: number
  /** Tempo padrão (ms) até um toast fechar sozinho. */
  duration?: number
  /** Tecla que leva o foco para o toast mais recente. `false` desativa. */
  hotkey?: string | false
  /** Elemento onde a região é renderizada. Padrão: `document.body`. */
  container?: Element | null
}

interface ToastRecord extends ToastOptions {
  id: string
  state: 'open' | 'closed'
  version: number
}

interface Announcement {
  key: number
  text: string
  assertive: boolean
}

/** Duração da animação de saída (ms) antes de remover o toast do DOM. */
const EXIT_MS = 200
/** Tempo que um anúncio fica na região viva oculta. */
const ANNOUNCE_MS = 7000

let toastCounter = 0
let announceCounter = 0

function createToastStore() {
  let items: ToastRecord[] = []
  const listeners = new Set<() => void>()
  return {
    get: () => items,
    set(next: ToastRecord[]) {
      items = next
      listeners.forEach((listener) => listener())
    },
    subscribe(listener: () => void) {
      listeners.add(listener)
      return () => {
        listeners.delete(listener)
      }
    },
  }
}

const ToastContext = createContext<UseToastReturn | null>(null)

/**
 * Hook para disparar toasts. Precisa estar dentro de um `ToastProvider`.
 * @example const { toast } = useToast(); toast({ title: 'Link copiado' })
 */
export function useToast(): UseToastReturn {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('[Orange] useToast precisa estar dentro de <ToastProvider>.')
  return ctx
}

/**
 * Provedor de toasts: guarda a fila, renderiza a pilha em um `Portal` e
 * anuncia cada mensagem em regiões vivas (educada; `danger` usa `role="alert"`).
 * Coloque-o uma vez, perto da raiz da aplicação.
 */
export function ToastProvider({
  children,
  position = 'bottom-right',
  limit = 3,
  duration = 5000,
  hotkey = 'F8',
  container,
}: ToastProviderProps) {
  const { t } = useLocale()
  const reducedMotion = useReducedMotion()
  const reducedMotionRef = useRef(reducedMotion)
  reducedMotionRef.current = reducedMotion

  const [store] = useState(createToastStore)
  const toasts = useSyncExternalStore(store.subscribe, store.get, store.get)
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [hovered, setHovered] = useState(false)
  const [focusWithin, setFocusWithin] = useState(false)
  const [documentHidden, setDocumentHidden] = useState(false)

  const regionRef = useRef<HTMLElement>(null)
  const lastFocusOutside = useRef<HTMLElement | null>(null)
  const timeouts = useRef(new Set<ReturnType<typeof setTimeout>>())
  const removals = useRef(new Map<string, ReturnType<typeof setTimeout>>())

  const later = useCallback((fn: () => void, ms: number) => {
    const handle = setTimeout(() => {
      timeouts.current.delete(handle)
      fn()
    }, ms)
    timeouts.current.add(handle)
    return handle
  }, [])

  useEffect(() => {
    const pending = timeouts.current
    return () => {
      pending.forEach(clearTimeout)
      pending.clear()
    }
  }, [])

  const dismiss = useCallback(
    (id: string) => {
      const record = store.get().find((item) => item.id === id)
      if (!record || record.state === 'closed') return
      store.set(store.get().map((item) => (item.id === id ? { ...item, state: 'closed' } : item)))
      record.onDismiss?.()
      const handle = later(
        () => {
          removals.current.delete(id)
          store.set(store.get().filter((item) => item.id !== id))
        },
        reducedMotionRef.current ? 0 : EXIT_MS,
      )
      removals.current.set(id, handle)
    },
    [store, later],
  )

  const toast = useCallback(
    (options: ToastOptions) => {
      const id = options.id ?? `or-toast-${++toastCounter}`
      const items = store.get()
      const existing = items.find((item) => item.id === id)
      if (existing) {
        const pending = removals.current.get(id)
        if (pending) {
          clearTimeout(pending)
          timeouts.current.delete(pending)
          removals.current.delete(id)
        }
        store.set(
          items.map((item) =>
            item.id === id
              ? { ...options, id, state: 'open', version: existing.version + 1 }
              : item,
          ),
        )
      } else {
        store.set([...items, { ...options, id, state: 'open', version: 0 }])
      }
      return id
    },
    [store],
  )

  const dismissAll = useCallback(() => {
    store.get().forEach((item) => dismiss(item.id))
  }, [store, dismiss])

  const announce = useCallback(
    (text: string, assertive: boolean) => {
      const key = ++announceCounter
      setAnnouncements((list) => [...list, { key, text, assertive }])
      later(() => setAnnouncements((list) => list.filter((a) => a.key !== key)), ANNOUNCE_MS)
    },
    [later],
  )

  const visible = toasts.slice(0, Math.max(1, limit))
  const hasVisible = visible.length > 0
  const isTop = position.startsWith('top')
  // No topo, o mais recente fica em cima; embaixo, o mais recente fica junto à borda.
  // A ordem do DOM acompanha a ordem visual (WCAG 2.4.3).
  const ordered = isTop ? [...visible].reverse() : visible
  const paused = hovered || focusWithin || documentHidden

  // Sem toasts, a região sai do DOM: zera hover/foco (pointerleave não dispara).
  useEffect(() => {
    if (!hasVisible) {
      setHovered(false)
      setFocusWithin(false)
    }
  }, [hasVisible])

  useEffect(() => {
    const onVisibility = () => setDocumentHidden(document.visibilityState === 'hidden')
    document.addEventListener('visibilitychange', onVisibility)
    return () => document.removeEventListener('visibilitychange', onVisibility)
  }, [])

  // Atalho (F8): leva o foco para o toast mais recente.
  useEffect(() => {
    if (!hotkey) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== hotkey || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey)
        return
      const newest = [...store.get()]
        .slice(0, Math.max(1, limit))
        .reverse()
        .find((item) => item.state === 'open')
      if (!newest || !regionRef.current) return
      const item = Array.from(
        regionRef.current.querySelectorAll<HTMLElement>('[data-toast-id]'),
      ).find((el) => el.dataset.toastId === newest.id)
      const target = getFocusableElements(item ?? null)[0]
      if (!target) return
      event.preventDefault()
      target.focus()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [hotkey, limit, store])

  /** Fecha um toast cuidando do foco: vai para o toast vizinho ou volta para onde estava. */
  const closeWithFocus = useCallback(
    (id: string, item: HTMLElement | null) => {
      const region = regionRef.current
      if (item && region && item.contains(document.activeElement)) {
        const open = Array.from(
          region.querySelectorAll<HTMLElement>('[data-toast-id][data-state="open"]'),
        )
        const index = open.indexOf(item)
        const neighbor = open[index + 1] ?? open[index - 1]
        const target =
          (neighbor && getFocusableElements(neighbor)[0]) ||
          (lastFocusOutside.current?.isConnected ? lastFocusOutside.current : null)
        target?.focus()
      }
      dismiss(id)
    },
    [dismiss],
  )

  const api = useMemo<UseToastReturn>(
    () => ({ toast, dismiss, dismissAll }),
    [toast, dismiss, dismissAll],
  )

  const regionLabel = hotkey ? `${t('notifications')} (${hotkey})` : t('notifications')

  return (
    <ToastContext.Provider value={api}>
      {children}
      <Portal container={container}>
        {hasVisible && (
          <section
            ref={regionRef}
            aria-label={regionLabel}
            className={cx('or-toast-region', `or-toast-region--${position}`)}
            data-paused={paused || undefined}
            onPointerEnter={() => setHovered(true)}
            onPointerLeave={() => setHovered(false)}
            onFocus={(event) => {
              const from = event.relatedTarget as HTMLElement | null
              if (!from || !event.currentTarget.contains(from)) lastFocusOutside.current = from
              setFocusWithin(true)
            }}
            onBlur={(event) => {
              const to = event.relatedTarget as Node | null
              if (!to || !event.currentTarget.contains(to)) setFocusWithin(false)
            }}
          >
            <ol className="or-toast-region__list">
              {ordered.map((record) => (
                <ToastItem
                  key={record.id}
                  record={record}
                  paused={paused}
                  defaultDuration={duration}
                  onClose={closeWithFocus}
                  onAnnounce={announce}
                />
              ))}
            </ol>
          </section>
        )}
        <div
          className="or-visually-hidden"
          role="status"
          aria-live="polite"
          aria-atomic="false"
          aria-relevant="additions text"
        >
          {announcements
            .filter((a) => !a.assertive)
            .map((a) => (
              <p key={a.key}>{a.text}</p>
            ))}
        </div>
        <div
          className="or-visually-hidden"
          role="alert"
          aria-atomic="false"
          aria-relevant="additions text"
        >
          {announcements
            .filter((a) => a.assertive)
            .map((a) => (
              <p key={a.key}>{a.text}</p>
            ))}
        </div>
      </Portal>
    </ToastContext.Provider>
  )
}

/**
 * Texto do anúncio: prefixo do tom + título + descrição, com pausa (ponto)
 * entre título e descrição — `textContent` puro colaria as frases.
 */
function getAnnouncementText(message: Element | null | undefined): string {
  if (!message) return ''
  const parts = Array.from(message.children)
    .map((child) => child.textContent?.replace(/\s+/g, ' ').trim() ?? '')
    .filter(Boolean)
  return parts.reduce((text, part) => {
    if (!text) return part
    // depois do prefixo ("Erro:") ou de pontuação final, basta um espaço
    return /[.!?…:]$/.test(text) ? `${text} ${part}` : `${text}. ${part}`
  }, '')
}

interface ToastItemProps {
  record: ToastRecord
  paused: boolean
  defaultDuration: number
  onClose: (id: string, item: HTMLElement | null) => void
  onAnnounce: (text: string, assertive: boolean) => void
}

function ToastItem({ record, paused, defaultDuration, onClose, onAnnounce }: ToastItemProps) {
  const { id, state, version, action, tone = 'neutral', dismissible = true } = record
  const itemRef = useRef<HTMLLIElement>(null)
  const duration = record.duration ?? (action ? Infinity : defaultDuration)

  // Timer com pausa: guarda o tempo restante entre pausas.
  const remaining = useRef(duration)
  const timerVersion = useRef(version)
  useEffect(() => {
    if (timerVersion.current !== version) {
      timerVersion.current = version
      remaining.current = duration
    }
    if (state === 'closed' || paused || !Number.isFinite(duration) || duration <= 0) return
    const startedAt = Date.now()
    const handle = setTimeout(() => onClose(id, itemRef.current), remaining.current)
    return () => {
      clearTimeout(handle)
      remaining.current = Math.max(0, remaining.current - (Date.now() - startedAt))
    }
  }, [id, state, version, paused, duration, onClose])

  // Anuncia o texto quando o toast aparece (e a cada atualização de conteúdo).
  const announcedVersion = useRef(-1)
  useEffect(() => {
    if (announcedVersion.current === version) return
    announcedVersion.current = version
    const text = getAnnouncementText(itemRef.current?.querySelector('[data-toast-message]'))
    if (text) onAnnounce(text, tone === 'danger')
  }, [version, tone, onAnnounce])

  const close = () => onClose(id, itemRef.current)

  // Escape fecha o toast que contém o foco. Listener nativo no item: o
  // stopPropagation impede que diálogos abertos por baixo (que escutam no
  // document) também fechem.
  const escapeRef = useRef<() => void>(() => {})
  escapeRef.current = () => {
    if (state !== 'closed') close()
  }
  useEffect(() => {
    const item = itemRef.current
    if (!item) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      event.preventDefault()
      event.stopPropagation()
      escapeRef.current()
    }
    item.addEventListener('keydown', onKeyDown)
    return () => item.removeEventListener('keydown', onKeyDown)
  }, [])

  return (
    <li
      ref={itemRef}
      className="or-toast-region__item"
      data-toast-id={id}
      data-state={state}
      aria-hidden={state === 'closed' || undefined}
    >
      <Toast
        tone={tone}
        title={record.title}
        description={record.description}
        icon={record.icon}
        action={
          action && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                action.onClick()
                close()
              }}
            >
              {action.label}
            </Button>
          )
        }
        onClose={dismissible ? close : undefined}
      />
    </li>
  )
}
