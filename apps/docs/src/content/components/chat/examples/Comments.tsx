import { Avatar, ChatComposer, ChatMessage, ChatThread } from '@orangesys/ui'
import { useState } from 'react'

interface Comment {
  id: number
  author: string
  mine: boolean
  text: string
  timestamp: Date
}

const hoursAgo = (hours: number) => new Date(Date.now() - hours * 3_600_000)

export default function Comments() {
  const [comments, setComments] = useState<Comment[]>(() => [
    {
      id: 1,
      author: 'Bruno Lima',
      mine: false,
      text: 'Subi a versão 3 do contrato com as cláusulas de reajuste revisadas.',
      timestamp: hoursAgo(26),
    },
    {
      id: 2,
      author: 'Marina Costa',
      mine: true,
      text: 'Li e está ok. Só falta o jurídico aprovar a multa por rescisão.',
      timestamp: hoursAgo(3),
    },
  ])

  return (
    <section
      style={{ display: 'grid', gap: 12, width: '100%', maxWidth: 640 }}
      aria-labelledby="comentarios-titulo"
    >
      <h3 id="comentarios-titulo" style={{ margin: 0 }}>
        Comentários — Revisar contrato do fornecedor
      </h3>
      {/* Colegas usam from="other" (à esquerda); os seus comentários, from="user" (à direita). */}
      <ChatThread aria-labelledby="comentarios-titulo" style={{ maxHeight: 360 }}>
        {comments.map((comment) => (
          <ChatMessage
            key={comment.id}
            from={comment.mine ? 'user' : 'other'}
            author={comment.author}
            avatar={<Avatar name={comment.author} size="sm" />}
            timestamp={comment.timestamp}
            timestampFormat="relative"
          >
            {comment.text}
          </ChatMessage>
        ))}
      </ChatThread>
      <ChatComposer
        label="Novo comentário"
        hideLabel={false}
        placeholder="Escreva um comentário…"
        maxLength={1000}
        showCount
        rows={2}
        onSubmit={(text) =>
          setComments((list) => [
            ...list,
            {
              id: list.length + 1,
              author: 'Marina Costa',
              mine: true,
              text,
              timestamp: new Date(),
            },
          ])
        }
      />
    </section>
  )
}
