# Table

Tabela de dados semântica com ordenação e filtros por coluna, seleção de linhas, colunas ocultas, fixas e redimensionáveis, cabeçalho fixo e virtualização para milhares de linhas.

- Categoria: Exibição de dados · Status: estável
- Importação: `import { Table, TableColumnsMenu } from '@orangesys/ui'`
- Documentação: https://orange.llypedev.com.br/pt/components/table (em inglês: https://orange.llypedev.com.br/en/components/table)
- Storybook: https://orange.llypedev.com.br/storybook/?path=/docs/componentes-table--docs
- Código: https://github.com/llypeDev/Orange/tree/main/packages/ui/src/components/Table

## Boas práticas

- Use tabelas para **dados tabulares** — linhas comparáveis com os mesmos atributos. Para layout ou listas simples, use grid ou List.
- Sempre informe `caption`: ele dá nome à tabela. Se já houver um título visível, use `hideCaption` em vez de removê-lo.
- Marque a coluna que identifica cada linha com `rowHeader` (nome do cliente, número do pedido). Leitores de tela anunciam esse valor ao navegar pelas células.
- Alinhe números à direita (align="end") com o mesmo formato e casas decimais, para facilitar a comparação.
- Ordenação, seleção e linha clicável são opcionais: ative só o que a tarefa precisa.
- Use linhas expansíveis (`renderExpanded`) para detalhes secundários — itens de um pedido, histórico, observações. O que é preciso para comparar as linhas fica nas colunas, não escondido no painel.
- Ponha `filter` nas colunas pelas quais a pessoa procura — não em todas. Com poucas linhas, ordenar costuma bastar.
- Para milhares de linhas, escolha entre paginar e virtualizar. A paginação (Paginator) dá posição estável, endereço por página e funciona com a busca do navegador; `virtualized` serve quando a pessoa percorre e compara uma lista longa de uma vez.
- Fixe poucas colunas: a que identifica a linha no início e, se houver, a de total ou de ações no fim. Em telas estreitas, as colunas fixas tomam o espaço das que rolam.

## Anatomia

- **Legenda** — O <caption> que nomeia a tabela. Pode ser oculto visualmente.
- **Cabeçalho de coluna** — <th scope="col">. Em colunas ordenáveis, contém um botão e recebe aria-sort.
- **Cabeçalho de linha** — <th scope="row"> na coluna marcada com rowHeader.
- **Seleção** — Checkbox nativo por linha e "selecionar todos" com estado indeterminado.
- **Expansão** — Coluna inicial ("Detalhes", oculta visualmente) com um botão por linha (aria-expanded, aria-controls). O painel é uma linha logo abaixo, com uma única célula que ocupa todas as colunas.
- **Filtros** — Segunda linha do cabeçalho, com um campo de busca ou um select nativo sob cada coluna com filter. As células são <td>: os filtros não entram no nome das colunas.
- **Separador de coluna** — Na borda direita do cabeçalho das colunas resizable: role="separator" focável, com a largura em aria-valuenow. A área de arrasto tem 24px.
- **Estado vazio** — Célula que ocupa todas as colunas quando não há dados. Quando são os filtros que escondem tudo, mostra "Nenhum resultado encontrado" e o botão "Limpar filtros".

## Exemplos

### Básico

Colunas definidas por columns; render personaliza a célula. Valores monetários alinhados à direita.

```tsx
import { Table, Tag, type TableColumn } from '@orangesys/ui'

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
```

### Ordenação

Clique no cabeçalho para alternar entre crescente e decrescente. Números, datas e textos (com acentos) são comparados corretamente; use sortValue para valores derivados.

