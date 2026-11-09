# Modelo: Painel

- Ao vivo: https://orange.llypedev.com.br/pt/templates/dashboard

Visão geral de uma loja: AppShell com cabeçalho e menu lateral, filtro de período, indicadores com tendência, dois gráficos e a tabela de pedidos recentes com paginação.

Um painel junta muita informação em pouco espaço. A estrutura vem pronta do `AppShell` — landmarks, link de atalho, barra lateral que vira painel no celular — e o conteúdo segue uma ordem de leitura simples: título e filtro, números, gráficos, detalhes. O período escolhido filtra a tabela de pedidos de verdade; os indicadores e gráficos usam dados fixos de exemplo.

## Componentes usados

- **app-shell** (`components/app-shell.md`) — Estrutura da página: cabeçalho fixo, barra lateral (painel abaixo de 1024px), conteúdo e o link "Pular para o conteúdo principal".
- **app-header** (`components/app-header.md`) — Marca com o AppShellNavToggle, notificações e avatar.
- **side-nav** (`components/side-nav.md`) — Navegação do produto com grupo recolhível, contador e seção; a página atual tem aria-current.
- **page-header** (`components/page-header.md`) — Título, contexto (loja) e resumo do período, com o filtro e a ação principal à direita — que descem para baixo do título em telas estreitas.
- **date-range-picker** (`components/date-range-picker.md`) — Filtro de período com atalhos (últimos 7 e 30 dias, este mês, mês passado) e limite em hoje.
- **grid** (`components/grid.md`) — Indicadores em grade com bordas e minItemWidth (quantas colunas couberem, sem media query); gráficos lado a lado a partir de 1280px.
- **stat** (`components/stat.md`) — Cada número com rótulo, variação e contexto. Em "Cancelamentos", a queda é boa notícia (deltaTone="positive").
- **sparkline** (`components/sparkline.md`) — Tendência de 14 dias com a conclusão em palavras como texto alternativo.
- **bar-chart** (`components/bar-chart.md`) — Receita por canal, com resumo, fonte e tabela de dados acessível.
- **line-chart** (`components/line-chart.md`) — Pedidos por dia comparando duas semanas: cor, traço e marcador diferentes por série.
- **table** (`components/table.md`) — Pedidos com cabeçalho de linha, ordenação controlada (manualSort, sobre a lista inteira) e estado vazio.
- **badge** (`components/badge.md`) — Ponto de status ao lado do texto na tabela e contador sobre o botão de notificações.
- **paginator** (`components/paginator.md`) — Paginação com "1–6 de 30"; volta para a página 1 quando o filtro ou a ordem mudam.

## Acessibilidade

- **Landmarks** (1.3.1 · 2.4.1) — Cabeçalho (AppHeader), navegação nomeada (SideNav), conteúdo principal e o link "Pular para o conteúdo principal" como primeiro foco. A paginação é outro <nav>, com nome próprio.
- **Ordem dos títulos** (1.3.1 · 2.4.6) — "Visão geral" e, abaixo dele, uma seção por assunto: Indicadores, Vendas e Pedidos recentes, cada uma nomeada pelo seu título. Os gráficos são <figure> com legenda, não títulos.
- **Ordem do foco** (2.4.3) — Atalho → menu e marca → notificações → navegação lateral → filtro de período → Novo pedido → gráficos → cabeçalhos ordenáveis → paginação. No celular, o menu abre um painel modal que prende o foco e o devolve ao botão.
- **Erros e estados** (3.3.1 · 4.1.3) — Datas inválidas no filtro aparecem na mensagem do próprio campo. A contagem de pedidos é anunciada (aria-live) quando o período muda, e um período sem pedidos mostra um estado vazio com o que fazer.
- **Cor e gráficos** (1.1.1 · 1.4.1) — Status com texto ao lado do ponto colorido; sparklines com a conclusão em palavras; gráficos com resumo, tabela de dados e séries que diferem também por traço e marcador.
- **Refluxo** (1.4.10) — Em 390px não há rolagem horizontal da página: a navegação vai para o painel, os indicadores empilham e só a tabela rola, dentro da própria região focável.

## Código

