import { Stat, StatGroup } from '@orange/ui'

export default function Dashboard() {
  return (
    <div style={{ width: '100%' }}>
      <StatGroup>
        <Stat label="Receita" value="R$ 48,2 mil" delta="12%" trend="increase" help="vs. outubro" />
        <Stat label="Pedidos" value="1.284" delta="4,3%" trend="increase" help="vs. outubro" />
        <Stat label="Ticket médio" value="R$ 37,54" delta="2,1%" trend="decrease" help="vs. outubro" />
        <Stat label="Conversão" value="3,8%" delta="0 p.p." trend="neutral" help="estável" />
      </StatGroup>
    </div>
  )
}
