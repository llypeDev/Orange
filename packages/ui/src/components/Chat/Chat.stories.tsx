import type { Meta, StoryObj } from '@storybook/react-vite'
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import { Icon } from '../../icons'
import { Avatar } from '../Avatar'
import { Button } from '../Button'
import { CopyButton } from '../CopyButton'
import { IconButton } from '../IconButton'
import { ChatComposer } from './ChatComposer'
import { ChatMessage, type ChatMessageProps } from './ChatMessage'
import { ChatThread } from './ChatThread'

const meta = {
  title: 'Componentes/Chat',
  component: ChatThread,
  subcomponents: { ChatMessage, ChatComposer },
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Conversas com assistentes de IA, atendimento e threads de comentários. `ChatThread` é a lista rolável (`role="log"`): acompanha o fim quando chegam mensagens — só se a pessoa já estava no fim; senão mostra o botão "Novas mensagens" — e anuncia apenas a última mensagem recebida numa região `role="status"` separada. `ChatMessage` é um `<article>` nomeado pelo autor e pelo horário, alinhado pelo remetente (`user`, `assistant`, `other` — outra pessoa, com `author` obrigatório — e `system`), com estado de envio e ações. `ChatComposer` é o campo que cresce com o texto: Enter envia, Shift + Enter quebra a linha; com `loading`, o botão vira "Parar".',
      },
    },
  },
  argTypes: {
    loading: { control: 'boolean' },
    'aria-label': { control: 'text' },
  },
  args: {
    loading: false,
  },
} satisfies Meta<typeof ChatThread>

export default meta
type Story = StoryObj<typeof meta>

const frame: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  maxWidth: 720,
  height: 560,
  border: '1px solid var(--or-color-border)',
  background: 'var(--or-color-bg)',
}

function ChatFrame({ children, height }: { children: ReactNode; height?: number }) {
  return <div style={{ ...frame, height: height ?? frame.height }}>{children}</div>
}

const composerStyle: CSSProperties = { padding: 12, borderTop: '1px solid var(--or-color-border)' }

/** Horários fixos (a regressão visual congela o relógio em 12/11/2026, 12:00 de Brasília). */
const at = (time: string) => `2026-11-12T${time}:00-03:00`

const assistantAvatar = <Avatar size="sm" icon={<Icon name="sparkle" />} />

function AssistantActions({ text }: { text: string }) {
  return (
    <>
      <CopyButton value={text} size="sm" />
      <IconButton icon="refresh" label="Gerar outra resposta" size="sm" />
      <IconButton icon="star" label="Marcar como útil" size="sm" />
    </>
  )
}

const resumo =
  'Outubro fechou com R$ 1,24 milhão em vendas, 12% acima de setembro. O ticket médio subiu para R$ 318 e a conversão ficou em 3,4%.'

/** Conversa fixa com o assistente de vendas — determinística para a regressão visual. */
export const Default: Story = {
  render: (args) => (
    <ChatFrame>
      <ChatThread {...args} style={{ flex: 1 }}>
        <ChatMessage from="system" timestamp={at('11:38')}>
          Relatório de vendas — outubro de 2026 anexado à conversa.
        </ChatMessage>
        <ChatMessage from="user" timestamp={at('11:40')} status="sent">
          Como fechou o relatório de vendas de outubro?
        </ChatMessage>
        <ChatMessage
          from="assistant"
          author="Assistente de vendas"
          avatar={assistantAvatar}
          timestamp={at('11:40')}
          actions={<AssistantActions text={resumo} />}
        >
          {resumo}
        </ChatMessage>
        <ChatMessage from="user" timestamp={at('11:42')}>
          Quais regiões puxaram o crescimento?
        </ChatMessage>
        <ChatMessage
          from="assistant"
          author="Assistente de vendas"
          avatar={assistantAvatar}
          timestamp={at('11:42')}
          actions={<AssistantActions text="Sudeste +18%, Sul +9%, Nordeste +4%." />}
        >
          <p>O crescimento veio principalmente de duas regiões:</p>
          <ul>
            <li>Sudeste: +18%, com destaque para a linha de eletroportáteis.</li>
            <li>Sul: +9%, puxado pela campanha de Dia das Crianças.</li>
          </ul>
          <p>
            Detalhes por estado em
            https://app.exemplo.com.br/relatorios/vendas/2026-10/regioes?agrupamento=estado&comparar=2026-09
          </p>
        </ChatMessage>
      </ChatThread>
      <div style={composerStyle}>
        <ChatComposer
          label="Mensagem para o assistente de vendas"
          placeholder="Pergunte sobre o relatório…"
          actions={<IconButton icon="upload" label="Anexar arquivo" size="sm" />}
        />
      </div>
    </ChatFrame>
  ),
}

