import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState, type ReactElement } from 'react'
import { Table, type TableColumn, type TableProps } from './Table'

interface Order {
  id: string
  number: string
  customer: string
  date: string
  total: number
  status: 'Pago' | 'Pendente' | 'Cancelado'
}

const currency = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })

const orders: Order[] = [
  { id: '1', number: '#10482', customer: 'Mariana Lopes', date: '2026-10-28', total: 489.9, status: 'Pago' },
  { id: '2', number: '#10483', customer: 'Rafael Costa', date: '2026-10-29', total: 129, status: 'Pendente' },
  { id: '3', number: '#10484', customer: 'Beatriz Nunes', date: '2026-10-29', total: 1890.5, status: 'Pago' },
  { id: '4', number: '#10485', customer: 'Diego Almeida', date: '2026-10-30', total: 74.3, status: 'Cancelado' },
  { id: '5', number: '#10486', customer: 'Lívia Martins', date: '2026-10-31', total: 642, status: 'Pago' },
  { id: '6', number: '#10487', customer: 'Thiago Rocha', date: '2026-11-01', total: 315.75, status: 'Pendente' },
]

const columns: TableColumn<Order>[] = [
  { key: 'number', header: 'Pedido', rowHeader: true, sortable: true, width: 120 },
  { key: 'customer', header: 'Cliente', sortable: true },
  {
    key: 'date',
    header: 'Data',
    sortable: true,
    render: (o) => new Date(`${o.date}T12:00:00`).toLocaleDateString('pt-BR'),
  },
  { key: 'status', header: 'Status' },
  { key: 'total', header: 'Total', sortable: true, align: 'end', render: (o) => currency.format(o.total) },
]

const meta: Meta<TableProps<Order>> = {
  title: 'Componentes/Table',
  component: Table as (props: TableProps<Order>) => ReactElement | null,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Tabela de dados semântica (`caption`, `th scope`) com ordenação por coluna (`aria-sort`), seleção de linhas, cabeçalho fixo, densidade e estado vazio.',
      },
    },
  },
  argTypes: {
    density: { control: 'inline-radio', options: ['normal', 'compact'] },
    striped: { control: 'boolean' },
    selectable: { control: 'boolean' },
    hideCaption: { control: 'boolean' },
  },
  args: {
    caption: 'Pedidos recentes',
    columns,
    data: orders,
    density: 'normal',
    striped: false,
    selectable: false,
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Sortable: Story = {
  args: { defaultSort: { key: 'total', direction: 'descending' } },
}

export const Selectable: Story = {
  render: (args) => {
    const [selected, setSelected] = useState<string[]>(['2'])
    return (
      <div style={{ display: 'grid', gap: 12 }}>
        <Table {...args} selectable selectedRows={selected} onSelectedRowsChange={setSelected} />
        <p style={{ margin: 0 }}>{selected.length} pedido(s) selecionado(s)</p>
      </div>
    )
  },
}

export const CompactStriped: Story = {
  args: { density: 'compact', striped: true },
}

export const StickyHeader: Story = {
  args: {
    maxHeight: 220,
    data: [...orders, ...orders.map((o) => ({ ...o, id: `${o.id}b`, number: `${o.number}b` }))],
  },
}

export const ClickableRows: Story = {
  args: {
    onRowClick: (order: Order) => alert(`Abrir pedido ${order.number}`),
  },
}

export const Empty: Story = {
  args: {
    data: [],
    emptyState: 'Nenhum pedido no período selecionado.',
  },
}

interface OrderLine {
  sku: string
  product: string
  quantity: number
  price: number
}

/** Itens de cada pedido (o pedido cancelado não tem itens para mostrar). */
const orderLines: Record<string, OrderLine[]> = {
  '1': [
    { sku: 'MOL-001', product: 'Moletom canguru', quantity: 1, price: 249.9 },
    { sku: 'CAM-010', product: 'Camiseta básica', quantity: 2, price: 89.9 },
    { sku: 'MEI-004', product: 'Meia cano alto', quantity: 2, price: 30.1 },
  ],
  '2': [{ sku: 'BON-002', product: 'Boné aba reta', quantity: 1, price: 129 }],
  '3': [
    { sku: 'JAQ-007', product: 'Jaqueta corta-vento', quantity: 2, price: 599.9 },
    { sku: 'MOL-001', product: 'Moletom canguru', quantity: 2, price: 249.9 },
    { sku: 'CAM-012', product: 'Camiseta estampada', quantity: 2, price: 95.45 },
  ],
  '5': [
    { sku: 'JAQ-007', product: 'Jaqueta corta-vento', quantity: 1, price: 552 },
    { sku: 'BON-002', product: 'Boné aba reta', quantity: 1, price: 90 },
  ],
  '6': [{ sku: 'CAM-010', product: 'Camiseta básica', quantity: 3, price: 105.25 }],
}

const lineColumns: TableColumn<OrderLine>[] = [
  { key: 'product', header: 'Produto', rowHeader: true },
  { key: 'quantity', header: 'Qtd.', align: 'end' },
  { key: 'price', header: 'Preço unitário', align: 'end', render: (l) => currency.format(l.price) },
  { key: 'subtotal', header: 'Subtotal', align: 'end', render: (l) => currency.format(l.quantity * l.price) },
]

export const ExpandableRows: Story = {
  parameters: {
    docs: {
      description: {
        story:
          '`renderExpanded` adiciona um botão de expandir (com `aria-expanded`/`aria-controls`) no início de cada linha e mostra o painel logo abaixo, numa célula que ocupa todas as colunas. `isRowExpandable` tira o botão das linhas sem detalhe (aqui, o pedido cancelado). O estado segue o id da linha: ordene a tabela com um pedido aberto.',
      },
    },
  },
  args: {
    defaultExpandedRows: ['1'],
    isRowExpandable: (order: Order) => order.id in orderLines,
    renderExpanded: (order: Order) => (
      <Table
        caption={`Itens do pedido ${order.number}`}
        hideCaption
        density="compact"
        columns={lineColumns}
        data={orderLines[order.id] ?? []}
        getRowId={(line) => line.sku}
      />
    ),
  },
}