```tsx
import { Table, type TableColumn } from '@orangesys/ui'

interface Product {
  sku: string
  name: string
  category: string
  stock: number
  price: number
  updatedAt: Date
}

const brl = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })
const date = new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short' })

const products: Product[] = [
  { sku: 'CAF-250', name: 'Café especial 250 g', category: 'Mercearia', stock: 42, price: 38.9, updatedAt: new Date(2026, 9, 30) },
  { sku: 'XIC-01', name: 'Xícara de cerâmica', category: 'Utilidades', stock: 7, price: 54, updatedAt: new Date(2026, 10, 2) },
  { sku: 'FIL-102', name: 'Filtro de papel 102', category: 'Utilidades', stock: 120, price: 9.5, updatedAt: new Date(2026, 9, 21) },
  { sku: 'MOE-MAN', name: 'Moedor manual', category: 'Equipamentos', stock: 0, price: 289, updatedAt: new Date(2026, 10, 1) },
  { sku: 'CHA-80', name: 'Chá de hibisco 80 g', category: 'Mercearia', stock: 18, price: 24.9, updatedAt: new Date(2026, 9, 27) },
]

const columns: TableColumn<Product>[] = [
  { key: 'name', header: 'Produto', rowHeader: true, sortable: true },
  { key: 'category', header: 'Categoria', sortable: true },
  { key: 'stock', header: 'Estoque', align: 'end', sortable: true },
  { key: 'price', header: 'Preço', align: 'end', sortable: true, render: (p) => brl.format(p.price) },
  {
    key: 'updatedAt',
    header: 'Atualizado em',
    sortable: true,
    render: (p) => date.format(p.updatedAt),
  },
]

export default function Sorting() {
  return (
    <Table
      caption="Catálogo da loja"
      columns={columns}
      data={products}
      getRowId={(p) => p.sku}
      defaultSort={{ key: 'stock', direction: 'ascending' }}
    />
  )
}
```

### Seleção em massa

Com selectable, cada linha ganha um checkbox. O cabeçalho seleciona todas e fica indeterminado em seleções parciais.

```tsx
import { Button, Stack, Table, type TableColumn } from '@orangesys/ui'
import { useState } from 'react'

interface Member {
  id: string
  name: string
  email: string
  role: string
  lastSeen: string
}

const members: Member[] = [
  { id: 'u1', name: 'Mariana Lopes', email: 'mariana@orange.dev', role: 'Administradora', lastSeen: 'Hoje, 09:42' },
  { id: 'u2', name: 'Rafael Costa', email: 'rafael@orange.dev', role: 'Editor', lastSeen: 'Ontem, 18:10' },
  { id: 'u3', name: 'Beatriz Nunes', email: 'beatriz@orange.dev', role: 'Leitora', lastSeen: '28/10/2026' },
  { id: 'u4', name: 'Diego Almeida', email: 'diego@orange.dev', role: 'Editor', lastSeen: '12/10/2026' },
]

const columns: TableColumn<Member>[] = [
  { key: 'name', header: 'Nome', rowHeader: true },
  { key: 'email', header: 'E-mail' },
  { key: 'role', header: 'Papel' },
  { key: 'lastSeen', header: 'Último acesso' },
]

export default function Selection() {
  const [selected, setSelected] = useState<string[]>(['u4'])

  return (
    <Stack gap={3}>
      <Stack gap={3} direction="horizontal" align="center" wrap>
        <p aria-live="polite" style={{ margin: 0, marginRight: 'auto' }}>
          {selected.length === 0 ? 'Nenhum membro selecionado' : `${selected.length} selecionado(s)`}
        </p>
        <Button variant="outline" size="sm" disabled={selected.length === 0}>
          Exportar CSV
        </Button>
        <Button variant="danger" size="sm" disabled={selected.length === 0}>
          Remover acesso
        </Button>
      </Stack>
      <Table
        caption="Membros da equipe"
        columns={columns}
        data={members}
        selectable
        selectedRows={selected}
        onSelectedRowsChange={setSelected}
      />
    </Stack>
  )
}
```

### Filtros por coluna

filter na coluna mostra um campo sob o cabeçalho: "text" (contém, sem diferenciar acentos nem maiúsculas) ou "select" (valor exato entre filterOptions). Os filtros se combinam, a tabela anuncia quantas linhas sobraram e "Selecionar todos" vale só para elas. Em colunas com render, informe filterValue. Com filters, onFiltersChange e manualFilter o filtro é feito no servidor.

```tsx
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
```

### Densidade, listras e cabeçalho fixo

density="compact" e striped para tabelas longas. maxHeight cria uma região rolável, focável pelo teclado, com o cabeçalho fixo.

