import { Table, Tag, type TableColumn } from '@orange/ui'

interface Invoice {
  id: string
  number: string
  customer: string
  due: string
  amount: number
  status: 'paid' | 'pending' | 'overdue'
}

const brl = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })

const status = {
  paid: <Tag tone="success">Paga</Tag>,
  pending: <Tag tone="warning">Pendente</Tag>,
  overdue: <Tag tone="danger">Vencida</Tag>,
}

const invoices: Invoice[] = [
  { id: '1', number: 'NF-2318', customer: 'Padaria Aurora', due: '05/11/2026', amount: 1240, status: 'paid' },
  { id: '2', number: 'NF-2319', customer: 'Clínica Bem Viver', due: '10/11/2026', amount: 3890.5, status: 'pending' },
  { id: '3', number: 'NF-2320', customer: 'Atelier Norte', due: '28/10/2026', amount: 760, status: 'overdue' },
  { id: '4', number: 'NF-2321', customer: 'Mercado São Jorge', due: '15/11/2026', amount: 12480.9, status: 'pending' },
]

const columns: TableColumn<Invoice>[] = [
  { key: 'number', header: 'Fatura', rowHeader: true },
  { key: 'customer', header: 'Cliente' },
  { key: 'due', header: 'Vencimento' },
  { key: 'status', header: 'Status', render: (invoice) => status[invoice.status] },
  { key: 'amount', header: 'Valor', align: 'end', render: (invoice) => brl.format(invoice.amount) },
]

export default function Basic() {
  return <Table caption="Faturas de novembro" columns={columns} data={invoices} />
}
