import { Timeline, TimelineItem } from '@orange/ui'

export default function Alternate() {
  return (
    <Timeline variant="alternate" dateFormat={{ year: 'numeric' }} style={{ width: '100%' }}>
      <TimelineItem date="2019-03-01" title="Fundação" description="Três pessoas e um protótipo de conciliação bancária." />
      <TimelineItem date="2021-06-01" title="Primeiros mil clientes" description="Chegamos a todas as regiões do país." />
      <TimelineItem date="2023-09-01" title="Série A" tone="accent" description="Investimento para expandir o time de produto." />
      <TimelineItem date="2026-01-01" title="12 mil clientes" current description="Lançamento do módulo de despesas." />
    </Timeline>
  )
}
