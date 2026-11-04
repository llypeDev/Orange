/*
 * Utilitários internos do grupo Feedback (Alert, Banner, Toast).
 * Não são exportados pelo índice da biblioteca.
 */
import { useState } from 'react'
import { useIsomorphicLayoutEffect, usePresence } from '../../hooks'
import type { IconName } from '../../icons'
import type { MessageKey } from '../../providers'
import { getFocusableElements } from '../../utils'

export type FeedbackTone = 'neutral' | 'info' | 'success' | 'warning' | 'danger'

/** Ícone padrão de cada tom. */
export const feedbackIcons: Record<FeedbackTone, IconName> = {
  neutral: 'info',
  info: 'info',
  success: 'check-circle',
  warning: 'alert-triangle',
  danger: 'alert-circle',
}

/**
 * Prefixo lido por leitores de tela antes do título ("Erro: …"), para que o
 * significado do tom não dependa só da cor ou do ícone (WCAG 1.4.1).
 */
export const feedbackLabelKeys: Record<FeedbackTone, MessageKey | null> = {
  neutral: null,
  info: 'info',
  success: 'success',
  warning: 'warning',
  danger: 'error',
}

/** Papel de região viva adequado ao tom: urgentes usam `alert` (assertivo). */
export function liveRoleFor(tone: FeedbackTone): 'alert' | 'status' {
  return tone === 'danger' || tone === 'warning' ? 'alert' : 'status'
}

/**
 * Antes de remover `element` do DOM, se o foco estiver dentro dele, move o
 * foco para o próximo elemento focável da página (ou o anterior), evitando que
 * o foco "caia" no `<body>`.
 */
export function moveFocusOutOf(element: HTMLElement | null) {
  if (!element || typeof document === 'undefined') return
  if (!element.contains(document.activeElement)) return
  const all = getFocusableElements(document.body).filter((el) => !element.contains(el))
  const next = all.find(
    (el) => element.compareDocumentPosition(el) & Node.DOCUMENT_POSITION_FOLLOWING,
  )
  const previous = [...all]
    .reverse()
    .find((el) => element.compareDocumentPosition(el) & Node.DOCUMENT_POSITION_PRECEDING)
  const target = next ?? previous
  if (target) target.focus()
  else (document.activeElement as HTMLElement | null)?.blur()
}

/**
 * Presença de mensagens dispensáveis (Alert, Banner):
 * - guarda a visibilidade não controlada;
 * - mantém o elemento montado durante a saída animada (`usePresence`), com
 *   `inert` para que nada seja focado ou lido enquanto ele some;
 * - indica quando animar a entrada: mensagens `live` (dinâmicas por
 *   definição) ou reabertas depois de montadas.
 */
export function useFeedbackPresence(open: boolean | undefined, live: boolean) {
  const [internalOpen, setInternalOpen] = useState(true)
  const isOpen = open ?? internalOpen
  const { present, state, nodeRef } = usePresence<HTMLDivElement>(isOpen)

  const [previousOpen, setPreviousOpen] = useState(isOpen)
  const [reopened, setReopened] = useState(false)
  if (previousOpen !== isOpen) {
    setPreviousOpen(isOpen)
    if (isOpen) setReopened(true)
  }

  const closing = state === 'closed'
  useIsomorphicLayoutEffect(() => {
    const node = nodeRef.current
    if (!node) return
    if (closing) node.setAttribute('inert', '')
    else node.removeAttribute('inert')
  }, [closing, present])

  return {
    present,
    state,
    nodeRef,
    enter: live || reopened,
    /** Esconde no modo não controlado (no controlado, quem decide é `open`). */
    hide: () => {
      if (open === undefined) setInternalOpen(false)
    },
  }
}
