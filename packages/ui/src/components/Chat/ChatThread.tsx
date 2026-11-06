import {
  Children,
  forwardRef,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type HTMLAttributes,
  type ReactNode,
  type UIEvent,
} from 'react'
import { useIsomorphicLayoutEffect, usePresence, useReducedMotion } from '../../hooks'
import { Icon } from '../../icons'
import { useLocale } from '../../providers'
import { cx, mergeRefs } from '../../utils'
import { Button } from '../Button'
import { VisuallyHidden } from '../VisuallyHidden'
import { ChatThreadContext } from './context'
import './ChatThread.css'

export interface ChatThreadProps extends HTMLAttributes<HTMLDivElement> {
  /** As mensagens (`ChatMessage`), da mais antiga para a mais nova. */
  children?: ReactNode
  /** Mostra o indicador "Digitando…" no fim da conversa (e o anuncia). */
  loading?: boolean
  /** Conteúdo exibido quando não há mensagens (ex.: um `EmptyState` com sugestões). */
  emptyState?: ReactNode
}

/** Distância (px) do fim que ainda conta como "no fim" — a conversa acompanha as mensagens novas. */
const BOTTOM_THRESHOLD = 32
/** Espera (ms) sem mudanças antes de anunciar a última mensagem — agrupa atualizações rápidas. */
const ANNOUNCE_DELAY = 500
/** Tempo (ms) que o anúncio fica na região viva oculta. */
const ANNOUNCE_CLEAR = 7000
const MESSAGE_SELECTOR = '[data-chat-message]'

function distanceFromBottom(el: HTMLElement) {
  return el.scrollHeight - el.scrollTop - el.clientHeight
}

function textOf(el: Element | null) {
  return (el?.textContent ?? '').replace(/\s+/g, ' ').trim()
}

/** Três pontos animados (estáticos com movimento reduzido), nomeados "Digitando…". */
function TypingIndicator({ label }: { label: string }) {
  return (
    <div className="or-chat-thread__typing">
      <span className="or-chat-thread__typing-bubble" role="img" aria-label={label}>
        <span className="or-chat-thread__dot" aria-hidden="true" />
        <span className="or-chat-thread__dot" aria-hidden="true" />
        <span className="or-chat-thread__dot" aria-hidden="true" />
      </span>
    </div>
  )
}

/**
 * Lista rolável de mensagens (`role="log"`). Acompanha o fim quando chegam
 * mensagens novas — só se a pessoa já estava no fim; senão mostra o botão
 * "Novas mensagens". Anuncia apenas a última mensagem recebida, numa região
 * `role="status"` separada. A `ref` e as props nativas vão para o elemento
 * `role="log"`; `className` e `style`, para o contêiner (dê a ele uma altura).
 */