```tsx
import { Table, type TableColumn } from '@orangesys/ui'

interface StockRow {
  sku: string
  product: string
  warehouse: string
  quantity: number
}

const products = ['Camiseta básica', 'Moletom canguru', 'Boné aba reta', 'Meia cano alto', 'Jaqueta corta-vento']
const warehouses = ['Guarulhos', 'Extrema', 'Recife']

const rows: StockRow[] = products.flatMap((product, p) =>
  warehouses.map((warehouse, w) => ({
    sku: `SKU-${(p + 1) * 100 + w}`,
    product,
    warehouse,
    quantity: ((p + 3) * (w + 7) * 13) % 480,
  })),
)

const columns: TableColumn<StockRow>[] = [
  { key: 'sku', header: 'SKU', rowHeader: true, width: 120 },
  { key: 'product', header: 'Produto' },
  { key: 'warehouse', header: 'Centro de distribuição' },
  { key: 'quantity', header: 'Quantidade', align: 'end', sortable: true },
]

export default function DensitySticky() {
  return (
    <Table
      caption="Estoque por centro de distribuição"
      hideCaption
      columns={columns}
      data={rows}
      getRowId={(row) => row.sku}
      density="compact"
      striped
      maxHeight={300}
    />
  )
}
```

### Linha clicável e estado vazio

onRowClick torna a linha inteira clicável sem mudar a semântica da tabela: a célula principal vira um botão para quem usa teclado. Filtre por "Resolvidos" para ver o estado vazio.

```tsx
import { Chip, ChipGroup, Stack, Table, Tag, type TableColumn } from '@orangesys/ui'
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
    <Stack gap={4}>
      <ChipGroup selectionMode="single" label="Status" value={status} onChange={setStatus}>
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
    </Stack>
  )
}
```

### Pedidos com detalhes

renderExpanded mostra os itens do pedido num painel abaixo da linha. O estado é controlado (expandedRows + onExpandedRowsChange) para o botão "Expandir todos"; ele guarda ids, então acompanha a linha ao ordenar. Use isRowExpandable para tirar o botão de linhas sem detalhe.

```tsx
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
```

### Colunas visíveis

TableColumnsMenu lista as colunas como itens marcáveis e a aplicação guarda hiddenColumns, que vai para o menu e para a tabela. As colunas voltam para o lugar de origem; hideable: false tira uma coluna do menu (aqui, a que identifica a linha). Os children do menu entram no fim — por exemplo, "Restaurar padrão".

```tsx
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
```

### Colunas fixas e redimensionáveis

pinned: "start" ou "end" prende a coluna à borda enquanto as outras rolam (a seleção acompanha as do início). resizable põe um separador na borda direita do cabeçalho: arraste, use as setas com o foco nele ou dê um clique duplo para ajustar ao conteúdo. Com a largura de todas as colunas informada (columnWidths ou defaultColumnWidths), a tabela tem largura fixa — a soma delas — e mudar uma coluna não mexe nas outras; sem isso, as larguras são registradas no primeiro redimensionamento.

