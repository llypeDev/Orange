import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState, type ReactElement } from 'react'
import { Table, type TableColumn, type TableColumnWidths, type TableProps } from './Table'
import { TableColumnsMenu } from './TableColumnsMenu'

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

const statusOptions = [
  { value: 'Pago', label: 'Pago' },
  { value: 'Pendente', label: 'Pendente' },
  { value: 'Cancelado', label: 'Cancelado' },
]

/** Pedidos fictícios em quantidade, gerados de forma determinística (sem Math.random). */
const customers = [
  'Mariana Lopes',
  'Rafael Costa',
  'Beatriz Nunes',
  'Diego Almeida',
  'Lívia Martins',
  'Thiago Rocha',
  'Camila Duarte',
  'Otávio Ferraz',
]
const cities = ['São Paulo', 'Recife', 'Curitiba', 'Belém', 'Goiânia', 'Porto Alegre']
const statuses: Order['status'][] = ['Pago', 'Pago', 'Pendente', 'Pago', 'Cancelado']

interface BigOrder extends Order {
  city: string
  items: number
  channel: string
}

const manyOrders: BigOrder[] = Array.from({ length: 5000 }, (_, index) => ({
  id: String(index + 1),
  number: `#${20000 + index}`,
  customer: customers[index % customers.length],
  date: `2026-${String((index % 12) + 1).padStart(2, '0')}-${String((index % 28) + 1).padStart(2, '0')}`,
  total: 40 + ((index * 37) % 1900) + (index % 100) / 100,
  status: statuses[index % statuses.length],
  city: cities[index % cities.length],
  items: (index % 7) + 1,
  channel: index % 3 === 0 ? 'Loja' : 'Site',
}))

const bigColumns: TableColumn<BigOrder>[] = [
  { key: 'number', header: 'Pedido', rowHeader: true, sortable: true, pinned: 'start', resizable: true, filter: 'text' },
  { key: 'customer', header: 'Cliente', sortable: true, resizable: true, filter: 'text' },
  { key: 'city', header: 'Cidade', sortable: true, resizable: true, filter: 'text' },
  { key: 'channel', header: 'Canal', resizable: true },
  {
    key: 'date',
    header: 'Data',
    sortable: true,
    resizable: true,
    render: (o) => new Date(`${o.date}T12:00:00`).toLocaleDateString('pt-BR'),
  },
  { key: 'items', header: 'Itens', sortable: true, align: 'end', resizable: true },
  { key: 'status', header: 'Status', filter: 'select', filterOptions: statusOptions, resizable: true },
  {
    key: 'total',
    header: 'Total',
    sortable: true,
    align: 'end',
    pinned: 'end',
    hideable: false,
    render: (o) => currency.format(o.total),
  },
]

type BigStory = StoryObj<Meta<TableProps<BigOrder>>>

export const ColumnFilters: Story = {
  parameters: {
    docs: {
      description: {
        story:
          '`filter` na coluna mostra um campo sob o cabeçalho: `text` (contém, sem diferenciar acentos nem maiúsculas) ou `select` (valor exato entre `filterOptions`). A tabela anuncia quantas linhas sobraram e "Selecionar todos" vale só para elas. Sem resultado, o estado vazio oferece "Limpar filtros".',
      },
    },
  },
  args: {
    selectable: true,
    columns: [
      { key: 'number', header: 'Pedido', rowHeader: true, sortable: true, width: 120 },
      { key: 'customer', header: 'Cliente', sortable: true, filter: 'text' },
      { key: 'status', header: 'Status', filter: 'select', filterOptions: statusOptions },
      { key: 'total', header: 'Total', sortable: true, align: 'end', render: (o) => currency.format(o.total) },
    ],
  },
}