`Dashboard.tsx`:

```tsx
import {
  AppHeader,
  AppShell,
  AppShellNavToggle,
  Avatar,
  Badge,
  BarChart,
  Button,
  DateRangePicker,
  Grid,
  Heading,
  Icon,
  IconButton,
  LineChart,
  PageHeader,
  Paginator,
  SideNav,
  SideNavGroup,
  SideNavItem,
  SideNavSection,
  Sparkline,
  Stat,
  Table,
  Text,
  type BadgeTone,
  type DateRange,
  type TableColumn,
  type TableSort,
} from '@orangesys/ui'
import { useId, useMemo, useState } from 'react'
import {
  canais,
  gerarPedidos,
  indicadores,
  pedidosPorDia,
  receitaPorCanal,
  semanas,
  type Pedido,
  type StatusPedido,
} from './data'
import './Dashboard.css'

const DIA = 24 * 60 * 60 * 1000
const POR_PAGINA = 6

const brl = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })
const dataHora = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
})
const dataCurta = new Intl.DateTimeFormat('pt-BR', { day: 'numeric', month: 'short' })

/** O texto diz o status; o ponto colorido (Badge) só reforça. */
const statusInfo: Record<StatusPedido, { label: string; tone: BadgeTone }> = {
  pago: { label: 'Pago', tone: 'success' },
  separacao: { label: 'Em separação', tone: 'info' },
  enviado: { label: 'Enviado', tone: 'neutral' },
  aguardando: { label: 'Aguardando pagamento', tone: 'warning' },
  cancelado: { label: 'Cancelado', tone: 'danger' },
}

const colunas: TableColumn<Pedido>[] = [
  { key: 'numero', header: 'Pedido', rowHeader: true, sortable: true, render: (p) => `#${p.numero}` },
  { key: 'cliente', header: 'Cliente' },
  { key: 'canal', header: 'Canal' },
  { key: 'criadoEm', header: 'Data', sortable: true, render: (p) => dataHora.format(p.criadoEm) },
  {
    key: 'status',
    header: 'Status',
    render: (p) => (
      <span className="aurora-dash__status">
        <Badge dot tone={statusInfo[p.status].tone} />
        {statusInfo[p.status].label}
      </span>
    ),
  },
  { key: 'total', header: 'Total', align: 'end', sortable: true, render: (p) => brl.format(p.total) },
]

/** Ordena a lista inteira (e não só a página visível) — por isso a Table usa `manualSort`. */
function ordenar(lista: Pedido[], sort: TableSort | null) {
  if (!sort) return lista
  const fator = sort.direction === 'ascending' ? 1 : -1
  const valor = (p: Pedido) =>
    sort.key === 'criadoEm' ? p.criadoEm.getTime() : sort.key === 'total' ? p.total : p.numero
  return [...lista].sort((a, b) => (valor(a) - valor(b)) * fator)
}

function hoje() {
  const agora = new Date()
  return new Date(agora.getFullYear(), agora.getMonth(), agora.getDate())
}