```tsx
import { Stack, Table, type TableColumn, type TableColumnWidths } from '@orangesys/ui'
import { useState } from 'react'

interface Shipment {
  id: string
  customer: string
  origin: string
  destination: string
  carrier: string
  weight: number
  status: string
  freight: number
}

const brl = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })

const shipments: Shipment[] = [
  { id: 'ENV-3301', customer: 'Padaria Aurora', origin: 'Guarulhos (SP)', destination: 'Recife (PE)', carrier: 'Rota Norte', weight: 12.4, status: 'Em trânsito', freight: 186.5 },
  { id: 'ENV-3302', customer: 'Clínica Bem Viver', origin: 'Extrema (MG)', destination: 'Curitiba (PR)', carrier: 'Via Sul', weight: 3.1, status: 'Entregue', freight: 64.9 },
  { id: 'ENV-3303', customer: 'Atelier Norte', origin: 'Guarulhos (SP)', destination: 'Belém (PA)', carrier: 'Rota Norte', weight: 27.8, status: 'Aguardando coleta', freight: 412 },
  { id: 'ENV-3304', customer: 'Livraria Ponto e Vírgula', origin: 'Recife (PE)', destination: 'Goiânia (GO)', carrier: 'Expresso Cerrado', weight: 8.6, status: 'Em trânsito', freight: 143.2 },
  { id: 'ENV-3305', customer: 'Oficina do Bairro', origin: 'Extrema (MG)', destination: 'Porto Alegre (RS)', carrier: 'Via Sul', weight: 41.5, status: 'Entregue', freight: 298.75 },
]

const columns: TableColumn<Shipment>[] = [
  // pinned: a coluna fica presa à borda enquanto as outras rolam.
  { key: 'id', header: 'Envio', rowHeader: true, pinned: 'start' },
  // resizable: arraste a borda direita do cabeçalho; clique duplo ajusta ao conteúdo.
  { key: 'customer', header: 'Cliente', sortable: true, resizable: true },
  { key: 'origin', header: 'Origem', resizable: true },
  { key: 'destination', header: 'Destino', resizable: true },
  { key: 'carrier', header: 'Transportadora', resizable: true },
  { key: 'weight', header: 'Peso (kg)', align: 'end', sortable: true, render: (s) => s.weight.toLocaleString('pt-BR') },
  { key: 'status', header: 'Situação' },
  { key: 'freight', header: 'Frete', align: 'end', pinned: 'end', render: (s) => brl.format(s.freight) },
]

// Com a largura de todas as colunas informada, a tabela já nasce com largura fixa (a soma delas)
// e rola na horizontal quando não cabe. Sem isso, as larguras são registradas no primeiro
// redimensionamento.
const INITIAL_WIDTHS: TableColumnWidths = {
  id: 120,
  customer: 220,
  origin: 170,
  destination: 170,
  carrier: 180,
  weight: 120,
  status: 170,
  freight: 120,
}

export default function PinnedResizable() {
  // Controlado para mostrar (ou guardar) as larguras; defaultColumnWidths bastaria para iniciar.
  const [widths, setWidths] = useState(INITIAL_WIDTHS)

  return (
    <Stack gap={3}>
      <Table
        caption="Envios da semana"
        columns={columns}
        data={shipments}
        selectable
        columnWidths={widths}
        onColumnWidthsChange={setWidths}
      />
      <p style={{ margin: 0 }} aria-live="polite">
        Cliente {widths.customer}px · Origem {widths.origin}px · Destino {widths.destination}px · Transportadora{' '}
        {widths.carrier}px
      </p>
    </Stack>
  )
}
```

### Dez mil linhas

virtualized com maxHeight: só as linhas à vista (e algumas a mais) existem no DOM, então ordenar, filtrar e selecionar continuam rápidos. As linhas têm a mesma altura — as células não quebram linha — e a tabela informa o total ao leitor de tela. Não se combina com renderExpanded.

```tsx
import { Stack, Table, type TableColumn } from '@orangesys/ui'
import { useState } from 'react'

interface Reading {
  id: string
  sensor: string
  site: string
  kind: string
  value: number
  takenAt: Date
}

const sites = ['Guarulhos', 'Extrema', 'Recife', 'Curitiba']
const kinds = ['Temperatura', 'Umidade', 'Vibração']
const time = new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })

// 10.000 leituras fictícias, geradas de forma determinística.
const readings: Reading[] = Array.from({ length: 10000 }, (_, index) => ({
  id: `L-${String(index + 1).padStart(5, '0')}`,
  sensor: `S-${String((index % 48) + 1).padStart(2, '0')}`,
  site: sites[index % sites.length],
  kind: kinds[index % kinds.length],
  value: Math.round((18 + ((index * 37) % 640) / 10) * 10) / 10,
  takenAt: new Date(2026, 10, 1, 0, index * 3),
}))

const option = (value: string) => ({ value, label: value })

const columns: TableColumn<Reading>[] = [
  { key: 'id', header: 'Leitura', rowHeader: true, sortable: true, filter: 'text', width: 140 },
  { key: 'sensor', header: 'Sensor', sortable: true, filter: 'text', width: 120 },
  { key: 'site', header: 'Unidade', filter: 'select', filterOptions: sites.map(option) },
  { key: 'kind', header: 'Grandeza', filter: 'select', filterOptions: kinds.map(option) },
  { key: 'value', header: 'Valor', align: 'end', sortable: true, render: (r) => r.value.toLocaleString('pt-BR', { minimumFractionDigits: 1 }) },
  { key: 'takenAt', header: 'Medida em', sortable: true, render: (r) => time.format(r.takenAt) },
]

export default function Virtualized() {
  const [selected, setSelected] = useState<string[]>([])

  return (
    <Stack gap={3}>
      <p style={{ margin: 0 }} aria-live="polite">
        {selected.length.toLocaleString('pt-BR')} de {readings.length.toLocaleString('pt-BR')} leituras selecionadas
      </p>
      {/* virtualized exige maxHeight: só as linhas à vista vão para o DOM. */}
      <Table
        caption="Leituras dos sensores"
        hideCaption
        columns={columns}
        data={readings}
        virtualized
        maxHeight={420}
        density="compact"
        striped
        selectable
        selectedRows={selected}
        onSelectedRowsChange={setSelected}
      />
    </Stack>
  )
}
```

