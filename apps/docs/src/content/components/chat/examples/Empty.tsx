import {
  Button,
  ChatComposer,
  ChatMessage,
  ChatThread,
  EmptyState, Stack,
  type ChatMessageProps,
} from '@orangesys/ui'
import { useState } from 'react'

interface Message {
  from: ChatMessageProps['from']
  text: string
}

const suggestions = ['Resumo de vendas de outubro', 'Produtos com estoque baixo']

export default function Empty() {
  const [messages, setMessages] = useState<Message[]>([])

  const ask = (question: string) =>
    setMessages((list) => [
      ...list,
      { from: 'user', text: question },
      { from: 'assistant', text: `Certo! Vou preparar: "${question}".` },
    ])

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: 380,
        border: '1px solid var(--or-color-border)',
      }}
    >
      <ChatThread
        aria-label="Conversa com o assistente de vendas"
        style={{ flex: 1 }}
        emptyState={
          <EmptyState
            variant="compact"
            icon="sparkle"
            title="Como posso ajudar?"
            description="Pergunte sobre vendas, metas ou estoque."
            action={
              <Stack gap={2} direction="horizontal" wrap>
                {suggestions.map((suggestion) => (
                  <Button
                    key={suggestion}
                    variant="outline"
                    size="sm"
                    onClick={() => ask(suggestion)}
                  >
                    {suggestion}
                  </Button>
                ))}
              </Stack>
            }
          />
        }
      >
        {messages.map((message, index) => (
          <ChatMessage
            key={index}
            from={message.from}
            author={message.from === 'assistant' ? 'Assistente de vendas' : undefined}
          >
            {message.text}
          </ChatMessage>
        ))}
      </ChatThread>
      <div style={{ padding: 12, borderTop: '1px solid var(--or-color-border)' }}>
        <ChatComposer
          label="Mensagem para o assistente de vendas"
          placeholder="Pergunte algo…"
          onSubmit={ask}
        />
      </div>
    </div>
  )
}
