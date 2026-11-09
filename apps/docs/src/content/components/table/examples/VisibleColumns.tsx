import { DropdownItem, DropdownSeparator, Stack, Table, TableColumnsMenu, type TableColumn } from '@orangesys/ui'
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

const columns: TableColumn<Product>[] = [
  // A coluna que identifica a linha não entra no menu: não pode ser ocultada.
  { key: 'name', header: 'Produto', rowHeader: true, hideable: false },
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

const DEFAULT_HIDDEN = ['category', 'supplier', 'updatedAt']

export default function VisibleColumns() {
  // O mesmo estado vai para o menu e para a tabela. Guarde-o (ex.: nas preferências do usuário)
  // se a escolha precisar persistir.
  const [hidden, setHidden] = useState<string[]>(DEFAULT_HIDDEN)

  return (
    <Stack gap={3}>
      <Stack gap={3} direction="horizontal" align="center" wrap>
        <p style={{ margin: 0, marginRight: 'auto' }}>
          {columns.length - hidden.length} de {columns.length} colunas visíveis
        </p>
        <TableColumnsMenu columns={columns} hiddenColumns={hidden} onHiddenColumnsChange={setHidden}>
          <DropdownSeparator />
          <DropdownItem icon="refresh" onSelect={() => setHidden(DEFAULT_HIDDEN)}>
            Restaurar padrão
          </DropdownItem>
        </TableColumnsMenu>
      </Stack>
      <Table
        caption="Catálogo de produtos"
        hideCaption
        columns={columns}
        data={products}
        hiddenColumns={hidden}
        getRowId={(product) => product.sku}
      />
    </Stack>
  )
}