/** `loading`: três pontos "Digitando…" no fim e o botão de enviar vira "Parar". */
export const Loading: Story = {
  args: { loading: true },
  render: (args) => (
    <ChatFrame height={360}>
      <ChatThread {...args} style={{ flex: 1 }}>
        <ChatMessage from="user" timestamp={at('11:42')}>
          Monte uma tabela com as 5 lojas que mais venderam.
        </ChatMessage>
      </ChatThread>
      <div style={composerStyle}>
        <ChatComposer label="Mensagem para o assistente" loading={args.loading} onStop={() => {}} />
      </div>
    </ChatFrame>
  ),
}

/** Estados de envio e mensagem de sistema. */
export const MessageStates: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 640 }}>
      <ChatMessage from="system" timestamp={at('09:12')}>
        Conversa transferida para o time de suporte.
      </ChatMessage>
      <ChatMessage from="user" status="sending" timestamp={at('09:13')}>
        A nota fiscal do pedido 4821 ainda não chegou.
      </ChatMessage>
      <ChatMessage from="user" status="error" onRetry={() => {}} timestamp={at('09:14')}>
        Podem reenviar a segunda via do boleto?
      </ChatMessage>
      <ChatMessage
        from="other"
        author="Ana · Suporte"
        avatar={<Avatar name="Ana Ribeiro" size="sm" />}
        timestamp={at('09:15')}
      >
        Claro! A nota fiscal foi reenviada para o e-mail cadastrado na conta.
      </ChatMessage>
    </div>
  ),
}

/** Atendimento com uma pessoa (`from="other"`): autores visíveis dos dois lados e avatares. */
export const Support: Story = {
  render: (args) => (
    <ChatFrame height={440}>
      <ChatThread {...args} aria-label="Atendimento — pedido 4821" style={{ flex: 1 }}>
        <ChatMessage from="system" timestamp={at('14:02')}>
          Ana Ribeiro entrou na conversa.
        </ChatMessage>
        <ChatMessage
          from="other"
          author="Ana · Suporte"
          avatar={<Avatar name="Ana Ribeiro" size="sm" />}
          timestamp={at('14:02')}
        >
          Olá! Vi que o pedido 4821 está com a entrega atrasada. Já abri um chamado com a
          transportadora.
        </ChatMessage>
        <ChatMessage
          from="user"
          author="Você"
          avatar={<Avatar name="Loja Aurora" size="sm" />}
          timestamp={at('14:04')}
        >
          Obrigado. Existe previsão de entrega?
        </ChatMessage>
        <ChatMessage
          from="other"
          author="Ana · Suporte"
          avatar={<Avatar name="Ana Ribeiro" size="sm" />}
          timestamp={at('14:05')}
        >
          A transportadora confirmou a entrega para sexta-feira, até as 18h.
        </ChatMessage>
      </ChatThread>
      <div style={composerStyle}>
        <ChatComposer label="Responder ao suporte" placeholder="Escreva uma mensagem…" />
      </div>
    </ChatFrame>
  ),
}

/** Comentários de uma tarefa (`from="other"` para os colegas): horários relativos, os dos outros à esquerda e os seus à direita. */
export const CommentThread: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 640 }}>
      <h3 id="comentarios" style={{ margin: 0 }}>
        Comentários — Revisar contrato do fornecedor
      </h3>
      <ChatThread aria-labelledby="comentarios" style={{ maxHeight: 360 }}>
        <ChatMessage
          from="other"
          author="Bruno Lima"
          avatar={<Avatar name="Bruno Lima" size="sm" />}
          timestamp={new Date(Date.now() - 3 * 3_600_000)}
          timestampFormat="relative"
        >
          Subi a versão 3 do contrato com as cláusulas de reajuste revisadas.
        </ChatMessage>
        <ChatMessage
          from="user"
          author="Você"
          avatar={<Avatar name="Marina Costa" size="sm" />}
          timestamp={new Date(Date.now() - 40 * 60_000)}
          timestampFormat="relative"
        >
          Li e está ok. Só falta o jurídico aprovar a multa por rescisão.
        </ChatMessage>
      </ChatThread>
      <ChatComposer
        label="Novo comentário"
        hideLabel={false}
        placeholder="Escreva um comentário…"
        maxLength={1000}
        showCount
      />
    </div>
  ),
}

