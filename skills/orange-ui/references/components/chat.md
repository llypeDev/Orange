# ChatThread

Conversas com assistentes de IA, atendimento e comentários: lista de mensagens que acompanha o fim (ChatThread), mensagens com autor, horário e estado (ChatMessage) e o campo de envio (ChatComposer).

- Categoria: Exibição de dados · Status: novo
- Importação: `import { ChatThread, ChatComposer, ChatMessage } from '@orangesys/ui'`
- Documentação: https://orange.llypedev.com.br/pt/components/chat (em inglês: https://orange.llypedev.com.br/en/components/chat)
- Storybook: https://orange.llypedev.com.br/storybook/?path=/docs/componentes-chat--docs
- Código: https://github.com/llypeDev/Orange/tree/main/packages/ui/src/components/Chat

## Boas práticas

- Três peças, exportadas juntas: `ChatThread` (a lista rolável), `ChatMessage` (cada mensagem) e `ChatComposer` (o campo de envio). Use em assistentes de IA, atendimento e threads de comentários.
- Dê uma altura ao `ChatThread` (`style`, `className` ou `flex: 1` num layout em coluna) — é ele que rola, não a página. Poucas mensagens ficam junto do fim, perto do composer.
- Escolha o remetente certo: `user` para a própria pessoa, `assistant` para a IA, `other` para outras pessoas (atendentes, colegas em comentários e grupos — sempre com `author` visível) e `system` para avisos automáticos. Sem `author`, "Você", "Assistente", "Participante" ou "Sistema" ficam só para leitores de tela. O `avatar` é decorativo.
- Em respostas em streaming, mantenha `status="sending"` (ou `loading` na conversa) até o texto terminar: a resposta é anunciada uma vez, completa.
- Ações por mensagem (copiar, gerar de novo, feedback) ficam sempre visíveis — nada que só aparece no hover.
- Nunca peça nem mostre dados pessoais sensíveis (documentos, cartões, senhas) numa conversa; oriente a pessoa a usar o formulário seguro do produto.

## Anatomia

- **ChatThread** — Área rolável com `role="log"` e nome ("Conversa" por padrão). Focável quando rola.
- **ChatMessage** — Um `<article>` nomeado por autor + horário: balão, estado de envio e ações. O lado e a cor vêm de `from`: `user` à direita; `assistant` e `other` (outras pessoas) à esquerda; `system` centralizado.
- **Digitando…** — Três pontos no fim da conversa com `loading`; `role="img"` nomeado "Digitando…".
- **Novas mensagens** — Botão que aparece quando chega mensagem e você não está no fim; leva ao fim.
- **ChatComposer** — Moldura com o `TextArea` que cresce, ações à esquerda, contador opcional e enviar/parar.

## Exemplos

### Assistente com resposta simulada

Envie uma pergunta: o composer vira "Parar", a conversa mostra "Digitando…" e acompanha o fim. Role para cima antes da resposta (2,5 s) para ver o botão "Novas mensagens".

```tsx
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
```

### Conteúdo rico e ações

Parágrafos, listas, código e URLs longas quebram dentro do balão — nada vaza a página, nem em 320px. Ações abaixo do balão.