export const ColumnsMenu: Story = {
  parameters: {
    docs: {
      description: {
        story:
          '`TableColumnsMenu` lista as colunas como itens marcáveis; a aplicação guarda `hiddenColumns` e passa o mesmo valor ao menu e à tabela. `hideable: false` mantém uma coluna sempre à vista (aqui, o pedido).',
      },
    },
  },
  render: (args) => {
    const [hidden, setHidden] = useState<string[]>(['date'])
    const cols = columns.map((column) => (column.key === 'number' ? { ...column, hideable: false } : column))
    return (
      <div style={{ display: 'grid', gap: 12 }}>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <TableColumnsMenu columns={cols} hiddenColumns={hidden} onHiddenColumnsChange={setHidden} />
        </div>
        <Table {...args} columns={cols} hiddenColumns={hidden} />
      </div>
    )
  },
}

export const Virtualized: BigStory = {
  parameters: {
    docs: {
      description: {
        story:
          '`virtualized` com `maxHeight`: 5.000 pedidos, mas só as linhas à vista (e algumas a mais) existem no DOM. A tabela informa o total de linhas ao leitor de tela (`aria-rowcount`/`aria-rowindex`) e mantém no DOM a linha que está com o foco.',
      },
    },
  },
  args: {
    caption: 'Pedidos do ano (5.000)',
    columns: bigColumns.map(({ pinned: _pinned, resizable: _resizable, filter: _filter, ...column }) => column),
    data: manyOrders,
    maxHeight: 420,
    virtualized: true,
    selectable: true,
    striped: true,
    density: 'compact',
  },
}

export const PinnedColumns: BigStory = {
  parameters: {
    docs: {
      description: {
        story:
          '`pinned: "start"` e `pinned: "end"` prendem colunas às bordas enquanto a tabela rola na horizontal. A seleção acompanha as colunas fixas do início. Aqui as colunas também são `resizable`: as duas funções se combinam.',
      },
    },
  },
  args: {
    caption: 'Pedidos',
    columns: bigColumns.map(({ filter: _filter, ...column }) => ({
      ...column,
      width: column.pinned ? undefined : 200,
    })),
    data: manyOrders.slice(0, 12),
    selectable: true,
    containerProps: { style: { maxWidth: 720 } },
  },
}

export const ResizableColumns: BigStory = {
  parameters: {
    docs: {
      description: {
        story:
          '`resizable` na coluna: arraste a borda direita do cabeçalho ou, com o foco nela, use ← → (Shift para passos de 64px), Home e End. No primeiro redimensionamento a tabela registra a largura de todas as colunas e passa a ter largura fixa.',
      },
    },
  },
  render: (args) => {
    const [widths, setWidths] = useState<TableColumnWidths>({})
    return (
      <div style={{ display: 'grid', gap: 12 }}>
        <Table {...args} columnWidths={widths} onColumnWidthsChange={setWidths} />
        <p style={{ margin: 0 }}>
          Larguras:{' '}
          {Object.keys(widths).length
            ? Object.entries(widths)
                .map(([key, width]) => `${key} ${width}px`)
                .join(' · ')
            : 'automáticas'}
        </p>
      </div>
    )
  },
  args: {
    caption: 'Pedidos',
    columns: bigColumns
      .filter((column) => ['number', 'customer', 'city', 'status', 'total'].includes(column.key))
      .map(({ pinned: _pinned, filter: _filter, ...column }) => ({ ...column, resizable: true })),
    data: manyOrders.slice(0, 8),
  },
}

export const LargeData: BigStory = {
  parameters: {
    docs: {
      description: {
        story:
          'Tudo junto: 5.000 linhas virtualizadas, filtros por coluna, colunas fixas, redimensionáveis e ocultáveis.',
      },
    },
  },
  render: (args) => {
    const [hidden, setHidden] = useState<string[]>([])
    return (
      <div style={{ display: 'grid', gap: 12 }}>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <TableColumnsMenu columns={bigColumns} hiddenColumns={hidden} onHiddenColumnsChange={setHidden} />
        </div>
        <Table {...args} hiddenColumns={hidden} />
      </div>
    )
  },
  args: {
    caption: 'Pedidos do ano (5.000)',
    columns: bigColumns,
    data: manyOrders,
    maxHeight: 480,
    virtualized: true,
    selectable: true,
    density: 'compact',
  },
}