## Movimento

- **Hover de linha** — Fundo da linha em --or-duration-fast (160ms). Em linhas clicáveis, uma barra laranja de 2px entra pela esquerda e o texto principal ganha sublinhado que cresce (250ms).
- **Ordenar** — Crossfade entre o ícone neutro e a seta (160ms); a seta gira 180° entre crescente e decrescente com --or-ease-spring (250ms). O botão afunda 1px ao clicar (90ms).
- **Selecionar** — Fundo da linha em 160ms. A caixa encolhe ao pressionar e volta com --or-ease-bounce; o check é desenhado (stroke-dashoffset, 250ms) e o traço indeterminado cresce com spring.
- **Expandir** — O painel abre com grid-template-rows 0fr → 1fr em --or-duration-slow (400ms) e fecha mais rápido (250ms); o conteúdo entra com fade e desliza 4px. O chevron gira 180° com --or-ease-spring. Sem movimento em prefers-reduced-motion.
- **Redimensionar** — A linha do separador engrossa e fica laranja no hover, no foco e durante o arraste (160ms). A largura segue o ponteiro sem animação.
- **Estado vazio** — Entra com fade (250ms).

## Props

### `Table`

| Prop | Tipo | Padrão | Descrição |
| --- | --- | --- | --- |
| `caption` (obrigatória) | `ReactNode` | — | Título da tabela (`<caption>`). Obrigatório para dar nome à tabela. |
| `columns` (obrigatória) | `TableColumn<T>[]` | — | Definição das colunas. |
| `data` (obrigatória) | `T[]` | — | Linhas da tabela. |
| `columnWidths` | `TableColumnWidths` | — | Larguras das colunas em px (controlado). Na primeira vez que a pessoa redimensiona uma coluna, a tabela registra a largura de todas e passa a ter largura fixa: mudar uma coluna não mexe nas outras. |
| `containerProps` | `HTMLAttributes<HTMLDivElement>` | — | Atributos do contêiner com borda/rolagem que envolve a tabela. |
| `defaultColumnWidths` | `TableColumnWidths` | — | Larguras iniciais (não controlado). |
| `defaultExpandedRows` | `string[]` | — | Ids expandidos inicialmente (não controlado). |
| `defaultFilters` | `TableFilters` | — | Filtros iniciais (não controlado). |
| `defaultSelectedRows` | `string[]` | — | Ids selecionados inicialmente (não controlado). |
| `defaultSort` | `TableSort \| null` | — | Ordenação inicial (não controlada). |
| `density` | `"compact" \| "normal"` | — | Espaçamento das células. |
| `emptyState` | `ReactNode` | — | Conteúdo exibido quando `data` está vazio. |
| `expandedRows` | `string[]` | — | Ids das linhas expandidas (controlado). |
| `filters` | `TableFilters` | — | Filtros das colunas com `filter` (controlado): `{ [key]: texto }`. |
| `getRowId` | `((row: T, index: number) => string)` | — | Id estável de cada linha. Padrão: `row.id` ou o índice. |
| `getRowLabel` | `((row: T) => string)` | — | Texto que identifica a linha no rótulo do checkbox ("Selecionar linha: …") e do botão de expandir ("Expandir linha: …"). Padrão: o cabeçalho de linha (`rowHeader`). |
| `hiddenColumns` | `string[]` | — | `key` das colunas ocultas. Use com o `TableColumnsMenu` para a pessoa escolher as colunas. |
| `hideCaption` | `boolean` | — | Esconde a legenda visualmente, mantendo-a para leitores de tela. |
| `isRowExpandable` | `((row: T) => boolean)` | — | Diz quais linhas podem ser expandidas. Padrão: todas (quando há `renderExpanded`). |
| `manualFilter` | `boolean` | — | Não filtra `data` internamente (filtro feito no servidor). |
| `manualSort` | `boolean` | — | Não ordena `data` internamente (ordenação feita no servidor). |
| `maxHeight` | `string \| number` | — | Altura máxima: o corpo rola e o cabeçalho fica fixo. |
| `onColumnWidthsChange` | `((widths: TableColumnWidths) => void)` | — | Chamado enquanto a pessoa redimensiona uma coluna. |
| `onExpandedRowsChange` | `((ids: string[]) => void)` | — | Chamado com os ids expandidos sempre que uma linha abre ou fecha. |
| `onFiltersChange` | `((filters: TableFilters) => void)` | — | Chamado quando o usuário muda um filtro. |
| `onRowClick` | `((row: T, event: MouseEvent<HTMLElement, MouseEvent>) => void)` | — | Torna a linha clicável. A célula principal (cabeçalho de linha ou primeira coluna) vira um botão, garantindo o acesso por teclado. |
| `onSelectedRowsChange` | `((ids: string[]) => void)` | — | Chamado com os ids selecionados sempre que a seleção muda. |
| `onSortChange` | `((sort: TableSort \| null) => void)` | — | Chamado quando o usuário muda a ordenação. |
| `overscan` | `number` | — | Com `virtualized`: linhas a mais renderizadas acima e abaixo da área visível. Padrão: `8`. |
| `ref` | `Ref<HTMLTableElement>` | — | — |
| `renderExpanded` | `((row: T) => ReactNode)` | — | Conteúdo do painel de detalhes da linha. Com esta prop, cada linha expansível ganha um botão de expandir/recolher na primeira coluna, e o painel aparece logo abaixo da linha, em uma célula que ocupa todas as colunas. |
| `rowHeight` | `number` | — | Com `virtualized`: altura estimada da linha em px, usada até a tabela medir a real. |
| `selectable` | `boolean` | — | Mostra checkboxes para selecionar linhas. |
| `selectedRows` | `string[]` | — | Ids das linhas selecionadas (controlado). |
| `sort` | `TableSort \| null` | — | Ordenação controlada. |
| `striped` | `boolean` | — | Alterna a cor de fundo das linhas. |
| `virtualized` | `boolean` | — | Renderiza só as linhas à vista — para milhares de linhas. Exige `maxHeight` e linhas de mesma altura (as células não quebram linha); não se combina com `renderExpanded`. |

