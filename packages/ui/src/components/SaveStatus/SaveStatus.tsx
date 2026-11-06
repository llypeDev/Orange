import {
  forwardRef,
  useEffect,
  useMemo,
  useRef,
  useState,
  type HTMLAttributes,
  type MouseEvent,
  type ReactNode,
} from 'react'
import { useId, useIsomorphicLayoutEffect } from '../../hooks'
import { Icon } from '../../icons'
import { useLocale } from '../../providers'
import { canUseDOM, cx, mergeRefs } from '../../utils'
import { RelativeTime, type RelativeTimeDate } from '../RelativeTime'
import { Spinner } from '../Spinner'
import { VisuallyHidden } from '../VisuallyHidden'
import './SaveStatus.css'

export type SaveStatusState = 'idle' | 'saving' | 'saved' | 'error'
export type SaveStatusSize = 'sm' | 'md'

/** Textos do `SaveStatus`. Cada um substitui o padrão do idioma do provider. */
export interface SaveStatusLabels {
  /** Texto no estado `idle`. Padrão: nenhum (o indicador fica vazio). */
  idle?: string
  /** Padrão: "Salvando…". */
  saving?: string
  /** Estado `saved` sem `savedAt`, e o texto anunciado ao salvar. Padrão: "Salvo". */
  saved?: string
  /** Estado `saved` com `savedAt`; `{time}` vira o tempo relativo. Padrão: "Salvo {time}". */
  savedAt?: string
  /** Padrão: "Erro ao salvar". */
  error?: string
  /** Botão de nova tentativa (com `onRetry`). Padrão: "Tentar de novo". */
  retry?: string
}

export interface SaveStatusProps extends HTMLAttributes<HTMLSpanElement> {
  /** Situação do salvamento automático. */
  status: SaveStatusState
  /** Momento do último salvamento, exibido em tempo relativo ("Salvo há 2 min."). */
  savedAt?: RelativeTimeDate
  /** Mostra o botão "Tentar de novo" no estado `error`. */
  onRetry?: () => void
  /** Substitui os textos padrão. */
  labels?: SaveStatusLabels
  /** `sm` (texto 12px) ou `md` (13px, padrão). */
  size?: SaveStatusSize
}

interface Announcement {
  key: number
  text: string
  assertive: boolean
}

/** Tempo que um anúncio fica na região viva oculta (como no ToastProvider). */
const ANNOUNCE_MS = 7000

function toTime(value: RelativeTimeDate | undefined): number | null {
  if (value === undefined) return null
  const time = (value instanceof Date ? value : new Date(value)).getTime()
  return Number.isNaN(time) ? null : time
}

/** "Salvo {time}" → texto antes + <RelativeTime> + texto depois. */
function withTime(template: string, time: ReactNode): ReactNode {
  const index = template.indexOf('{time}')
  if (index < 0) return template
  return (
    <>
      {template.slice(0, index)}
      {time}
      {template.slice(index + '{time}'.length)}
    </>
  )
}

function seconds(value: string) {
  return Math.max(
    0,
    ...value
      .split(',')
      .map((v) => (v.trim().endsWith('ms') ? parseFloat(v) / 1000 : parseFloat(v) || 0)),
  )
}

/** Camada que está saindo no crossfade: anima e se desmonta (na hora, sem animação). */
function ExitingLayer({
  status,
  children,
  onDone,
}: {
  status: SaveStatusState
  children: ReactNode
  onDone: () => void
}) {
  const nodeRef = useRef<HTMLSpanElement>(null)
  const onDoneRef = useRef(onDone)
  onDoneRef.current = onDone

  useEffect(() => {
    const node = nodeRef.current
    const finish = () => onDoneRef.current()
    const style = node && canUseDOM ? getComputedStyle(node) : null
    const reduced = canUseDOM && !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    const animated =
      !!style &&
      !!style.animationName &&
      style.animationName !== 'none' &&
      seconds(style.animationDuration) > 0.002
    if (!node || reduced || !animated) {
      finish()
      return
    }
    const onEnd = (event: AnimationEvent) => {
      if (event.target === node) finish()
    }
    node.addEventListener('animationend', onEnd)
    const fallback = window.setTimeout(finish, 600)
    return () => {
      node.removeEventListener('animationend', onEnd)
      window.clearTimeout(fallback)
    }
  }, [])

  return (
    <span
      ref={nodeRef}
      className="or-save-status__layer"
      data-state="closed"
      data-status={status}
      aria-hidden="true"
    >
      {children}
    </span>
  )
}

/**
 * Indicador de salvamento automático para editores e formulários: "Salvando…",
 * "Salvo há 2 min." e "Erro ao salvar · Tentar de novo". Sempre ícone + texto;
 * anuncia o resultado (salvo/erro) uma vez por transição.
 */
