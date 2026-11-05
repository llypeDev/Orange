import { Stat, StatGroup } from '@orangesys/ui'

export default function InvertedTone() {
  return (
    <div style={{ width: '100%' }}>
      {/* Para estas métricas, cair é bom e subir é ruim. */}
      <StatGroup columns={3}>
        <Stat label="Cancelamentos (churn)" value="2,4%" delta="0,6 p.p." trend="decrease" deltaTone="positive" />
        <Stat label="Tempo de primeira resposta" value="1h 12min" delta="18%" trend="decrease" deltaTone="positive" />
        <Stat label="Custo por aquisição" value="R$ 86" delta="9%" trend="increase" deltaTone="negative" />
      </StatGroup>
    </div>
  )
}