```tsx
import { Avatar, ChatMessage, ChatThread, CopyButton, Icon, IconButton } from '@orangesys/ui'

const minutesAgo = (minutes: number) => new Date(Date.now() - minutes * 60_000)

const answer =
  'Sudeste +18% (eletroportáteis) e Sul +9% (campanha de Dia das Crianças). Nordeste ficou estável.'

export default function RichContent() {
  return (
    <ChatThread
      aria-label="Conversa sobre o relatório de vendas"
      style={{ width: '100%', maxHeight: 440 }}
    >
      <ChatMessage from="system" timestamp={minutesAgo(12)}>
        Relatório de vendas — outubro de 2026 anexado à conversa.
      </ChatMessage>
      <ChatMessage from="user" timestamp={minutesAgo(3)}>
        Quais regiões puxaram o crescimento? Me passe o link do detalhamento.
      </ChatMessage>
      <ChatMessage
        from="assistant"
        author="Assistente de vendas"
        avatar={<Avatar size="sm" icon={<Icon name="sparkle" />} />}
        timestamp={minutesAgo(2)}
        actions={
          <>
            <CopyButton value={answer} size="sm" />
            <IconButton icon="refresh" label="Gerar outra resposta" size="sm" />
            <IconButton icon="star" label="Marcar como útil" size="sm" />
          </>
        }
      >
        <p>O crescimento veio principalmente de duas regiões:</p>
        <ul>
          <li>Sudeste: +18%, com destaque para eletroportáteis.</li>
          <li>Sul: +9%, puxado pela campanha de Dia das Crianças.</li>
        </ul>
        <p>
          Detalhamento por estado:
          https://app.exemplo.com.br/relatorios/vendas/2026-10/regioes?agrupamento=estado&comparar=2026-09
        </p>
        <p>
          Filtro usado: <code>periodo=2026-10&amp;canal=todos&amp;status=faturado</code>
        </p>
      </ChatMessage>
    </ChatThread>
  )
}
```

### Atendimento: estados de envio

A atendente é from="other" (uma pessoa, com author visível). status="error" mostra o aviso (role="alert") e "Tentar novamente" com onRetry; "sending" mostra "Enviando…" e marca aria-busy.

```tsx
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
```

### Comentários de uma tarefa

Horários relativos (timestampFormat="relative"), autores visíveis e o log nomeado pelo título com aria-labelledby. Os colegas usam from="other" (à esquerda); os seus comentários, from="user".

```tsx
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
```

### Estado vazio com sugestões

emptyState aparece enquanto não há mensagens (e some com loading).

```tsx
import {
  Button,
  ChatComposer,
  ChatMessage,
  ChatThread,
  EmptyState,
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
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
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
              </div>
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
```

### Composer controlado

value/onChange com rótulo visível, ações e contador (maxLength + showCount). No modo controlado, limpe o value no onSubmit.

```tsx
import { ChatComposer, IconButton } from '@orangesys/ui'
import { useState } from 'react'

export default function Composer() {
  const [text, setText] = useState('')
  const [sent, setSent] = useState<string | null>(null)

  return (
    <div style={{ display: 'grid', gap: 12, width: '100%', maxWidth: 560 }}>
      <ChatComposer
        label="Mensagem para o cliente"
        hideLabel={false}
        placeholder="Escreva uma resposta…"
        value={text}
        onChange={setText}
        onSubmit={(value) => {
          setSent(value)
          setText('') // controlado: quem limpa é você
        }}
        maxLength={500}
        showCount
        actions={
          <>
            <IconButton icon="upload" label="Anexar arquivo" size="sm" />
            <IconButton icon="image" label="Inserir imagem" size="sm" />
          </>
        }
      />
      <p style={{ margin: 0, color: 'var(--or-color-text-muted)', overflowWrap: 'anywhere' }}>
        {sent ? `Enviado: ${sent}` : 'Nenhuma mensagem enviada ainda.'}
      </p>
    </div>
  )
}
```

## Rolagem

- **No fim** — Mensagens novas, o "Digitando…" e o texto que cresce (streaming) mantêm a conversa no fim — antes da pintura, sem salto.
- **Rolado para cima** — A posição não muda. Uma mensagem nova mostra "Novas mensagens ↓"; clicar rola até o fim (suave, ou instantâneo com movimento reduzido) e o foco vai para a conversa.
- **Mensagem sua** — Uma mensagem nova com from="user" sempre leva ao fim: quem acabou de enviar quer vê-la.
- **"No fim"** — Até 32px do fim. Voltar até lá (rolando) esconde o botão.

## Movimento

Durações e curvas vêm dos tokens de motion e zeram com prefers-reduced-motion.

- **Mensagem nova** — Fade + 4px de baixo para cima — medium (250ms), ease-out. O histórico presente na montagem não anima.
- **Digitando…** — Três pontos quadrados sobem 4px e acendem em sequência (loop/2, atraso de 2 × stagger). Movimento reduzido: pontos parados e acesos.
- **Novas mensagens** — Entra com or-motion-pop (medium) e sai mais rápido (fast).

## Props

### `ChatThread`

