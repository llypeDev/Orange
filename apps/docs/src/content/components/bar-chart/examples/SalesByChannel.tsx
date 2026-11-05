import { BarChart } from '@orange/ui'

const canais = [
  { key: 'site', label: 'Site' },
  { key: 'app', label: 'App' },
  { key: 'lojas', label: 'Lojas físicas' },
]

const vendas = [
  { label: 'jan', values: { site: 48200, app: 31500, lojas: 22800 } },
  { label: 'fev', values: { site: 45100, app: 33900, lojas: 21400 } },
  { label: 'mar', values: { site: 52700, app: 38200, lojas: 23900 } },
  { label: 'abr', values: { site: 50300, app: 41800, lojas: 22100 } },
  { label: 'mai', values: { site: 55900, app: 44600, lojas: 24700 } },
  { label: 'jun', values: { site: 61200, app: 49300, lojas: 26300 } },
]

export default function SalesByChannel() {
  return (
    <div style={{ width: '100%' }}>
      <BarChart
        title="Vendas por canal"
        description="R$ por mês · 1º semestre de 2026"
        summary="O site lidera todos os meses; o app cresce mais rápido, de R$ 31,5 mil para R$ 49,3 mil."
        source="Fonte: ERP de vendas (dados fictícios)."
        categoryLabel="Mês"
        valueFormat={{ style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }}
        series={canais}
        data={vendas}
      />
    </div>
  )
}
