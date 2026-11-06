import { DonutChart } from '@orangesys/ui'

export default function SalesByChannel() {
  return (
    <div style={{ width: '100%' }}>
      <DonutChart
        title="Vendas por canal"
        description="R$ · março de 2026"
        source="Fonte: ERP de vendas (dados fictícios)."
        categoryLabel="Canal"
        valueFormat={{ style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }}
        data={[
          { label: 'Site', value: 48200 },
          { label: 'App', value: 39800 },
          { label: 'Lojas físicas', value: 24400 },
          { label: 'Marketplace', value: 12200 },
          // A partir da sexta fatia, agrupe em "Outros" com o neutro.
          { label: 'Outros', value: 3800, color: 'var(--or-color-viz-other)' },
        ]}
      />
    </div>
  )
}
