import { Table, type TableColumn } from '@orange/ui'

interface Product {
  sku: string
  name: string
  category: string
  stock: number
  price: number
  updatedAt: Date
}

const brl = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })
const date = new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short' })

const products: Product[] = [
  { sku: 'CAF-250', name: 'Café especial 250 g', category: 'Mercearia', stock: 42, price: 38.9, updatedAt: new Date(2026, 9, 30) },
  { sku: 'XIC-01', name: 'Xícara de cerâmica', category: 'Utilidades', stock: 7, price: 54, updatedAt: new Date(2026, 10, 2) },
  { sku: 'FIL-102', name: 'Filtro de papel 102', category: 'Utilidades', stock: 120, price: 9.5, updatedAt: new Date(2026, 9, 21) },
  { sku: 'MOE-MAN', name: 'Moedor manual', category: 'Equipamentos', stock: 0, price: 289, updatedAt: new Date(2026, 10, 1) },
  { sku: 'CHA-80', name: 'Chá de hibisco 80 g', category: 'Mercearia', stock: 18, price: 24.9, updatedAt: new Date(2026, 9, 27) },
]

const columns: TableColumn<Product>[] = [
  { key: 'name', header: 'Produto', rowHeader: true, sortable: true },
  { key: 'category', header: 'Categoria', sortable: true },
  { key: 'stock', header: 'Estoque', align: 'end', sortable: true },
  { key: 'price', header: 'Preço', align: 'end', sortable: true, render: (p) => brl.format(p.price) },
  {
    key: 'updatedAt',
    header: 'Atualizado em',
    sortable: true,
    render: (p) => date.format(p.updatedAt),
  },
]

export default function Sorting() {
  return (
    <Table
      caption="Catálogo da loja"
      columns={columns}
      data={products}
      getRowId={(p) => p.sku}
      defaultSort={{ key: 'stock', direction: 'ascending' }}
    />
  )
}
