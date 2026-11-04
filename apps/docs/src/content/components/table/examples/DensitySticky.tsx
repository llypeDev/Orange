import { Table, type TableColumn } from '@orange/ui'

interface StockRow {
  sku: string
  product: string
  warehouse: string
  quantity: number
}

const products = ['Camiseta básica', 'Moletom canguru', 'Boné aba reta', 'Meia cano alto', 'Jaqueta corta-vento']
const warehouses = ['Guarulhos', 'Extrema', 'Recife']

const rows: StockRow[] = products.flatMap((product, p) =>
  warehouses.map((warehouse, w) => ({
    sku: `SKU-${(p + 1) * 100 + w}`,
    product,
    warehouse,
    quantity: ((p + 3) * (w + 7) * 13) % 480,
  })),
)

const columns: TableColumn<StockRow>[] = [
  { key: 'sku', header: 'SKU', rowHeader: true, width: 120 },
  { key: 'product', header: 'Produto' },
  { key: 'warehouse', header: 'Centro de distribuição' },
  { key: 'quantity', header: 'Quantidade', align: 'end', sortable: true },
]

export default function DensitySticky() {
  return (
    <Table
      caption="Estoque por centro de distribuição"
      hideCaption
      columns={columns}
      data={rows}
      getRowId={(row) => row.sku}
      density="compact"
      striped
      maxHeight={300}
    />
  )
}
