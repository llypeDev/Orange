import { Button, Stack, Table, Tag, type TableColumn } from '@orangesys/ui'
import { useState } from 'react'

interface OrderLine {
  sku: string
  product: string
  quantity: number
  price: number
}

interface Order {
  id: string
  number: string
  customer: string
  date: string
  status: 'paid' | 'picking' | 'shipped'
  payment: 'Pix' | 'Boleto' | 'Faturado em 30 dias'
  shipping: string
  lines: OrderLine[]
}

const brl = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })

const status = {
  paid: <Tag tone="info">Pago</Tag>,
  picking: <Tag tone="warning">Em separação</Tag>,
  shipped: <Tag tone="success">Enviado</Tag>,
}

const orders: Order[] = [
  {
    id: '10482',
    number: '#10482',
    customer: 'Padaria Aurora',
    date: '03/11/2026',
    status: 'shipped',
    payment: 'Pix',
    shipping: 'Transportadora, 3 dias úteis',
    lines: [
      { sku: 'EMB-120', product: 'Caixa kraft 30×20 cm', quantity: 200, price: 2.35 },
      { sku: 'EMB-310', product: 'Saco de papel com alça', quantity: 500, price: 0.89 },
      { sku: 'ETQ-004', product: 'Etiqueta adesiva redonda (rolo)', quantity: 4, price: 38.9 },
    ],
  },
  {
    id: '10483',
    number: '#10483',
    customer: 'Atelier Norte',
    date: '04/11/2026',
    status: 'picking',
    payment: 'Boleto',
    shipping: 'Retirada no centro de distribuição',
    lines: [{ sku: 'FIT-018', product: 'Fita de cetim 10 mm (50 m)', quantity: 6, price: 27.5 }],
  },
  {
    id: '10484',
    number: '#10484',
    customer: 'Mercado São Jorge',
    date: '05/11/2026',
    status: 'paid',
    payment: 'Faturado em 30 dias',
    shipping: 'Entrega expressa, 1 dia útil',
    lines: [
      { sku: 'EMB-120', product: 'Caixa kraft 30×20 cm', quantity: 1000, price: 2.1 },
      { sku: 'SAC-050', product: 'Sacola reciclável', quantity: 800, price: 1.45 },
    ],
  },
]

const orderTotal = (order: Order) =>
  order.lines.reduce((sum, line) => sum + line.quantity * line.price, 0)

const columns: TableColumn<Order>[] = [
  { key: 'number', header: 'Pedido', rowHeader: true, width: 110 },
  { key: 'customer', header: 'Cliente', sortable: true },
  { key: 'date', header: 'Data' },
  { key: 'status', header: 'Status', render: (order) => status[order.status] },
  {
    key: 'total',
    header: 'Total',
    align: 'end',
    sortable: true,
    sortValue: orderTotal,
    render: (order) => brl.format(orderTotal(order)),
  },
]

const lineColumns: TableColumn<OrderLine>[] = [
  { key: 'product', header: 'Item', rowHeader: true },
  { key: 'quantity', header: 'Qtd.', align: 'end' },
  {
    key: 'price',
    header: 'Preço unitário',
    align: 'end',
    render: (line) => brl.format(line.price),
  },
  {
    key: 'subtotal',
    header: 'Subtotal',
    align: 'end',
    render: (line) => brl.format(line.quantity * line.price),
  },
]

function OrderDetails({ order }: { order: Order }) {
  return (
    <Stack gap={3}>
      <Table
        caption={`Itens do pedido ${order.number}`}
        hideCaption
        density="compact"
        columns={lineColumns}
        data={order.lines}
        getRowId={(line) => line.sku}
      />
      <p style={{ margin: 0, color: 'var(--or-color-text-muted)' }}>
        Pagamento: {order.payment} · Entrega: {order.shipping}
      </p>
    </Stack>
  )
}

export default function ExpandableRows() {
  const [expanded, setExpanded] = useState<string[]>(['10482'])
  const allExpanded = expanded.length === orders.length

  return (
    <Stack gap={3}>
      <Stack gap={3} direction="horizontal" align="center" wrap>
        <p style={{ margin: 0, marginRight: 'auto' }}>
          {expanded.length === 0
            ? 'Abra um pedido para ver os itens.'
            : `${expanded.length} de ${orders.length} pedidos abertos`}
        </p>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setExpanded(allExpanded ? [] : orders.map((order) => order.id))}
        >
          {allExpanded ? 'Recolher todos' : 'Expandir todos'}
        </Button>
      </Stack>
      <Table
        caption="Pedidos da semana"
        hideCaption
        columns={columns}
        data={orders}
        expandedRows={expanded}
        onExpandedRowsChange={setExpanded}
        renderExpanded={(order) => <OrderDetails order={order} />}
      />
    </Stack>
  )
}
