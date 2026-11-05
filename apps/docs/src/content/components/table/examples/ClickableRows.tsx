import { Chip, ChipGroup, Table, Tag, type TableColumn } from '@orangesys/ui'
import { useState } from 'react'

type Priority = 'Alta' | 'Média' | 'Baixa'

interface Ticket {
  id: string
  subject: string
  customer: string
  priority: Priority
  status: 'aberto' | 'aguardando' | 'resolvido'
}

const tickets: Ticket[] = [
  { id: '#4821', subject: 'Erro ao emitir boleto', customer: 'Padaria Aurora', priority: 'Alta', status: 'aberto' },
  { id: '#4822', subject: 'Alterar e-mail de cobrança', customer: 'Atelier Norte', priority: 'Baixa', status: 'aguardando' },
  { id: '#4825', subject: 'Integração com o ERP parou', customer: 'Mercado São Jorge', priority: 'Alta', status: 'aberto' },
  { id: '#4830', subject: 'Dúvida sobre o plano anual', customer: 'Clínica Bem Viver', priority: 'Média', status: 'aberto' },
]

const tone = { Alta: 'danger', Média: 'warning', Baixa: 'neutral' } as const

const columns: TableColumn<Ticket>[] = [
  { key: 'subject', header: 'Assunto', rowHeader: true },
  { key: 'id', header: 'Chamado', width: 110 },
  { key: 'customer', header: 'Cliente' },
  { key: 'priority', header: 'Prioridade', render: (t) => <Tag tone={tone[t.priority]}>{t.priority}</Tag> },
]

export default function ClickableRows() {
  const [status, setStatus] = useState<string | null>('aberto')
  const [opened, setOpened] = useState<Ticket | null>(null)
  const visible = tickets.filter((t) => !status || t.status === status)

  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <ChipGroup type="single" label="Status" value={status} onChange={setStatus}>
        <Chip value="aberto">Abertos</Chip>
        <Chip value="aguardando">Aguardando cliente</Chip>
        <Chip value="resolvido">Resolvidos</Chip>
      </ChipGroup>
      <Table
        caption="Chamados de suporte"
        hideCaption
        columns={columns}
        data={visible}
        onRowClick={setOpened}
        emptyState="Nenhum chamado com este status."
      />
      <p role="status" style={{ margin: 0 }}>
        {opened ? `Chamado ${opened.id} aberto: ${opened.subject}` : 'Clique em uma linha para abrir o chamado.'}
      </p>
    </div>
  )
}
