import { LineChart } from '@orangesys/ui'

export default function AverageTicket() {
  return (
    <div style={{ width: '100%' }}>
      <LineChart
        title="Ticket médio por canal"
        description="R$ por pedido · 1º semestre de 2026"
        summary="O ticket do site sobe de R$ 152 para R$ 168; o do app cresce todo mês e encosta no site em junho."
        source="Fonte: painel de vendas (dados fictícios)."
        categoryLabel="Mês"
        valueFormat={{ style: 'currency', currency: 'BRL' }}
        series={[
          { key: 'site', label: 'Site' },
          { key: 'app', label: 'App' },
        ]}
        data={[
          { label: 'jan', values: { site: 152.4, app: 131.9 } },
          { label: 'fev', values: { site: 158.1, app: 136.2 } },
          { label: 'mar', values: { site: 149.7, app: 141.0 } },
          { label: 'abr', values: { site: 163.2, app: 146.5 } },
          { label: 'mai', values: { site: 171.0, app: 152.8 } },
          { label: 'jun', values: { site: 168.4, app: 159.3 } },
        ]}
      />
    </div>
  )
}
