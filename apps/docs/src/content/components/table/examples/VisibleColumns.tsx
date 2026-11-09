import {
  Button,
  Dropdown,
  DropdownCheckboxItem,
  DropdownItem,
  DropdownLabel,
  DropdownSeparator,
  Icon, Stack,
  Table,
  type TableColumn,
} from '@orangesys/ui'
import { useState } from 'react'

interface Product {
  sku: string
  name: string
  category: string
  supplier: string
  stock: number
  price: number
  updatedAt: string
}

const brl = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })

const products: Product[] = [
  {
    sku: 'EMB-120',
    name: 'Caixa kraft 30×20 cm',
    category: 'Embalagens',
    supplier: 'Papelaria Horizonte',
    stock: 4820,
    price: 2.35,
    updatedAt: '05/11/2026',
  },
  {
    sku: 'SAC-050',
    name: 'Sacola reciclável',
    category: 'Embalagens',
    supplier: 'Verde Vale Têxtil',
    stock: 1260,
    price: 1.45,
    updatedAt: '04/11/2026',
  },
  {
    sku: 'ETQ-004',
    name: 'Etiqueta adesiva redonda (rolo)',
    category: 'Etiquetas',
    supplier: 'Gráfica Ponto Final',
    stock: 96,
    price: 38.9,
    updatedAt: '30/10/2026',
  },
  {
    sku: 'FIT-018',
    name: 'Fita de cetim 10 mm (50 m)',
    category: 'Acabamento',
    supplier: 'Armarinho Central',
    stock: 340,
    price: 27.5,
    updatedAt: '28/10/2026',
  },
]

const allColumns: TableColumn<Product>[] = [
  { key: 'name', header: 'Produto', rowHeader: true },
  { key: 'sku', header: 'SKU' },
  { key: 'category', header: 'Categoria' },
  { key: 'supplier', header: 'Fornecedor' },
  { key: 'stock', header: 'Estoque', align: 'end', sortable: true },
  {
    key: 'price',
    header: 'Preço',
    align: 'end',
    sortable: true,
    render: (p) => brl.format(p.price),
  },
  { key: 'updatedAt', header: 'Atualizado em' },
]

/** A coluna que identifica a linha (rowHeader) não pode ser escondida. */
const REQUIRED = 'name'
const DEFAULT_VISIBLE = ['name', 'sku', 'stock', 'price']

export default function VisibleColumns() {
  const [visible, setVisible] = useState<string[]>(DEFAULT_VISIBLE)
  // Filtra mantendo a ordem original: uma coluna reexibida volta para o mesmo lugar.
  const columns = allColumns.filter((column) => visible.includes(column.key))

  const toggle = (key: string, checked: boolean) =>
    setVisible((current) => (checked ? [...current, key] : current.filter((k) => k !== key)))

  return (
    <Stack gap={3}>
      <Stack gap={3} direction="horizontal" align="center" wrap>
        <p style={{ margin: 0, marginRight: 'auto' }}>
          {columns.length} de {allColumns.length} colunas visíveis
        </p>
        <Dropdown
          placement="bottom-end"
          trigger={
            <Button variant="outline" size="sm" startIcon={<Icon name="sliders" />}>
              Colunas
            </Button>
          }
        >
          <DropdownLabel>Mostrar colunas</DropdownLabel>
          {allColumns.map((column) => (
            <DropdownCheckboxItem
              key={column.key}
              checked={visible.includes(column.key)}
              disabled={column.key === REQUIRED}
              onCheckedChange={(checked) => toggle(column.key, checked)}
            >
              {column.header}
            </DropdownCheckboxItem>
          ))}
          <DropdownSeparator />
          <DropdownItem icon="refresh" onSelect={() => setVisible(DEFAULT_VISIBLE)}>
            Restaurar padrão
          </DropdownItem>
        </Dropdown>
      </Stack>
      <Table
        caption="Catálogo de produtos"
        hideCaption
        columns={columns}
        data={products}
        getRowId={(product) => product.sku}
      />
    </Stack>
  )
}