export default function Dashboard() {
  const indicadoresId = useId()
  const vendasId = useId()
  const pedidosId = useId()
  const [pedidos] = useState(() => gerarPedidos())
  const [periodo, setPeriodo] = useState<DateRange>(() => ({
    start: new Date(hoje().getTime() - 29 * DIA),
    end: hoje(),
  }))
  const [sort, setSort] = useState<TableSort | null>({ key: 'criadoEm', direction: 'descending' })
  const [pagina, setPagina] = useState(1)

  const filtrados = useMemo(() => {
    const { start, end } = periodo
    // O fim do período inclui o dia inteiro.
    const limite = end ? end.getTime() + DIA : Infinity
    const lista = pedidos.filter(
      (p) => (!start || p.criadoEm >= start) && p.criadoEm.getTime() < limite,
    )
    return ordenar(lista, sort)
  }, [pedidos, periodo, sort])

  const totalPaginas = Math.max(1, Math.ceil(filtrados.length / POR_PAGINA))
  const paginaAtual = Math.min(pagina, totalPaginas)
  const visiveis = filtrados.slice((paginaAtual - 1) * POR_PAGINA, paginaAtual * POR_PAGINA)
  const resumoPeriodo =
    periodo.start && periodo.end
      ? // Sem ponto final: o mês abreviado ("nov.") já termina em ponto.
        `Vendas e pedidos de ${dataCurta.format(periodo.start)} a ${dataCurta.format(periodo.end)}`
      : 'Escolha o período para atualizar o painel.'

  return (
    // O AppShell cria o <main> e o link "Pular para o conteúdo principal".
    <AppShell
      header={
        <AppHeader
          brand={
            <>
              <AppShellNavToggle />
              <a href="#inicio" aria-label="Aurora — início">
                <Icon name="layers" /> Aurora
              </a>
            </>
          }
          actions={
            <>
              <Badge count={3} label="3 notificações não lidas">
                <IconButton icon="bell" label="Notificações" variant="ghost" />
              </Badge>
              <Avatar name="Marina Costa" size="sm" className="aurora-dash__avatar" />
            </>
          }
        />
      }
      navLabel="Navegação do painel"
      navTitle="Aurora"
      navigation={
        <SideNav currentHref="#inicio">
          <SideNavItem href="#inicio" icon={<Icon name="home" />}>
            Início
          </SideNavItem>
          <SideNavItem href="#pedidos" icon={<Icon name="inbox" />} badge={12}>
            Pedidos
          </SideNavItem>
          <SideNavGroup label="Catálogo" icon={<Icon name="tag" />}>
            <SideNavItem href="#produtos">Produtos</SideNavItem>
            <SideNavItem href="#estoque">Estoque</SideNavItem>
          </SideNavGroup>
          <SideNavItem href="#clientes" icon={<Icon name="users" />}>
            Clientes
          </SideNavItem>
          <SideNavItem href="#relatorios" icon={<Icon name="chart-bar" />}>
            Relatórios
          </SideNavItem>
          <SideNavSection title="Loja">
            <SideNavItem href="#configuracoes" icon={<Icon name="sliders" />}>
              Configurações
            </SideNavItem>
          </SideNavSection>
        </SideNav>
      }
    >
      <PageHeader
        eyebrow="Loja Aurora Centro"
        title="Visão geral"
        description={resumoPeriodo}
        divider
        actions={
          <>
            <DateRangePicker
              label="Período"
              hideLabel
              value={periodo}
              onChange={(next) => {
                setPeriodo(next)
                setPagina(1)
              }}
              max={hoje()}
              presets={['last7Days', 'last30Days', 'thisMonth', 'lastMonth']}
            />
            <Button startIcon={<Icon name="plus" />}>Novo pedido</Button>
          </>
        }
      />

      <div className="aurora-dash">
        <section className="aurora-dash__section" aria-labelledby={indicadoresId}>
          <Heading level={2} size="lg" id={indicadoresId}>
            Indicadores
          </Heading>
          <Grid as="ul" variant="bordered" minItemWidth="14rem" gap={6}>
            {indicadores.map((item) => (
              <li key={item.id} className="aurora-dash__kpi">
                <Stat
                  label={item.label}
                  value={item.value}
                  delta={item.delta}
                  trend={item.trend}
                  deltaTone={item.deltaTone}
                  help={item.help}
                />
                <Sparkline data={item.serie} label={item.resumo} width={168} height={36} area />
              </li>
            ))}
          </Grid>
        </section>

        <section className="aurora-dash__section" aria-labelledby={vendasId}>
          <Heading level={2} size="lg" id={vendasId}>
            Vendas
          </Heading>
          <Grid columns={{ base: 1, xl: 2 }} gap={4}>
            <BarChart
              title="Receita por canal"
              description="R$ por mês · últimos 5 meses"
              summary="A loja virtual lidera todos os meses; o aplicativo cresce mais rápido, de R$ 21,4 mil para R$ 35,9 mil."
              categoryLabel="Mês"
              valueFormat={{ style: 'currency', currency: 'BRL', notation: 'compact', maximumFractionDigits: 1 }}
              series={canais}
              data={receitaPorCanal}
              source="Dados fictícios."
            />
            <LineChart
              title="Pedidos por dia"
              description="Esta semana e a anterior"
              summary="Todos os dias desta semana superaram a semana anterior; o pico foi no sábado, com 246 pedidos."
              categoryLabel="Dia"
              series={semanas}
              data={pedidosPorDia}
              source="Dados fictícios."
            />
          </Grid>
        </section>

        <section className="aurora-dash__section" aria-labelledby={pedidosId}>
          <div className="aurora-dash__section-head">
            <Heading level={2} size="lg" id={pedidosId}>
              Pedidos recentes
            </Heading>
            <Text size="sm" tone="muted" aria-live="polite">
              {filtrados.length} {filtrados.length === 1 ? 'pedido' : 'pedidos'} no período
            </Text>
          </div>
          <Table
            caption="Pedidos recentes"
            hideCaption
            columns={colunas}
            data={visiveis}
            getRowId={(p) => p.id}
            sort={sort}
            onSortChange={(next) => {
              setSort(next)
              setPagina(1)
            }}
            manualSort
            emptyState="Nenhum pedido no período. Escolha outras datas."
          />
          {filtrados.length > POR_PAGINA && (
            <Paginator
              page={paginaAtual}
              onPageChange={setPagina}
              totalItems={filtrados.length}
              pageSize={POR_PAGINA}
              size="sm"
              aria-label="Páginas dos pedidos"
            />
          )}
        </section>
      </div>
    </AppShell>
  )
}
```

`data.ts`:

```ts
/*
 * Dados fictícios do painel da Aurora. Em um app, venham da API — o formato
 * é o que os componentes esperam (Stat, Sparkline, BarChart, LineChart, Table).
 */
