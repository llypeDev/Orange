# Table

Tabela de dados semântica com ordenação por coluna, seleção de linhas, cabeçalho fixo e estado vazio.

- Categoria: Exibição de dados · Status: estável
- Importação: `import { Table } from '@orangesys/ui'`
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

## Anatomia

- **Legenda** — O <caption> que nomeia a tabela. Pode ser oculto visualmente.
- **Cabeçalho de coluna** — <th scope="col">. Em colunas ordenáveis, contém um botão e recebe aria-sort.
- **Cabeçalho de linha** — <th scope="row"> na coluna marcada com rowHeader.
- **Seleção** — Checkbox nativo por linha e "selecionar todos" com estado indeterminado.
- **Expansão** — Coluna inicial ("Detalhes", oculta visualmente) com um botão por linha (aria-expanded, aria-controls). O painel é uma linha logo abaixo, com uma única célula que ocupa todas as colunas.
- **Estado vazio** — Célula que ocupa todas as colunas quando não há dados.

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
import { Button, Table, type TableColumn } from '@orangesys/ui'
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
    <div style={{ display: 'grid', gap: 12 }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 12 }}>
        <p aria-live="polite" style={{ margin: 0, marginRight: 'auto' }}>
          {selected.length === 0 ? 'Nenhum membro selecionado' : `${selected.length} selecionado(s)`}
        </p>
        <Button variant="outline" size="sm" disabled={selected.length === 0}>
          Exportar CSV
        </Button>
        <Button variant="danger" size="sm" disabled={selected.length === 0}>
          Remover acesso
        </Button>
      </div>
      <Table
        caption="Membros da equipe"
        columns={columns}
        data={members}
        selectable
        selectedRows={selected}
        onSelectedRowsChange={setSelected}
      />
    </div>
  )
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
    </div>
  )
}
```

### Pedidos com detalhes

renderExpanded mostra os itens do pedido num painel abaixo da linha. O estado é controlado (expandedRows + onExpandedRowsChange) para o botão "Expandir todos"; ele guarda ids, então acompanha a linha ao ordenar. Use isRowExpandable para tirar o botão de linhas sem detalhe.

```tsx
import { Button, Table, Tag, type TableColumn } from '@orangesys/ui'
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
    <div style={{ display: 'grid', gap: 12 }}>
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
    </div>
  )
}

export default function ExpandableRows() {
  const [expanded, setExpanded] = useState<string[]>(['10482'])
  const allExpanded = expanded.length === orders.length

  return (
    <div style={{ display: 'grid', gap: 12 }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 12 }}>
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
      </div>
      <Table
        caption="Pedidos da semana"
        hideCaption
        columns={columns}
        data={orders}
        expandedRows={expanded}
        onExpandedRowsChange={setExpanded}
        renderExpanded={(order) => <OrderDetails order={order} />}
      />
    </div>
  )
}
```

### Colunas visíveis

A Table não tem API própria para isso: a aplicação filtra o array columns. Aqui um Dropdown com DropdownCheckboxItem liga e desliga as colunas, mantendo a ordem original; a coluna rowHeader fica sempre visível. Guarde a escolha (ex.: nas preferências do usuário) se ela precisar persistir.

```tsx
import {
  Button,
  Dropdown,
  DropdownCheckboxItem,
  DropdownItem,
  DropdownLabel,
  DropdownSeparator,
  Icon,
  Table,
  type TableColumn,
} from '@orangesys/ui'
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

