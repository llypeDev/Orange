import { Meter } from '@orange/ui'

const fmt = new Intl.NumberFormat('pt-BR')

export default function Neutral() {
  return (
    <div style={{ display: 'grid', gap: 28, width: '100%', maxWidth: 480 }}>
      {/* sem low/high: tom accent, sem julgamento de faixa */}
      <Meter
        label="Requisições à API este mês"
        value={6400}
        max={10000}
        formatValue={(value, { max }) => `${fmt.format(value)} de ${fmt.format(max)}`}
        description="A cota renova em 3 dias."
      />
      <Meter
        label="Assentos usados"
        value={7}
        max={10}
        size="sm"
        formatValue={(v, { max }) => `${v} de ${max}`}
      />
    </div>
  )
}