import type { BarChartDatum, BarChartSeries, LineChartDatum, LineChartSeries, StatDeltaTone, StatTrend } from '@orangesys/ui'

export interface Indicador {
  id: string
  label: string
  value: string
  delta: string
  trend: StatTrend
  deltaTone?: StatDeltaTone
  help: string
  /** Últimos 14 dias, do mais antigo ao mais recente. */
  serie: number[]
  /** Texto alternativo da sparkline: a conclusão em palavras. */
  resumo: string
}

export const indicadores: Indicador[] = [
  {
    id: 'receita',
    label: 'Receita',
    value: 'R$ 128,4 mil',
    delta: '12%',
    trend: 'increase',
    help: 'vs. período anterior',
    serie: [3.6, 3.9, 3.7, 4.1, 4.4, 4.2, 4.0, 4.3, 4.6, 4.5, 4.8, 4.7, 5.0, 4.9],
    resumo: 'Receita diária subiu de R$ 3,6 mil para R$ 4,9 mil em 14 dias',
  },
  {
    id: 'pedidos',
    label: 'Pedidos',
    value: '1.284',
    delta: '4%',
    trend: 'increase',
    help: 'vs. período anterior',
    serie: [41, 44, 39, 46, 45, 43, 47, 44, 48, 46, 49, 47, 50, 48],
    resumo: 'Pedidos por dia subiram de 41 para 48 em 14 dias',
  },
  {
    id: 'ticket',
    label: 'Ticket médio',
    value: 'R$ 99,90',
    delta: '7%',
    trend: 'increase',
    help: 'vs. período anterior',
    serie: [92, 94, 93, 95, 96, 94, 97, 96, 98, 97, 99, 98, 101, 100],
    resumo: 'Ticket médio subiu de R$ 92 para R$ 100 em 14 dias',
  },
  {
    id: 'cancelamentos',
    label: 'Cancelamentos',
    value: '2,4%',
    delta: '0,6 p.p.',
    trend: 'decrease',
    // Queda de cancelamento é boa notícia: o tom do delta é invertido.
    deltaTone: 'positive',
    help: 'dos pedidos do período',
    serie: [3.1, 3.0, 3.2, 2.9, 2.8, 2.9, 2.7, 2.6, 2.7, 2.5, 2.6, 2.4, 2.5, 2.4],
    resumo: 'Cancelamentos caíram de 3,1% para 2,4% dos pedidos em 14 dias',
  },
]

export const canais: BarChartSeries[] = [
  { key: 'site', label: 'Loja virtual' },
  { key: 'app', label: 'Aplicativo' },
  { key: 'marketplace', label: 'Marketplaces' },
]