Repassa também os atributos nativos (`TableHTMLAttributes`): `className`, `style`, `aria-*`, `data-*` e eventos.

### `TableColumnsMenu`

Menu "Colunas" de uma `Table`: um item marcável por coluna, para a pessoa escolher o que quer
ver. O estado fica com a aplicação (`hiddenColumns`), que o passa também à tabela — assim dá
para guardar a escolha. Coloque o menu perto da tabela, na barra de ações acima dela.

| Prop | Tipo | Padrão | Descrição |
| --- | --- | --- | --- |
| `columns` (obrigatória) | `TableColumn<T>[]` | — | As mesmas colunas da `Table`. Colunas com `hideable: false` não entram no menu. |
| `hiddenColumns` (obrigatória) | `string[]` | — | `key` das colunas ocultas (o mesmo valor passado à `Table` em `hiddenColumns`). |
| `onHiddenColumnsChange` (obrigatória) | `(hidden: string[]) => void` | — | Chamado com a nova lista quando a pessoa mostra ou oculta uma coluna. |
| `children` | `ReactNode` | — | Itens a mais no fim do menu: um `DropdownSeparator` e "Restaurar padrão", por exemplo. |
| `label` | `ReactNode` | — | Texto do botão. Padrão: "Colunas", no idioma do provider. |
| `placement` | `"bottom" \| "top" \| "left" \| "right" \| "bottom-start" \| "bottom-end" \| "top-start" \| "top-end" \| "left-start" \| "left-end" \| "right-start" \| "right-end"` | `bottom-end` | Posição do menu em relação ao botão. Padrão: `bottom-end`. |
| `trigger` | `ReactElement<unknown, string \| JSXElementConstructor<any>>` | — | Botão que abre o menu, no lugar do padrão (contorno, pequeno, com ícone). |