/** `emptyState` aparece enquanto não há mensagens. */
export const Empty: Story = {
  render: (args) => (
    <ChatFrame height={360}>
      <ChatThread
        {...args}
        style={{ flex: 1 }}
        emptyState={
          <div style={{ display: 'grid', gap: 12, justifyItems: 'center', maxWidth: 360 }}>
            <Icon name="sparkle" size="lg" />
            <p style={{ margin: 0 }}>Pergunte sobre vendas, metas ou estoque.</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center' }}>
              <Button variant="outline" size="sm">
                Resumo de outubro
              </Button>
              <Button variant="outline" size="sm">
                Produtos sem estoque
              </Button>
            </div>
          </div>
        }
      />
      <div style={composerStyle}>
        <ChatComposer label="Mensagem para o assistente" placeholder="Pergunte algo…" />
      </div>
    </ChatFrame>
  ),
}

/** Composer sozinho: ações, contador de caracteres e rótulo visível. */
export const Composer: Story = {
  render: () => (
    <div style={{ maxWidth: 560 }}>
      <ChatComposer
        label="Mensagem"
        hideLabel={false}
        placeholder="Escreva uma mensagem…"
        maxLength={500}
        showCount
        actions={
          <>
            <IconButton icon="upload" label="Anexar arquivo" size="sm" />
            <IconButton icon="image" label="Inserir imagem" size="sm" />
          </>
        }
      />
    </div>
  ),
}

/* -------------------------------------------------------------------------- */
/* Demonstração interativa                                                    */
/* -------------------------------------------------------------------------- */

interface DemoMessage {
  id: number
  from: ChatMessageProps['from']
  text: string
  timestamp: Date
}

const answers = [
  'Em outubro o faturamento foi de R$ 1,24 milhão, 12% acima de setembro.',
  'A loja Centro liderou com R$ 212 mil, seguida por Shopping Norte (R$ 187 mil).',
  'O estoque de fones de ouvido cobre só 9 dias de venda. Sugiro antecipar o pedido de reposição.',
  'A meta do trimestre está 78% atingida. Faltam R$ 410 mil para dezembro.',
]

/**
 * Resposta falsa com `setTimeout`: mostra o "Digitando…", o acompanhamento do fim e — se você
 * rolar para cima antes da resposta chegar — o botão "Novas mensagens".
 */
export const Demo: Story = {
  render: function Render() {
    const [messages, setMessages] = useState<DemoMessage[]>(() => [
      {
        id: 1,
        from: 'assistant',
        text: 'Olá! Sou o assistente de vendas. Pergunte sobre o relatório de outubro.',
        timestamp: new Date(),
      },
    ])
    const [loading, setLoading] = useState(false)
    const timer = useRef<ReturnType<typeof setTimeout>>(undefined)
    const nextId = useRef(2)
    useEffect(() => () => clearTimeout(timer.current), [])

    const send = (text: string) => {
      setMessages((list) => [
        ...list,
        { id: nextId.current++, from: 'user', text, timestamp: new Date() },
      ])
      setLoading(true)
      timer.current = setTimeout(() => {
        setLoading(false)
        setMessages((list) => [
          ...list,
          {
            id: nextId.current++,
            from: 'assistant',
            text: answers[list.length % answers.length],
            timestamp: new Date(),
          },
        ])
      }, 2000)
    }
    const stop = () => {
      clearTimeout(timer.current)
      setLoading(false)
      setMessages((list) => [
        ...list,
        {
          id: nextId.current++,
          from: 'system',
          text: 'Resposta interrompida.',
          timestamp: new Date(),
        },
      ])
    }

    return (
      <ChatFrame height={420}>
        <ChatThread loading={loading} style={{ flex: 1 }}>
          {messages.map((m) => (
            <ChatMessage
              key={m.id}
              from={m.from}
              author={m.from === 'assistant' ? 'Assistente de vendas' : undefined}
              avatar={m.from === 'assistant' ? assistantAvatar : undefined}
              timestamp={m.timestamp}
              actions={m.from === 'assistant' ? <CopyButton value={m.text} size="sm" /> : undefined}
            >
              {m.text}
            </ChatMessage>
          ))}
        </ChatThread>
        <div style={composerStyle}>
          <ChatComposer
            label="Mensagem para o assistente de vendas"
            placeholder="Pergunte sobre o relatório…"
            loading={loading}
            onSubmit={send}
            onStop={stop}
          />
        </div>
      </ChatFrame>
    )
  },
}
