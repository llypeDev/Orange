import {
  AppHeader,
  AppShell,
  AppShellNavToggle,
  Button,
  Icon,
  IconButton,
  PageHeader,
  SideNav,
  SideNavGroup,
  SideNavItem,
  Tag,
} from '@orangesys/ui'

const orders = [
  {
    id: '#4821',
    store: 'Mercearia Bom Grão',
    total: 'R$ 1.240,00',
    status: 'Pago',
    tone: 'success',
  },
  {
    id: '#4820',
    store: 'Café Ponto Doce',
    total: 'R$ 318,90',
    status: 'Aguardando envio',
    tone: 'warning',
  },
  {
    id: '#4819',
    store: 'Ateliê Fio de Linha',
    total: 'R$ 96,50',
    status: 'Em separação',
    tone: 'info',
  },
] as const

export default function Orders() {
  return (
    // Na documentação o AppShell fica contido: altura fixa + fullHeight={false}.
    // Em um app, use <AppShell> direto na raiz da página.
    <div style={{ height: 560, border: '1px solid var(--or-color-border)' }}>
      <AppShell
        mainElement="div"
        fullHeight={false}
        header={
          <AppHeader
            brand={
              <>
                <AppShellNavToggle />
                <a href="#inicio" aria-label="Aurora Commerce — início">
                  <Icon name="layers" /> Aurora
                </a>
              </>
            }
            actions={<IconButton icon="bell" label="Notificações" />}
          />
        }
        navLabel="Navegação do painel"
        navigation={
          <SideNav currentHref="#pedidos">
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
          </SideNav>
        }
        asideLabel="Resumo do dia"
        aside={
          <div style={{ display: 'grid', gap: 8 }}>
            <p className="or-eyebrow" style={{ margin: 0 }}>
              Resumo do dia
            </p>
            <p
              style={{
                margin: 0,
                fontFamily: 'var(--or-font-display)',
                fontSize: 28,
                fontWeight: 700,
              }}
            >
              R$ 8.420
            </p>
            <p style={{ margin: 0, color: 'var(--or-color-text-muted)' }}>
              37 pedidos · 5 aguardando envio
            </p>
          </div>
        }
      >
        <PageHeader
          headingLevel={2}
          eyebrow="Vendas"
          title="Pedidos"
          description="Pedidos das últimas 24 horas."
          divider
          actions={<Button startIcon={<Icon name="plus" />}>Novo pedido</Button>}
        />
        <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
          {orders.map((order) => (
            <li
              key={order.id}
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                gap: 12,
                padding: '14px 0',
                borderBottom: '1px solid var(--or-color-border)',
              }}
            >
              <strong style={{ fontFamily: 'var(--or-font-display)' }}>{order.id}</strong>
              <span style={{ flex: '1 1 9rem' }}>{order.store}</span>
              <Tag tone={order.tone}>{order.status}</Tag>
              <span style={{ fontVariantNumeric: 'tabular-nums' }}>{order.total}</span>
            </li>
          ))}
        </ul>
      </AppShell>
    </div>
  )
}
