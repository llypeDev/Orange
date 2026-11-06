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
