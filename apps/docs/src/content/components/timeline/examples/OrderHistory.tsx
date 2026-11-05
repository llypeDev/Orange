import { Timeline, TimelineItem } from '@orangesys/ui'

export default function OrderHistory() {
  return (
    <Timeline aria-label="Histórico do pedido #4821">
      <TimelineItem date="2026-11-02" title="Pedido realizado" tone="success" description="Pagamento aprovado." />
      <TimelineItem date="2026-11-03" title="Nota fiscal emitida" tone="success" />
      <TimelineItem
        date="2026-11-04"
        title="Saiu para entrega"
        current
        description="O entregador está a caminho do endereço cadastrado."
      />
      <TimelineItem dateLabel="Previsto para 6 de nov." title="Entregue" />
    </Timeline>
  )
}
