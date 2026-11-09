import { Table, type TableColumn } from '@orangesys/ui'

interface Ticket {
  id: string
  subject: string
  requester: string
  team: string
  priority: string
  openedAt: Date
}

const date = new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short' })

const tickets: Ticket[] = [
  { id: 'CH-1042', subject: 'Etiqueta de envio não imprime', requester: 'Lívia Martins', team: 'Logística', priority: 'Alta', openedAt: new Date(2026, 10, 6) },
  { id: 'CH-1041', subject: 'Relatório de vendas sem o mês de outubro', requester: 'Thiago Rocha', team: 'Financeiro', priority: 'Média', openedAt: new Date(2026, 10, 5) },
  { id: 'CH-1039', subject: 'Atualizar endereço do centro de distribuição', requester: 'Camila Duarte', team: 'Logística', priority: 'Baixa', openedAt: new Date(2026, 10, 4) },
  { id: 'CH-1036', subject: 'Cupom não aplica no carrinho', requester: 'Otávio Ferraz', team: 'Loja', priority: 'Alta', openedAt: new Date(2026, 10, 3) },
  { id: 'CH-1033', subject: 'Nota fiscal com descrição errada', requester: 'Beatriz Nunes', team: 'Financeiro', priority: 'Média', openedAt: new Date(2026, 9, 30) },
  { id: 'CH-1030', subject: 'Página de promoções lenta', requester: 'Diego Almeida', team: 'Loja', priority: 'Baixa', openedAt: new Date(2026, 9, 28) },
]

const option = (value: string) => ({ value, label: value })

const columns: TableColumn<Ticket>[] = [
  { key: 'id', header: 'Chamado', rowHeader: true, width: 120 },
  // text: a célula contém o que foi digitado, sem diferenciar acentos nem maiúsculas.
  { key: 'subject', header: 'Assunto', filter: 'text' },
  { key: 'requester', header: 'Solicitante', filter: 'text' },
  // select: valor exato entre as opções; a tabela inclui "Todos".
  { key: 'team', header: 'Equipe', filter: 'select', filterOptions: ['Financeiro', 'Logística', 'Loja'].map(option) },
  { key: 'priority', header: 'Prioridade', filter: 'select', filterOptions: ['Alta', 'Média', 'Baixa'].map(option) },
  { key: 'openedAt', header: 'Aberto em', sortable: true, render: (ticket) => date.format(ticket.openedAt) },
]

export default function ColumnFilters() {
  return <Table caption="Chamados abertos" columns={columns} data={tickets} selectable />
}
