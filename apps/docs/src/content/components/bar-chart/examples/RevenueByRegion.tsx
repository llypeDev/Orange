import { BarChart } from '@orangesys/ui'

export default function RevenueByRegion() {
  return (
    <div style={{ width: '100%' }}>
      <BarChart
        title="Receita por região"
        description="R$ por trimestre · 2026"
        layout="stacked"
        showValues
        categoryLabel="Trimestre"
        valueFormat={{ style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }}
        series={[
          { key: 'sudeste', label: 'Sudeste' },
          { key: 'sul', label: 'Sul' },
          { key: 'nordeste', label: 'Nordeste' },
          // A partir da quinta região, agrupe em "Outras" com o neutro.
          { key: 'outras', label: 'Outras', color: 'var(--or-color-viz-other)' },
        ]}
        data={[
          {
            label: '1º tri',
            values: { sudeste: 412000, sul: 168000, nordeste: 121000, outras: 64000 },
          },
          {
            label: '2º tri',
            values: { sudeste: 438000, sul: 175000, nordeste: 139000, outras: 71000 },
          },
          {
            label: '3º tri',
            values: { sudeste: 451000, sul: 182000, nordeste: 152000, outras: 69000 },
          },
        ]}
      />
    </div>
  )
}