export const ChatThread = forwardRef<HTMLDivElement, ChatThreadProps>(function ChatThread(
  { children, loading = false, emptyState, className, style, onScroll, ...rest },
  ref,
) {
  const { t } = useLocale()
  const reducedMotion = useReducedMotion()
  const viewportRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const listRef = useRef<HTMLDivElement>(null)
  const jumpRef = useRef<HTMLButtonElement>(null)
  const mergedRef = useMemo(() => mergeRefs(ref, viewportRef), [ref])

  /** A pessoa está no fim? Atualizado no scroll; decide se a conversa acompanha o conteúdo novo. */
  const stickRef = useRef(true)
  const lastMessageRef = useRef<Element | null>(null)
  const announcedRef = useRef<Element | null>(null)
  const loadingRef = useRef(loading)
  loadingRef.current = loading
  const tRef = useRef(t)
  tRef.current = t
  const announceTimer = useRef<ReturnType<typeof setTimeout>>(undefined)
  const clearTimer = useRef<ReturnType<typeof setTimeout>>(undefined)

  const [ready, setReady] = useState(false)
  const [scrollable, setScrollable] = useState(false)
  const [showJump, setShowJump] = useState(false)
  const [announcement, setAnnouncement] = useState<{ key: number; text: string } | null>(null)
  const jump = usePresence<HTMLButtonElement>(showJump)
  const jumpButtonRef = useMemo(() => mergeRefs(jump.nodeRef, jumpRef), [jump.nodeRef])

  const lastMessage = useCallback((): Element | null => {
    const list = listRef.current
    if (!list) return null
    const tail = list.lastElementChild
    if (tail?.matches(MESSAGE_SELECTOR)) return tail
    const all = list.querySelectorAll(MESSAGE_SELECTOR)
    return all[all.length - 1] ?? null
  }, [])

  const scrollToBottom = useCallback((behavior: ScrollBehavior = 'auto') => {
    const el = viewportRef.current
    if (!el) return
    if (behavior === 'smooth' && typeof el.scrollTo === 'function') {
      el.scrollTo({ top: el.scrollHeight, behavior })
    } else {
      el.scrollTop = el.scrollHeight
    }
  }, [])

  const announce = useCallback((text: string) => {
    clearTimeout(clearTimer.current)
    setAnnouncement((prev) => ({ key: (prev?.key ?? 0) + 1, text }))
    clearTimer.current = setTimeout(() => setAnnouncement(null), ANNOUNCE_CLEAR)
  }, [])

  /**
   * Anuncia a última mensagem uma única vez, quando ela está completa: fora de
   * `loading`, sem `aria-busy` (status "sending") e sem erro (o erro tem o próprio
   * `role="alert"`). Mensagens do próprio usuário não são anunciadas.
   */
  const checkAnnouncement = useCallback(() => {
    const last = lastMessage()
    if (!last || last === announcedRef.current) return
    if (loadingRef.current || last.getAttribute('aria-busy') === 'true') return
    announcedRef.current = last
    if (last.getAttribute('data-from') === 'user' || last.getAttribute('data-status') === 'error')
      return
    const message = textOf(last.querySelector('[data-chat-content]'))
    if (!message) return
    const author = textOf(last.querySelector('[data-chat-author]'))
    announce(author ? tRef.current('chatAnnouncement', { author, message }) : message)
  }, [announce, lastMessage])

  /** Reage a qualquer mudança de conteúdo ou tamanho: acompanha o fim ou mostra o botão. */
  const sync = useCallback(() => {
    const el = viewportRef.current
    if (!el) return
    const last = lastMessage()
    const isNew = last !== null && last !== lastMessageRef.current
    lastMessageRef.current = last
    // Quem acabou de enviar uma mensagem quer vê-la: volta para o fim.
    if (isNew && last.getAttribute('data-from') === 'user') stickRef.current = true
    if (stickRef.current) {
      if (distanceFromBottom(el) > 1) scrollToBottom()
      setShowJump(false)
    } else if (isNew) {
      setShowJump(true)
    }
    setScrollable(el.scrollHeight > el.clientHeight + 1)
    clearTimeout(announceTimer.current)
    announceTimer.current = setTimeout(checkAnnouncement, ANNOUNCE_DELAY)
  }, [checkAnnouncement, lastMessage, scrollToBottom])

  const syncRef = useRef(sync)
  syncRef.current = sync

  // Depois de cada renderização (mensagens novas, `loading`), antes da pintura: sem salto visível.
  useIsomorphicLayoutEffect(() => {
    sync()
  })

  // Mudanças que não passam por esta renderização: streaming dentro de um filho,
  // imagens carregando, a conversa mudando de altura (ex.: o composer cresceu).
  useEffect(() => {
    const el = viewportRef.current
    const content = contentRef.current
    if (!el || !content) return
    const run = () => syncRef.current()
    const mutation = typeof MutationObserver === 'undefined' ? null : new MutationObserver(run)
    mutation?.observe(content, { childList: true, subtree: true, characterData: true })
    const resize = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(run)
    resize?.observe(el)
    resize?.observe(content)
    return () => {
      mutation?.disconnect()
      resize?.disconnect()
    }
  }, [])

  // O histórico presente na montagem não é anunciado; mensagens a partir daqui entram animadas.
  useEffect(() => {
    announcedRef.current = lastMessage()
    setReady(true)
  }, [lastMessage])

  // "Digitando…" é anunciado quando `loading` liga (não na montagem).
  const previousLoading = useRef(loading)
  useEffect(() => {
    if (previousLoading.current === loading) return
    previousLoading.current = loading
    if (loading) announce(t('chatTyping'))
  }, [loading, announce, t])

  useEffect(
    () => () => {
      clearTimeout(announceTimer.current)
      clearTimeout(clearTimer.current)
    },
    [],
  )

  const handleScroll = (event: UIEvent<HTMLDivElement>) => {
    onScroll?.(event)
    const atBottom = distanceFromBottom(event.currentTarget) <= BOTTOM_THRESHOLD
    stickRef.current = atBottom
    if (atBottom) setShowJump(false)
  }

  const handleJump = () => {
    const el = viewportRef.current
    const hadFocus = jumpRef.current !== null && jumpRef.current === document.activeElement
    stickRef.current = true
    setShowJump(false)
    scrollToBottom(reducedMotion ? 'auto' : 'smooth')
    // O botão some: o foco segue para a conversa, de onde o teclado continua rolando.
    if (hadFocus) el?.focus({ preventScroll: true })
  }

  const empty = Children.toArray(children).length === 0
  const context = useMemo(() => ({ ready }), [ready])
  const ariaLabel =
    rest['aria-label'] ?? (rest['aria-labelledby'] ? undefined : t('chatThreadLabel'))

  return (
    <div className={cx('or-chat-thread', className)} style={style}>
      <div
        ref={mergedRef}
        role="log"
        // As mudanças do log não são lidas direto (o streaming seria lido aos pedaços
        // e as ações de cada mensagem entrariam no anúncio): a região de status abaixo
        // anuncia só a última mensagem recebida, completa.
        aria-live="off"
        className="or-chat-thread__viewport"
        onScroll={handleScroll}
        // Conversa que rola entra na ordem de foco: setas e Page Up/Down rolam pelo teclado (WCAG 2.1.1).
        {...(scrollable ? { tabIndex: 0 } : null)}
        {...rest}
        aria-label={ariaLabel}
      >
        <div ref={contentRef} className="or-chat-thread__content">
          {empty ? (
            !loading &&
            emptyState !== undefined &&
            emptyState !== null && <div className="or-chat-thread__empty">{emptyState}</div>
          ) : (
            <div ref={listRef} className="or-chat-thread__messages">
              <ChatThreadContext.Provider value={context}>{children}</ChatThreadContext.Provider>
            </div>
          )}
          {loading && <TypingIndicator label={t('chatTyping')} />}
        </div>
      </div>
      {jump.present && (
        <Button
          ref={jumpButtonRef}
          variant="secondary"
          size="sm"
          className="or-chat-thread__jump or-motion-pop"
          data-state={jump.state}
          endIcon={<Icon name="arrow-down" />}
          onClick={handleJump}
        >
          {t('chatNewMessages')}
        </Button>
      )}
      <VisuallyHidden role="status" aria-live="polite" aria-atomic="true">
        {announcement && <span key={announcement.key}>{announcement.text}</span>}
      </VisuallyHidden>
    </div>
  )
})
