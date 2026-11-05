import { BarChart } from '@orangesys/ui'

const pedidos = [312, 348, 401, 377, 452, 518]
const meses = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun']

export default function Highlight() {
  return (
    <div style={{ width: '100%' }}>
      <BarChart
        title="Pedidos por mês"
        description="1º semestre de 2026 · junho em destaque"
        summary="Pedidos crescem de 312 em janeiro para 518 em junho, o maior valor do semestre, com uma queda leve em abril."
        categoryLabel="Mês"
        highlight="jun"
        series={[{ key: 'pedidos', label: 'Pedidos' }]}
        data={meses.map((label, i) => ({ label, values: { pedidos: pedidos[i] } }))}
      />
    </div>
  )
}