### Tipos

`TableAlign`:

```ts
export type TableAlign = 'start' | 'center' | 'end'
```

`TableColumn`:

```ts
export interface TableColumn<T> {
  /** Identificador único da coluna. Sem `render`, a célula mostra `row[key]`. */
  key: string
  /** Conteúdo do cabeçalho (`<th scope="col">`). */
  header: ReactNode
  /** Renderiza o conteúdo da célula. */
  render?: (row: T, index: number) => ReactNode
  /** Permite ordenar pela coluna (botão no cabeçalho). */
  sortable?: boolean
  /** Valor usado na ordenação. Padrão: `row[key]`. */
  sortValue?: (row: T) => TableSortValue
  /** Alinhamento horizontal. Use `end` para números. */
  align?: TableAlign
  /** Largura da coluna (px ou qualquer unidade CSS). */
  width?: number | string
  /** Células desta coluna viram cabeçalhos de linha (`<th scope="row">`). */
  rowHeader?: boolean
  /** Esconde o texto do cabeçalho visualmente (continua acessível). */
  hideHeader?: boolean
  /**
   * Mostra um filtro sob o cabeçalho da coluna. `text`: a célula contém o texto digitado, sem
   * diferenciar acentos nem maiúsculas. `select`: valor exato entre `filterOptions`.
   */
  filter?: 'text' | 'select'
  /** Opções do filtro `select`. A primeira opção ("Todos") é incluída pela tabela. */
  filterOptions?: TableFilterOption[]
  /** Texto comparado pelo filtro. Padrão: `row[key]`. Informe quando a coluna usa `render`. */
  filterValue?: (row: T) => string
  /** `false` tira a coluna do `TableColumnsMenu`: ela não pode ser ocultada. Padrão: `true`. */
  hideable?: boolean
  /**
   * Fixa a coluna numa borda enquanto a tabela rola na horizontal: `start` (com a seleção e o
   * botão de expandir) ou `end` (bom para ações). Colunas fixas vão para a borda, na ordem dada.
   */
  pinned?: 'start' | 'end'
  /**
   * Deixa a pessoa mudar a largura da coluna: arrastando a borda direita do cabeçalho ou, com o
   * foco nela, pelas setas (Shift para passos maiores), Home e End. Clique duplo (ou Enter) ajusta
   * a coluna ao conteúdo.
   */
  resizable?: boolean
  /** Menor largura ao redimensionar, em px. Padrão: `80`. */
  minWidth?: number
  /** Maior largura ao redimensionar, em px. Padrão: `640`. */
  maxWidth?: number
}
```

`TableColumnWidths`:

```ts
/** Larguras das colunas em px, por `key`. */
export type TableColumnWidths = Record<string, number>
```

`TableDensity`:

```ts
export type TableDensity = 'compact' | 'normal'
```

`TableFilterOption`:

```ts
/** Opção de um filtro `select` da coluna. */
export interface TableFilterOption {
  value: string
  label: string
}
```

`TableFilters`:

```ts
/** Filtros ativos: o texto (ou o `value` da opção) por `key` de coluna. Vazio = sem filtro. */
export type TableFilters = Record<string, string>
```

`TableSort`:

```ts
export interface TableSort {
  /** `key` da coluna ordenada. */
  key: string
  direction: TableSortDirection
}
```

`TableSortDirection`:

```ts
export type TableSortDirection = 'ascending' | 'descending'
```

`TableSortValue`:

```ts
export type TableSortValue = string | number | boolean | Date | null | undefined
```

## Acessibilidade

É uma `<table>` nativa — não um grid ARIA —, então leitores de tela oferecem a navegação por células de sempre. Colunas ordenáveis expõem `aria-sort` (`ascending`, `descending` ou `none`) e cada mudança é anunciada em uma região de status ("Cliente, ordenado de forma crescente").