export const receitaPorCanal: BarChartDatum[] = [
  { label: 'jun', values: { site: 48200, app: 21400, marketplace: 15800 } },
  { label: 'jul', values: { site: 51900, app: 24300, marketplace: 16900 } },
  { label: 'ago', values: { site: 50300, app: 27800, marketplace: 18200 } },
  { label: 'set', values: { site: 55100, app: 31200, marketplace: 17600 } },
  { label: 'out', values: { site: 58700, app: 35900, marketplace: 19400 } },
]

export const semanas: LineChartSeries[] = [
  { key: 'atual', label: 'Esta semana' },
  { key: 'anterior', label: 'Semana anterior' },
]

export const pedidosPorDia: LineChartDatum[] = [
  { label: 'seg', values: { atual: 182, anterior: 164 } },
  { label: 'ter', values: { atual: 176, anterior: 171 } },
  { label: 'qua', values: { atual: 195, anterior: 168 } },
  { label: 'qui', values: { atual: 201, anterior: 180 } },
  { label: 'sex', values: { atual: 228, anterior: 207 } },
  { label: 'sáb', values: { atual: 246, anterior: 229 } },
  { label: 'dom', values: { atual: 214, anterior: 198 } },
]

export type StatusPedido = 'pago' | 'separacao' | 'enviado' | 'aguardando' | 'cancelado'

export interface Pedido {
  id: string
  numero: number
  cliente: string
  canal: string
  criadoEm: Date
  total: number
  status: StatusPedido
}

const clientes = [
  'Beatriz L.',
  'Rafael M.',
  'Juliana C.',
  'Thiago S.',
  'Camila R.',
  'Diego A.',
  'Larissa F.',
  'Bruno T.',
  'Paula N.',
  'Gustavo O.',
  'Fernanda V.',
]
const nomesCanais = ['Loja virtual', 'Aplicativo', 'Marketplace', 'Loja física']
const status: StatusPedido[] = ['pago', 'separacao', 'pago', 'enviado', 'aguardando', 'pago', 'enviado', 'cancelado']
const HORA = 60 * 60 * 1000

/** 30 pedidos, um a cada ~22 horas, contando de agora para trás. */
export function gerarPedidos(agora = Date.now()): Pedido[] {
  return Array.from({ length: 30 }, (_, i) => ({
    id: `pedido-${4821 - i}`,
    numero: 4821 - i,
    cliente: clientes[(i * 7) % clientes.length],
    canal: nomesCanais[(i * 3) % nomesCanais.length],
    criadoEm: new Date(agora - i * 22 * HORA - ((i * 37) % 60) * 60 * 1000),
    total: Math.round((79.9 + ((i * 137) % 640) + (i % 4) * 0.45) * 100) / 100,
    status: status[i % status.length],
  }))
}
```

`Dashboard.css`:

```css
/*
 * Painel — visão geral da loja na Aurora.
 * A estrutura (cabeçalho, barra lateral, painel no celular) vem do AppShell;
 * aqui só o ritmo vertical das seções e os detalhes dos cartões. Só tokens.
 */

.aurora-dash {
  display: grid;
  gap: var(--or-space-10);
  margin-top: var(--or-space-8);
}

.aurora-dash__section {
  display: grid;
  gap: var(--or-space-4);
  min-width: 0;
}

.aurora-dash__section-head {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  justify-content: space-between;
  gap: var(--or-space-2) var(--or-space-4);
}

/* Respiro para o contador de notificações, que sai do canto do botão. */
.aurora-dash__avatar {
  margin-left: var(--or-space-2);
}

/* Cartão de indicador: número em cima, tendência embaixo. */
.aurora-dash__kpi {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: var(--or-space-4);
  /* A sparkline desenha o anel do ponto final com a cor da superfície. */
  --or-chart-surface: var(--or-color-bg);
}

/* Status: ponto colorido + texto (a cor nunca é a única pista). */
.aurora-dash__status {
  display: inline-flex;
  align-items: center;
  gap: var(--or-space-2);
  white-space: nowrap;
}
```
