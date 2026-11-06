import {
  Avatar,
  ChatComposer,
  ChatMessage,
  ChatThread,
  CopyButton,
  Icon,
  type ChatMessageProps,
} from '@orangesys/ui'
import { useEffect, useRef, useState } from 'react'

interface Message {
  id: number
  from: ChatMessageProps['from']
  text: string
  timestamp: Date
}

const minutesAgo = (minutes: number) => new Date(Date.now() - minutes * 60_000)

const replies = [
  'A loja Centro liderou com R$ 212 mil, seguida pela Shopping Norte, com R$ 187 mil.',
  'O estoque de fones de ouvido cobre só 9 dias de venda. Sugiro antecipar a reposição.',
  'A meta do trimestre está 78% atingida: faltam R$ 410 mil até dezembro.',
  'As devoluções caíram para 2,1% dos pedidos, o menor índice do ano.',
]

export default function Demo() {
  const [messages, setMessages] = useState<Message[]>(() => [
    {
      id: 1,
      from: 'user',
      text: 'Resuma o relatório de vendas de outubro.',
      timestamp: minutesAgo(6),
    },
    {
      id: 2,
      from: 'assistant',
      text: 'Outubro fechou com R$ 1,24 milhão em vendas, 12% acima de setembro. A conversão ficou em 3,4%.',
      timestamp: minutesAgo(6),
    },
    { id: 3, from: 'user', text: 'E o ticket médio?', timestamp: minutesAgo(5) },
    {
      id: 4,
      from: 'assistant',
      text: 'Subiu de R$ 296 para R$ 318 (+7,4%), puxado pelos eletroportáteis.',
      timestamp: minutesAgo(5),
    },
  ])
  const [loading, setLoading] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined)
  const nextId = useRef(5)
  useEffect(() => () => clearTimeout(timer.current), [])

  const add = (from: Message['from'], text: string) =>
    setMessages((list) => [...list, { id: nextId.current++, from, text, timestamp: new Date() }])

  const send = (text: string) => {
    add('user', text)
    setLoading(true)
    // Resposta falsa em 2,5 s. Role para cima antes disso para ver "Novas mensagens".
    timer.current = setTimeout(() => {
      setLoading(false)
      add('assistant', replies[nextId.current % replies.length])
    }, 2500)
  }

  const stop = () => {
    clearTimeout(timer.current)
    setLoading(false)
    add('system', 'Resposta interrompida.')
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: 420,
        border: '1px solid var(--or-color-border)',
      }}
    >
      <ChatThread
        loading={loading}
        aria-label="Conversa com o assistente de vendas"
        style={{ flex: 1 }}
      >
        {messages.map((message) => (
          <ChatMessage
            key={message.id}
            from={message.from}
            author={message.from === 'assistant' ? 'Assistente de vendas' : undefined}
            avatar={
              message.from === 'assistant' ? (
                <Avatar size="sm" icon={<Icon name="sparkle" />} />
              ) : undefined
            }
            timestamp={message.timestamp}
            actions={
              message.from === 'assistant' ? (
                <CopyButton value={message.text} size="sm" />
              ) : undefined
            }
          >
            {message.text}
          </ChatMessage>
        ))}
      </ChatThread>
      <div style={{ padding: 12, borderTop: '1px solid var(--or-color-border)' }}>
        <ChatComposer
          label="Mensagem para o assistente de vendas"
          placeholder="Pergunte sobre o relatório…"
          loading={loading}
          onSubmit={send}
          onStop={stop}
        />
      </div>
    </div>
  )
}
