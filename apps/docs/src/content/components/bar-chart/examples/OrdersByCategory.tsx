import { BarChart } from '@orangesys/ui'

export default function OrdersByCategory() {
  return (
    <div style={{ width: '100%' }}>
      <BarChart
        title="Pedidos por categoria"
        description="Março de 2026 · unidades"
        orientation="horizontal"
        categoryLabel="Categoria"
        showValues
        series={[{ key: 'pedidos', label: 'Pedidos' }]}
        data={[
          { label: 'Eletrônicos e informática', values: { pedidos: 1284 } },
          { label: 'Casa e decoração', values: { pedidos: 962 } },
          { label: 'Moda e acessórios', values: { pedidos: 871 } },
          { label: 'Esporte e lazer', values: { pedidos: 455 } },
          { label: 'Livros e papelaria', values: { pedidos: 318 } },
        ]}
      />
    </div>
  )
}
