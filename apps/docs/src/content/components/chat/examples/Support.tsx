import { Avatar, ChatMessage, ChatThread, type ChatMessageStatus } from '@orangesys/ui'
import { useState } from 'react'

const minutesAgo = (minutes: number) => new Date(Date.now() - minutes * 60_000)

export default function Support() {
  const [status, setStatus] = useState<ChatMessageStatus>('error')

  const retry = () => {
    setStatus('sending')
    setTimeout(() => setStatus('sent'), 1500)
  }

  return (
    <ChatThread aria-label="Atendimento — pedido 4821" style={{ width: '100%', maxHeight: 440 }}>
      <ChatMessage from="system" timestamp={minutesAgo(9)}>
        Ana Ribeiro, do suporte, entrou na conversa.
      </ChatMessage>
      <ChatMessage
        from="other"
        author="Ana · Suporte"
        avatar={<Avatar name="Ana Ribeiro" size="sm" />}
        timestamp={minutesAgo(8)}
      >
        Olá! O pedido 4821 está com a entrega atrasada. Já abri um chamado com a transportadora.
      </ChatMessage>
      <ChatMessage
        from="user"
        author="Loja Aurora"
        avatar={<Avatar name="Loja Aurora" size="sm" />}
        timestamp={minutesAgo(6)}
      >
        Obrigado. Existe previsão de entrega?
      </ChatMessage>
      <ChatMessage
        from="user"
        author="Loja Aurora"
        avatar={<Avatar name="Loja Aurora" size="sm" />}
        timestamp={minutesAgo(1)}
        status={status}
        onRetry={retry}
      >
        Se possível, peçam para entregar pela doca 2.
      </ChatMessage>
    </ChatThread>
  )
}