Na linha clicável, o clique do mouse vale para a linha inteira, mas o `<tr>` não recebe `role` nem foco: o acesso por teclado é um botão real na célula principal. Cliques em checkboxes, links e botões dentro da linha não disparam `onRowClick`.

Nas linhas expansíveis, o botão de cada linha segue o padrão disclosure: `aria-expanded` diz se o painel está aberto e, aberto, `aria-controls` aponta para a célula do painel (fechado, o painel sai do DOM). O nome segue a lógica do checkbox: "Expandir linha" ou "Recolher linha" seguido do cabeçalho da linha. A ordem na linha é botão de expandir, checkbox e células; o clique no botão não dispara `onRowClick`.

Cada filtro é um campo nativo com nome próprio ("Filtrar por Cliente"). Ao filtrar, a região de status anuncia quantas linhas sobraram ("12 resultados disponíveis") ou que não há nenhuma. Só as colunas visíveis filtram: um filtro que a pessoa não vê não esconde linhas.

O separador das colunas redimensionáveis segue o padrão *window splitter*: recebe foco, tem nome ("Redimensionar coluna Cliente") e expõe a largura em `aria-valuenow`, com mínimo e máximo. O arraste nunca é o único caminho: as setas mudam a largura e o clique duplo (ou Enter) ajusta a coluna ao conteúdo. O nome da coluna continua sendo só o do cabeçalho.

Com `virtualized`, a tabela informa o total em `aria-rowcount` e a posição de cada linha em `aria-rowindex`; a linha que está com o foco continua no DOM mesmo depois de rolar para fora da área visível. As linhas que ainda não foram renderizadas não existem para a busca do navegador (Ctrl+F) nem para a leitura contínua do leitor de tela — ofereça filtros e, se isso for um problema para a tarefa, prefira paginação.

| Teclas | Ação |
| --- | --- |
| `Tab` | Move o foco entre botões de ordenação, separadores de coluna, filtros, botões de expandir, checkboxes, a região rolável e ações das linhas. |
| `Enter` | Ordena pela coluna focada, abre/fecha o painel da linha ou abre a linha (botão da célula principal). |
| `Space` | Ordena pela coluna, abre/fecha o painel da linha ou marca/desmarca o checkbox focado. |
| `↑` + `↓` | Com a região rolável focada, rola a tabela. |
| `←` + `→` | No separador de coluna: diminui ou aumenta a largura em 16px (64px com Shift). Com a região rolável focada, rola na horizontal. |
| `Home` + `End` | No separador de coluna: largura mínima ou máxima. |
| `Enter` | No separador de coluna: ajusta a largura ao conteúdo (o mesmo do clique duplo). |

> **Seleção e leitores de tela** Cada checkbox é rotulado como "Selecionar linha" seguido do cabeçalho da linha (ex.: "Selecionar linha Mariana Lopes"). Sem coluna `rowHeader`, use `getRowLabel`.

- **1.3.1** — Estrutura com `caption`, `th scope="col"` e `th scope="row"`.
- **2.1.1** — Ordenação, filtros, seleção, expansão, redimensionamento, rolagem e linha clicável funcionam pelo teclado.
- **2.4.7** — Foco visível em botões de ordenação e de expandir, checkboxes e na região rolável.
- **2.4.11** — Com o cabeçalho fixo (`maxHeight`), a região rolável reserva a altura dele (`scroll-padding-top`): o foco que sobe pela tabela nunca fica escondido sob o cabeçalho. As colunas fixas reservam a largura delas do mesmo jeito (`scroll-padding-inline`).
- **2.5.7** — Redimensionar não depende de arrastar: o clique duplo no separador ajusta a coluna ao conteúdo e o teclado cobre o resto.
- **2.5.8** — A área de arrasto do separador tem 24px de largura (12px de cada lado da borda da coluna).
- **4.1.2** — Estado de ordenação em `aria-sort`; checkbox "selecionar todos" com estado indeterminado; painel de detalhes em `aria-expanded`; largura da coluna em `aria-valuenow`; total e posição das linhas virtualizadas em `aria-rowcount` e `aria-rowindex`.
- **4.1.3** — Mudanças de ordenação e o número de linhas depois de filtrar são anunciados em role="status".
