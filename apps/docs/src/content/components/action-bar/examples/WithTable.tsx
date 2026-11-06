import {
  ActionBar,
  Badge,
  Button,
  ConfirmDialog,
  Dropdown,
  DropdownItem,
  Icon,
  IconButton,
  Table,
  type BadgeTone,
  type TableColumn,
} from '@orangesys/ui'
import { useState } from 'react'

type Status = 'Paga' | 'Em aberto' | 'Vencida'

interface Invoice {
  id: string
  number: string
  customer: string
  due: string
  status: Status
  total: number
}

const initialInvoices: Invoice[] = [
  {
    id: 'fat-1042',
    number: 'FAT-1042',
    customer: 'Padaria Aurora',
    due: '05/11/2026',
    status: 'Paga',
    total: 1280,
  },
  {
    id: 'fat-1043',
    number: 'FAT-1043',
    customer: 'Studio Lume',
    due: '10/11/2026',
    status: 'Em aberto',
    total: 640,
  },
  {
    id: 'fat-1044',
    number: 'FAT-1044',
    customer: 'Café Tropeiro',
    due: '28/10/2026',
    status: 'Vencida',
    total: 2115.5,
  },
  {
    id: 'fat-1045',
    number: 'FAT-1045',
    customer: 'Ateliê Ponto Cruz',
    due: '15/11/2026',
    status: 'Em aberto',
    total: 389.9,
  },
  {
    id: 'fat-1046',
    number: 'FAT-1046',
    customer: 'Livraria Sebo Azul',
    due: '20/11/2026',
    status: 'Em aberto',
    total: 1020,
  },
]

const statusTone: Record<Status, BadgeTone> = {
  Paga: 'success',
  'Em aberto': 'info',
  Vencida: 'danger',
}
const brl = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })

const columns: TableColumn<Invoice>[] = [
  { key: 'number', header: 'Fatura', rowHeader: true },
  { key: 'customer', header: 'Cliente' },
  { key: 'due', header: 'Vencimento' },
  {
    key: 'status',
    header: 'Situação',
    render: (row) => <Badge tone={statusTone[row.status]}>{row.status}</Badge>,
  },
  { key: 'total', header: 'Total', align: 'end', render: (row) => brl.format(row.total) },
]

export default function WithTable() {
  const [invoices, setInvoices] = useState(initialInvoices)
  const [selected, setSelected] = useState<string[]>([])
  const [confirming, setConfirming] = useState(false)
  const count = selected.length

  const markAsPaid = () =>
    setInvoices((current) =>
      current.map((invoice) =>
        selected.includes(invoice.id) ? { ...invoice, status: 'Paga' } : invoice,
      ),
    )

  const remove = () => {
    setInvoices((current) => current.filter((invoice) => !selected.includes(invoice.id)))
    setSelected([])
  }

  return (
    // A barra fica presa a este contêiner (portal={false}); o padding embaixo
    // reserva o espaço dela para não cobrir a última linha (em telas estreitas
    // ela empilha e fica mais alta).
    <div style={{ position: 'relative', width: '100%', paddingBottom: 144 }}>
      <Table
        caption="Faturas de novembro"
        columns={columns}
        data={invoices}
        selectable
        selectedRows={selected}
        onSelectedRowsChange={setSelected}
        getRowLabel={(invoice) => `${invoice.number}, ${invoice.customer}`}
        emptyState={
          <Button variant="outline" size="sm" onClick={() => setInvoices(initialInvoices)}>
            Restaurar faturas
          </Button>
        }
      />

      <ActionBar open={count > 0} count={count} onDismiss={() => setSelected([])} portal={false}>
        <Button startIcon={<Icon name="download" />}>Exportar</Button>
        <Button startIcon={<Icon name="trash" />} onClick={() => setConfirming(true)}>
          Excluir
        </Button>
        {/* Ações menos usadas ficam no menu "Mais ações". */}
        <Dropdown trigger={<IconButton icon="more-horizontal" label="Mais ações" />}>
          <DropdownItem icon="check" onSelect={markAsPaid}>
            Marcar como paga
          </DropdownItem>
          <DropdownItem icon="mail">Reenviar cobrança</DropdownItem>
        </Dropdown>
      </ActionBar>

      <ConfirmDialog
        open={confirming}
        onOpenChange={setConfirming}
        tone="danger"
        title={count === 1 ? 'Excluir 1 fatura?' : `Excluir ${count} faturas?`}
        description="As faturas saem da lista e os clientes deixam de receber lembretes. Esta ação não pode ser desfeita."
        confirmLabel="Excluir"
        onConfirm={remove}
      />
    </div>
  )
}
