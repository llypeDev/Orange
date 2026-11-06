import { forwardRef, useContext, useState, type HTMLAttributes, type ReactNode } from 'react'
import { useId } from '../../hooks'
import { Icon } from '../../icons'
import { useLocale } from '../../providers'
import type { MessageKey } from '../../providers'
import { cx, devWarning } from '../../utils'
import { Button } from '../Button'
import { RelativeTime, type RelativeTimeDate, type RelativeTimeFormat } from '../RelativeTime'
import { VisuallyHidden } from '../VisuallyHidden'
import { ChatThreadContext } from './context'
import './ChatMessage.css'

export type ChatMessageFrom = 'user' | 'assistant' | 'other' | 'system'
export type ChatMessageStatus = 'sending' | 'sent' | 'error'

export interface ChatMessageProps extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
  /**
   * Quem escreveu: `user` (a própria pessoa — à direita, balão em tom de acento),
   * `assistant` (assistente de IA — à esquerda, neutro), `other` (outra pessoa:
   * atendente, colega num comentário ou grupo — à esquerda, neutro; exige `author`)
   * ou `system` (aviso automático — centralizado, texto pequeno).
   */
  from: ChatMessageFrom
  /**
   * Nome visível de quem escreveu (obrigatório com `from="other"`). Sem ele, um
   * nome padrão ("Você", "Assistente", "Participante", "Sistema") fica só para
   * leitores de tela.
   */
  author?: ReactNode
  /** Avatar ao lado do balão (ex.: `<Avatar>`). Decorativo: o nome vem de `author`. */
  avatar?: ReactNode
  /** Momento da mensagem (Date, string ISO ou timestamp em ms). Vira `<time dateTime>`. */
  timestamp?: RelativeTimeDate
  /**
   * Como mostrar o `timestamp`: `absolute` (padrão — "14:05" hoje, "3 de nov., 14:05"
   * em outros dias), `relative` ("há 5 minutos") ou `auto` (relativo por 7 dias).
   */
  timestampFormat?: RelativeTimeFormat
  /**
   * Estado de envio. `sending` marca a mensagem como ocupada (`aria-busy`) — em
   * mensagens do usuário mostra "Enviando…"; em respostas em streaming, segura o
   * anúncio do `ChatThread` até o texto terminar. `error` mostra o aviso de falha.
   */
  status?: ChatMessageStatus
  /** Com `status="error"`, mostra o botão "Tentar novamente". */
  onRetry?: () => void
  /** Ações da mensagem abaixo do balão (ex.: `CopyButton`, `IconButton` de feedback). */
  actions?: ReactNode
  /** Conteúdo: texto simples (quebras de linha são mantidas) ou conteúdo rico. */
  children?: ReactNode
}

const DEFAULT_AUTHOR: Record<ChatMessageFrom, MessageKey> = {
  user: 'chatAuthorUser',
  assistant: 'chatAuthorAssistant',
  other: 'chatAuthorOther',
  system: 'chatAuthorSystem',
}

/** Hoje: só a hora. Outros dias: dia e mês (e o ano, se for outro). */
function absoluteFormatFor(value: RelativeTimeDate): Intl.DateTimeFormatOptions {
  const date = value instanceof Date ? value : new Date(value)
  const now = new Date()
  if (Number.isNaN(date.getTime())) return { timeStyle: 'short' }
  if (
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate()
  ) {
    return { hour: '2-digit', minute: '2-digit' }
  }
  return {
    day: 'numeric',
    month: 'short',
    ...(date.getFullYear() !== now.getFullYear() ? { year: 'numeric' } : null),
    hour: '2-digit',
    minute: '2-digit',
  }
}

const hasContent = (node: ReactNode) =>
  node !== undefined && node !== null && node !== false && node !== ''

/**
 * Uma mensagem de conversa: balão alinhado conforme o remetente, nome, horário,
 * estado de envio e ações. É um `<article>` nomeado pelo autor e pelo horário —
 * funciona dentro do `ChatThread` (`role="log"`) ou sozinho, numa lista de comentários.
 */
export const ChatMessage = forwardRef<HTMLElement, ChatMessageProps>(function ChatMessage(
  {
    from,
    author,
    avatar,
    timestamp,
    timestampFormat = 'absolute',
    status,
    onRetry,
    actions,
    className,
    children,
    ...rest
  },
  ref,
) {
  const { t } = useLocale()
  const thread = useContext(ChatThreadContext)
  // Só anima quem chegou depois da primeira renderização da conversa.
  const [enter] = useState(() => thread?.ready ?? false)
  const authorId = useId('or-chat-author')
  const timeId = useId('or-chat-time')

  devWarning(
    from === 'other' && !hasContent(author),
    'ChatMessage com `from="other"` precisa de `author`: o nome visível de quem escreveu.',
  )

  const visibleAuthor = hasContent(author) && from !== 'system'
  const hasTime = timestamp !== undefined && timestamp !== null && timestamp !== ''
  const authorNode = visibleAuthor ? (
    <span id={authorId} className="or-chat-message__author" data-chat-author="">
      {author}
    </span>
  ) : (
    <VisuallyHidden id={authorId} data-chat-author="">
      {hasContent(author) ? author : t(DEFAULT_AUTHOR[from])}
    </VisuallyHidden>
  )

  return (
    <article
      ref={ref}
      className={cx(
        'or-chat-message',
        `or-chat-message--${from}`,
        enter && 'or-chat-message--enter',
        className,
      )}
      data-chat-message=""
      data-from={from}
      data-status={status}
      aria-labelledby={hasTime ? `${authorId} ${timeId}` : authorId}
      aria-busy={status === 'sending' || undefined}
      {...rest}
    >
      {avatar && from !== 'system' && (
        <div className="or-chat-message__avatar" aria-hidden="true">
          {avatar}
        </div>
      )}
      <div className="or-chat-message__body">
        {visibleAuthor || hasTime ? (
          <div className="or-chat-message__meta">
            {authorNode}
            {hasTime && (
              <RelativeTime
                id={timeId}
                className="or-chat-message__time"
                date={timestamp}
                format={timestampFormat}
                absoluteFormat={absoluteFormatFor(timestamp)}
              />
            )}
          </div>
        ) : (
          authorNode
        )}
        <div
          className={cx(
            'or-chat-message__bubble',
            typeof children === 'string' && 'or-chat-message__bubble--text',
          )}
          data-chat-content=""
        >
          {children}
        </div>
        {status === 'sending' && from === 'user' && (
          <p className="or-chat-message__status">{t('chatSending')}</p>
        )}
        {status === 'error' && (
          <div className="or-chat-message__error">
            <Icon name="alert-circle" size="sm" />
            <span role="alert">{t('chatError')}</span>
            {onRetry && (
              <Button
                variant="ghost"
                size="sm"
                startIcon={<Icon name="refresh" />}
                onClick={onRetry}
              >
                {t('chatRetry')}
              </Button>
            )}
          </div>
        )}
        {hasContent(actions) && <div className="or-chat-message__actions">{actions}</div>}
      </div>
    </article>
  )
})
