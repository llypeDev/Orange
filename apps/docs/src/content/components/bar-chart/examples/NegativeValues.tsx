import { BarChart } from '@orangesys/ui'

export default function NegativeValues() {
  return (
    <div style={{ width: '100%' }}>
      <BarChart
        title="Resultado por loja"
        description="Lucro operacional em R$ · fevereiro e março de 2026"
        categoryLabel="Loja"
        height={240}
        valueFormat={{ style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }}
        series={[
          { key: 'fev', label: 'Fevereiro' },
          { key: 'mar', label: 'Março' },
        ]}
        data={[
          { label: 'Centro', values: { fev: 18400, mar: 21900 } },
          { label: 'Shopping', values: { fev: -3200, mar: 4100 } },
          { label: 'Aeroporto', values: { fev: 9800, mar: -1500 } },
          { label: 'Online', values: { fev: 26100, mar: 29400 } },
        ]}
      />
    </div>
  )
}