Lista rolável de mensagens (`role="log"`). Acompanha o fim quando chegam
mensagens novas — só se a pessoa já estava no fim; senão mostra o botão
"Novas mensagens". Anuncia apenas a última mensagem recebida, numa região
`role="status"` separada. A `ref` e as props nativas vão para o elemento
`role="log"`; `className` e `style`, para o contêiner (dê a ele uma altura).

| Prop | Tipo | Padrão | Descrição |
| --- | --- | --- | --- |
| `children` | `ReactNode` | — | As mensagens (`ChatMessage`), da mais antiga para a mais nova. |
| `emptyState` | `ReactNode` | — | Conteúdo exibido quando não há mensagens (ex.: um `EmptyState` com sugestões). |
| `loading` | `boolean` | `false` | Mostra o indicador "Digitando…" no fim da conversa (e o anuncia). |

Repassa também os atributos nativos (`HTMLAttributes`: `className`, `style`, `aria-*`, `data-*`, eventos…) ao elemento raiz.

### `ChatComposer`

Campo de mensagem de uma conversa: `TextArea` que cresce com o texto e botão
de enviar. Enter envia e Shift + Enter quebra a linha (respeitando a
composição de IME). Durante `loading` o botão vira "Parar". A `ref` e as props
nativas vão para o `<textarea>`; `className` e `formProps`, para o `<form>`.

| Prop | Tipo | Padrão | Descrição |
| --- | --- | --- | --- |
| `label` (obrigatória) | `ReactNode` | — | Rótulo do campo (obrigatório — fica oculto por padrão, mas é lido por leitores de tela). |
| `actions` | `ReactNode` | — | Ações à esquerda do botão de enviar (ex.: anexar arquivo). |
| `className` | `string` | — | Classe aplicada ao `<form>`. |
| `defaultValue` | `string` | — | Texto inicial (não controlado). |
| `formProps` | `Omit<FormHTMLAttributes<HTMLFormElement>, "onSubmit">` | — | Atributos extras do `<form>`. |
| `hideLabel` | `boolean` | `true` | Oculta o rótulo visualmente. Padrão: `true`. |
| `loading` | `boolean` | `false` | Resposta em andamento: o botão de enviar vira "Parar" e Enter não envia. |
| `maxRows` | `number` | `6` | O campo cresce com o texto até este número de linhas (depois rola). Padrão: `6`. |
| `onChange` | `((value: string) => void)` | — | Chamado com o novo texto a cada alteração. |
| `onStop` | `(() => void)` | — | Chamado pelo botão "Parar" (durante `loading`). |
| `onSubmit` | `((value: string) => void)` | — | Chamado ao enviar (Enter ou botão), com o texto sem espaços nas pontas. Não é chamado com o campo vazio, `disabled` ou `loading`. No modo não controlado o campo é limpo em seguida; no controlado, limpe o `value`. |
| `rows` | `number` | `1` | Linhas visíveis iniciais. Padrão: `1`. |
| `showCount` | `boolean` | `false` | Mostra o contador "x de y caracteres". Requer `maxLength`. |
| `value` | `string` | — | Texto do campo (controlado). |

Repassa também os atributos nativos (`ButtonHTMLAttributes`: `className`, `style`, `aria-*`, `data-*`, eventos…) ao elemento raiz.

### `ChatMessage`

Uma mensagem de conversa: balão alinhado conforme o remetente, nome, horário,
estado de envio e ações. É um `<article>` nomeado pelo autor e pelo horário —
funciona dentro do `ChatThread` (`role="log"`) ou sozinho, numa lista de comentários.