export const SaveStatus = forwardRef<HTMLSpanElement, SaveStatusProps>(function SaveStatus(
  { status, savedAt, onRetry, labels, size = 'md', className, ...rest },
  ref,
) {
  const { t } = useLocale()
  const errorId = useId('or-save-status-error')
  const savedTime = toTime(savedAt)

  const text = {
    idle: labels?.idle,
    saving: labels?.saving ?? t('saving'),
    saved: labels?.saved ?? t('saveStatusSaved'),
    savedAt: labels?.savedAt ?? t('saveStatusSavedAt'),
    error: labels?.error ?? t('saveStatusError'),
    retry: labels?.retry ?? t('saveStatusRetry'),
  }
  const textRef = useRef(text)
  textRef.current = text

  // --- Anúncios: uma vez por transição, nunca a cada renderização ----------
  // A região viva é separada do texto visível: o "há 2 min." se atualiza
  // sozinho e não pode ser relido. Só o resultado é anunciado — "Salvando…" a
  // cada pausa na digitação seria ruído. Erros usam role="alert" (assertivo).
  const [announcement, setAnnouncement] = useState<Announcement | null>(null)
  const previous = useRef({ status, savedTime })
  const counter = useRef(0)
  useEffect(() => {
    const prev = previous.current
    previous.current = { status, savedTime }
    const statusChanged = prev.status !== status
    // Novo salvamento sem passar por `saving` (só `savedAt` mudou) também conta.
    const savedAgain = status === 'saved' && !statusChanged && savedTime !== prev.savedTime
    if (!statusChanged && !savedAgain) return
    if (status === 'saved') {
      setAnnouncement({ key: ++counter.current, text: textRef.current.saved, assertive: false })
    } else if (status === 'error') {
      setAnnouncement({ key: ++counter.current, text: textRef.current.error, assertive: true })
    } else {
      setAnnouncement(null)
    }
  }, [status, savedTime])

  useEffect(() => {
    if (!announcement) return
    const timer = window.setTimeout(() => setAnnouncement(null), ANNOUNCE_MS)
    return () => window.clearTimeout(timer)
  }, [announcement])

  // --- Motion: crossfade entre estados (nada se move na primeira renderização)
  const [shown, setShown] = useState(status)
  const [changes, setChanges] = useState(0)
  const [exiting, setExiting] = useState<{ key: number; status: SaveStatusState } | null>(null)
  if (shown !== status) {
    const hadContent = shown !== 'idle' || Boolean(text.idle)
    setShown(status)
    setChanges(changes + 1)
    setExiting(hadContent ? { key: changes + 1, status: shown } : null)
  }

  // Foco: "Tentar de novo" some quando o status sai de `error`. Se o foco
  // estava nele (e `onRetry` não o levou a outro lugar), ele estaciona no
  // próprio indicador em vez de cair no <body>.
  const rootRef = useRef<HTMLSpanElement>(null)
  const composedRef = useMemo(() => mergeRefs(ref, rootRef), [ref])
  const refocus = useRef(false)
  const handleRetry = (event: MouseEvent<HTMLButtonElement>) => {
    refocus.current = canUseDOM && document.activeElement === event.currentTarget
    onRetry?.()
  }
  useIsomorphicLayoutEffect(() => {
    if (!refocus.current || status === 'error') return
    refocus.current = false
    const node = rootRef.current
    const active = document.activeElement
    if (!node || (active && active !== document.body && !node.contains(active))) return
    node.setAttribute('tabindex', '-1')
    node.addEventListener('blur', () => node.removeAttribute('tabindex'), { once: true })
    node.focus({ preventScroll: true })
  }, [status])

  const iconSize = size === 'sm' ? 14 : 16

  const renderContent = (state: SaveStatusState, interactive: boolean): ReactNode => {
    if (state === 'idle')
      return text.idle ? <span className="or-save-status__text">{text.idle}</span> : null
    if (state === 'saving') {
      return (
        <>
          <span className="or-save-status__icon" aria-hidden="true">
            <Spinner className="or-save-status__spinner" size="sm" tone="current" decorative />
          </span>
          <span className="or-save-status__text">{text.saving}</span>
        </>
      )
    }
    if (state === 'saved') {
      return (
        <>
          <span className="or-save-status__icon" aria-hidden="true">
            <Icon name="check" size={iconSize} strokeWidth={2.25} />
          </span>
          <span className="or-save-status__text">
            {savedAt !== undefined && savedTime !== null
              ? withTime(
                  text.savedAt,
                  <RelativeTime date={savedAt} format="relative" relativeStyle="short" />,
                )
              : text.saved}
          </span>
        </>
      )
    }
    return (
      <>
        <span className="or-save-status__icon" aria-hidden="true">
          <Icon name="alert-circle" size={iconSize} strokeWidth={2} />
        </span>
        <span className="or-save-status__text" id={interactive ? errorId : undefined}>
          {text.error}
        </span>
        {onRetry && (
          <>
            <span className="or-save-status__separator" aria-hidden="true">
              ·
            </span>
            {interactive ? (
              <button
                type="button"
                className="or-save-status__retry"
                aria-describedby={errorId}
                onClick={handleRetry}
              >
                {text.retry}
              </button>
            ) : (
              <span className="or-save-status__retry">{text.retry}</span>
            )}
          </>
        )}
      </>
    )
  }

  return (
    <span
      ref={composedRef}
      className={cx('or-save-status', `or-save-status--${size}`, className)}
      data-status={status}
      {...rest}
    >
      <span className="or-save-status__stage">
        {exiting && (
          <ExitingLayer
            key={exiting.key}
            status={exiting.status}
            onDone={() => setExiting((current) => (current?.key === exiting.key ? null : current))}
          >
            {renderContent(exiting.status, false)}
          </ExitingLayer>
        )}
        <span
          key={status}
          className="or-save-status__layer"
          data-state={changes > 0 ? 'open' : undefined}
          data-status={status}
        >
          {renderContent(status, true)}
        </span>
      </span>
      <VisuallyHidden role="status" aria-live="polite">
        {announcement && !announcement.assertive && (
          <span key={announcement.key}>{announcement.text}</span>
        )}
      </VisuallyHidden>
      <VisuallyHidden role="alert">
        {announcement?.assertive && <span key={announcement.key}>{announcement.text}</span>}
      </VisuallyHidden>
    </span>
  )
})
