import { Button, Icon, Timeline, TimelineItem } from '@orange/ui'

export default function WithContent() {
  return (
    <Timeline aria-label="Atividade do chamado" dateFormat={{ day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }}>
      <TimelineItem
        date={new Date(2026, 10, 3, 9, 30)}
        title="Ana Souza respondeu"
        titleAs="h4"
        description="Enviamos o arquivo corrigido. Pode confirmar se o relatório abre normalmente?"
      >
        <div style={{ marginTop: 8 }}>
          <Button variant="outline" size="sm" startIcon={<Icon name="file" />}>
            relatorio-outubro.pdf
          </Button>
        </div>
      </TimelineItem>
      <TimelineItem
        date={new Date(2026, 10, 2, 16, 12)}
        title="Prioridade alterada para alta"
        titleAs="h4"
        tone="warning"
      />
      <TimelineItem
        date={new Date(2026, 10, 2, 15, 48)}
        title="Chamado aberto por Bruno Lima"
        titleAs="h4"
        description="O relatório mensal não abre no aplicativo."
      />
    </Timeline>
  )
}
