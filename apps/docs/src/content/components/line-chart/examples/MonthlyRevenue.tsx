import { LineChart } from '@orangesys/ui'

const meses = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez']
const receita = [
  184000, 176500, 195300, 201800, 188900, 214600, 221300, 219800, 232400, 241100, 255900, 268700,
]

export default function MonthlyRevenue() {
  return (
    <div style={{ width: '100%' }}>
      <LineChart
        title="Receita mensal"
        description="R$ · 2026"
        area
        categoryLabel="Mês"
        valueFormat={{ style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }}
        series={[{ key: 'receita', label: 'Receita' }]}
        data={meses.map((label, i) => ({ label, values: { receita: receita[i] } }))}
      />
    </div>
  )
}
