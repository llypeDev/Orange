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
