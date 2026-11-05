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