| Prop | Tipo | Padrão | Descrição |
| --- | --- | --- | --- |
| `from` (obrigatória) | `"other" \| "user" \| "assistant" \| "system"` | — | Quem escreveu: `user` (a própria pessoa — à direita, balão em tom de acento), `assistant` (assistente de IA — à esquerda, neutro), `other` (outra pessoa: atendente, colega num comentário ou grupo — à esquerda, neutro; exige `author`) ou `system` (aviso automático — centralizado, texto pequeno). |
| `actions` | `ReactNode` | — | Ações da mensagem abaixo do balão (ex.: `CopyButton`, `IconButton` de feedback). |
| `author` | `ReactNode` | — | Nome visível de quem escreveu (obrigatório com `from="other"`). Sem ele, um nome padrão ("Você", "Assistente", "Participante", "Sistema") fica só para leitores de tela. |
| `avatar` | `ReactNode` | — | Avatar ao lado do balão (ex.: `<Avatar>`). Decorativo: o nome vem de `author`. |
| `children` | `ReactNode` | — | Conteúdo: texto simples (quebras de linha são mantidas) ou conteúdo rico. |
| `onRetry` | `(() => void)` | — | Com `status="error"`, mostra o botão "Tentar novamente". |
| `status` | `"sending" \| "sent" \| "error"` | — | Estado de envio. `sending` marca a mensagem como ocupada (`aria-busy`) — em mensagens do usuário mostra "Enviando…"; em respostas em streaming, segura o anúncio do `ChatThread` até o texto terminar. `error` mostra o aviso de falha. |
| `timestamp` | `RelativeTimeDate` | — | Momento da mensagem (Date, string ISO ou timestamp em ms). Vira `<time dateTime>`. |
| `timestampFormat` | `"auto" \| "relative" \| "absolute"` | `absolute` | Como mostrar o `timestamp`: `absolute` (padrão — "14:05" hoje, "3 de nov., 14:05" em outros dias), `relative` ("há 5 minutos") ou `auto` (relativo por 7 dias). |

Repassa também os atributos nativos (`HTMLAttributes`: `className`, `style`, `aria-*`, `data-*`, eventos…) ao elemento raiz.

## Acessibilidade

**Estrutura.** A conversa é um `role="log"` nomeado; cada mensagem é um `<article>` com `aria-labelledby` apontando para o autor e o horário ("Assistente de vendas 11:42"). Escolhemos `article` e não `li`: funciona dentro do log e sozinho (comentários num cartão), como no padrão Feed do APG, e leitores de tela navegam de mensagem em mensagem.

**Anúncios.** O log fica com `aria-live="off"`: lido como região viva, ele anunciaria o streaming aos pedaços e o nome das ações de cada mensagem. No lugar, uma região `role="status"` separada e sempre montada anuncia só a última mensagem recebida, uma vez e completa ("Assistente de vendas: …") — fora de `loading`, sem `aria-busy` e após 500ms sem mudanças — vale para `assistant`, `other` e `system`. O histórico da montagem e as mensagens do próprio usuário não são anunciados; "Digitando…" é anunciado quando `loading` liga; erros de envio usam `role="alert"`.

> **Enter envia** Num `<textarea>` comum, Enter quebra a linha. Aqui ele envia — por isso a instrução "Enter envia; Shift + Enter quebra a linha." fica ligada ao campo por `aria-describedby`. Durante uma composição de IME (japonês, chinês, coreano…), Enter confirma o texto e não envia.

| Teclas | Ação |
| --- | --- |
| `Enter` | No composer: envia (não durante loading nem composição de IME). |
| `Shift` + `Enter` | No composer: quebra a linha. |
| `Tab` | Entra na conversa (quando ela rola), passa pelas ações das mensagens, pelo "Novas mensagens" e chega ao composer. |
| `↑` + `↓` | Com o foco na conversa: rola. |
| `Page Up` + `Page Down` | Com o foco na conversa: rola uma tela. |
| `Home` + `End` | Com o foco na conversa: início e fim. |

- **1.3.1** — log, article nomeado por autor e horário, <time dateTime> e rótulo no campo.
- **1.4.1** — Quem escreveu é indicado pelo lado e pelo nome, não só pela cor do balão.
- **1.4.10** — Palavras longas, URLs e código quebram dentro do balão em 320px.
- **2.1.1** — A conversa rolável é focável; enviar, parar e as ações funcionam pelo teclado.
- **2.3.3** — Entradas e pontos animados param com movimento reduzido.
- **3.3.2** — Instrução de Enter/Shift + Enter ligada ao campo.
- **4.1.3** — Nova resposta e "Digitando…" anunciados numa região status; falhas de envio em alert.