const allColumns: TableColumn<Product>[] = [
  { key: 'name', header: 'Produto', rowHeader: true },
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

/** A coluna que identifica a linha (rowHeader) não pode ser escondida. */
const REQUIRED = 'name'
const DEFAULT_VISIBLE = ['name', 'sku', 'stock', 'price']

export default function VisibleColumns() {
  const [visible, setVisible] = useState<string[]>(DEFAULT_VISIBLE)
  // Filtra mantendo a ordem original: uma coluna reexibida volta para o mesmo lugar.
  const columns = allColumns.filter((column) => visible.includes(column.key))

  const toggle = (key: string, checked: boolean) =>
    setVisible((current) => (checked ? [...current, key] : current.filter((k) => k !== key)))

  return (
    <div style={{ display: 'grid', gap: 12 }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 12 }}>
        <p style={{ margin: 0, marginRight: 'auto' }}>
          {columns.length} de {allColumns.length} colunas visíveis
        </p>
        <Dropdown
          placement="bottom-end"
          trigger={
            <Button variant="outline" size="sm" startIcon={<Icon name="sliders" />}>
              Colunas
            </Button>
          }
        >
          <DropdownLabel>Mostrar colunas</DropdownLabel>
          {allColumns.map((column) => (
            <DropdownCheckboxItem
              key={column.key}
              checked={visible.includes(column.key)}
              disabled={column.key === REQUIRED}
              onCheckedChange={(checked) => toggle(column.key, checked)}
            >
              {column.header}
            </DropdownCheckboxItem>
          ))}
          <DropdownSeparator />
          <DropdownItem icon="refresh" onSelect={() => setVisible(DEFAULT_VISIBLE)}>
            Restaurar padrão
          </DropdownItem>
        </Dropdown>
      </div>
      <Table
        caption="Catálogo de produtos"
        hideCaption
        columns={columns}
        data={products}
        getRowId={(product) => product.sku}
      />
    </div>
  )
}
```

## Movimento

- **Hover de linha** — Fundo da linha em --or-duration-fast (160ms). Em linhas clicáveis, uma barra laranja de 2px entra pela esquerda e o texto principal ganha sublinhado que cresce (250ms).
- **Ordenar** — Crossfade entre o ícone neutro e a seta (160ms); a seta gira 180° entre crescente e decrescente com --or-ease-spring (250ms). O botão afunda 1px ao clicar (90ms).
- **Selecionar** — Fundo da linha em 160ms. A caixa encolhe ao pressionar e volta com --or-ease-bounce; o check é desenhado (stroke-dashoffset, 250ms) e o traço indeterminado cresce com spring.
- **Expandir** — O painel abre com grid-template-rows 0fr → 1fr em --or-duration-slow (400ms) e fecha mais rápido (250ms); o conteúdo entra com fade e desliza 4px. O chevron gira 180° com --or-ease-spring. Sem movimento em prefers-reduced-motion.
- **Estado vazio** — Entra com fade (250ms).

## Props

### `Table`

| Prop | Tipo | Padrão | Descrição |
| --- | --- | --- | --- |
| `caption` (obrigatória) | `ReactNode` | — | Título da tabela (`<caption>`). Obrigatório para dar nome à tabela. |
| `columns` (obrigatória) | `TableColumn<T>[]` | — | Definição das colunas. |
| `data` (obrigatória) | `T[]` | — | Linhas da tabela. |
| `containerProps` | `HTMLAttributes<HTMLDivElement>` | — | Atributos do contêiner com borda/rolagem que envolve a tabela. |
| `defaultExpandedRows` | `string[]` | — | Ids expandidos inicialmente (não controlado). |
| `defaultSelectedRows` | `string[]` | — | Ids selecionados inicialmente (não controlado). |
| `defaultSort` | `TableSort \| null` | — | Ordenação inicial (não controlada). |
| `density` | `"compact" \| "normal"` | — | Espaçamento das células. |
| `emptyState` | `ReactNode` | — | Conteúdo exibido quando `data` está vazio. |
| `expandedRows` | `string[]` | — | Ids das linhas expandidas (controlado). |
| `getRowId` | `((row: T, index: number) => string)` | — | Id estável de cada linha. Padrão: `row.id` ou o índice. |
| `getRowLabel` | `((row: T) => string)` | — | Texto que identifica a linha no rótulo do checkbox ("Selecionar linha: …") e do botão de expandir ("Expandir linha: …"). Padrão: o cabeçalho de linha (`rowHeader`). |
| `hideCaption` | `boolean` | — | Esconde a legenda visualmente, mantendo-a para leitores de tela. |
| `isRowExpandable` | `((row: T) => boolean)` | — | Diz quais linhas podem ser expandidas. Padrão: todas (quando há `renderExpanded`). |
| `manualSort` | `boolean` | — | Não ordena `data` internamente (ordenação feita no servidor). |
| `maxHeight` | `string \| number` | — | Altura máxima: o corpo rola e o cabeçalho fica fixo. |
| `onExpandedRowsChange` | `((ids: string[]) => void)` | — | Chamado com os ids expandidos sempre que uma linha abre ou fecha. |
| `onRowClick` | `((row: T, event: MouseEvent<HTMLElement, MouseEvent>) => void)` | — | Torna a linha clicável. A célula principal (cabeçalho de linha ou primeira coluna) vira um botão, garantindo o acesso por teclado. |
| `onSelectedRowsChange` | `((ids: string[]) => void)` | — | Chamado com os ids selecionados sempre que a seleção muda. |
| `onSortChange` | `((sort: TableSort \| null) => void)` | — | Chamado quando o usuário muda a ordenação. |
| `ref` | `Ref<HTMLTableElement>` | — | — |
| `renderExpanded` | `((row: T) => ReactNode)` | — | Conteúdo do painel de detalhes da linha. Com esta prop, cada linha expansível ganha um botão de expandir/recolher na primeira coluna, e o painel aparece logo abaixo da linha, em uma célula que ocupa todas as colunas. |
| `selectable` | `boolean` | — | Mostra checkboxes para selecionar linhas. |
| `selectedRows` | `string[]` | — | Ids das linhas selecionadas (controlado). |
| `sort` | `TableSort \| null` | — | Ordenação controlada. |
| `striped` | `boolean` | — | Alterna a cor de fundo das linhas. |

Repassa também os atributos nativos (`TableHTMLAttributes`): `className`, `style`, `aria-*`, `data-*` e eventos.

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
}
```

`TableDensity`:

```ts
export type TableDensity = 'compact' | 'normal'
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

| Teclas | Ação |
| --- | --- |
| `Tab` | Move o foco entre botões de ordenação, botões de expandir, checkboxes, a região rolável e ações das linhas. |
| `Enter` | Ordena pela coluna focada, abre/fecha o painel da linha ou abre a linha (botão da célula principal). |
| `Space` | Ordena pela coluna, abre/fecha o painel da linha ou marca/desmarca o checkbox focado. |
| `↑` + `↓` | Com a região rolável focada, rola a tabela. |

> **Seleção e leitores de tela** Cada checkbox é rotulado como "Selecionar linha" seguido do cabeçalho da linha (ex.: "Selecionar linha Mariana Lopes"). Sem coluna `rowHeader`, use `getRowLabel`.

- **1.3.1** — Estrutura com `caption`, `th scope="col"` e `th scope="row"`.
- **2.1.1** — Ordenação, seleção, expansão, rolagem e linha clicável funcionam pelo teclado.
- **2.4.7** — Foco visível em botões de ordenação e de expandir, checkboxes e na região rolável.
- **2.4.11** — Com o cabeçalho fixo (`maxHeight`), a região rolável reserva a altura dele (`scroll-padding-top`): o foco que sobe pela tabela nunca fica escondido sob o cabeçalho.
- **4.1.2** — Estado de ordenação em `aria-sort`; checkbox "selecionar todos" com estado indeterminado; painel de detalhes em `aria-expanded`.
- **4.1.3** — Mudanças de ordenação anunciadas em role="status".
