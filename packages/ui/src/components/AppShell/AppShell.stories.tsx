import type { Meta, StoryObj } from '@storybook/react-vite'
import { Icon } from '../../icons'
import { AppHeader } from '../AppHeader'
import { Button } from '../Button'
import { Footer } from '../Footer'
import { IconButton } from '../IconButton'
import { PageHeader } from '../PageHeader'
import { SideNav, SideNavGroup, SideNavItem, SideNavSection } from '../SideNav'
import { Tag } from '../Tag'
import { AppShell, AppShellNavToggle, useAppShell } from './AppShell'

const orders = [
  {
    id: '#4821',
    client: 'Mercearia Bom Grão',
    total: 'R$ 1.240,00',
    status: 'Pago',
    tone: 'success' as const,
  },
  {
    id: '#4820',
    client: 'Café Ponto Doce',
    total: 'R$ 318,90',
    status: 'Aguardando envio',
    tone: 'warning' as const,
  },
  {
    id: '#4819',
    client: 'Ateliê Fio de Linha',
    total: 'R$ 96,50',
    status: 'Em separação',
    tone: 'info' as const,
  },
  {
    id: '#4818',
    client: 'Livraria Página 9',
    total: 'R$ 452,00',
    status: 'Pago',
    tone: 'success' as const,
  },
]

function Header() {
  return (
    <AppHeader
      brand={
        <>
          <AppShellNavToggle />
          <a href="#inicio" aria-label="Aurora Commerce — início">
            <Icon name="layers" /> Aurora
          </a>
        </>
      }
      actions={
        <>
          <IconButton icon="search" label="Buscar pedidos" />
          <IconButton icon="bell" label="Notificações" />
        </>
      }
    />
  )
}

function Navigation() {
  return (
    <SideNav currentHref="#pedidos">
      <SideNavItem href="#inicio" icon={<Icon name="home" />}>
        Início
      </SideNavItem>
      <SideNavItem href="#pedidos" icon={<Icon name="inbox" />} badge={12}>
        Pedidos
      </SideNavItem>
      <SideNavGroup label="Catálogo" icon={<Icon name="tag" />}>
        <SideNavItem href="#produtos">Produtos</SideNavItem>
        <SideNavItem href="#categorias">Categorias</SideNavItem>
        <SideNavItem href="#estoque">Estoque</SideNavItem>
      </SideNavGroup>
      <SideNavItem href="#clientes" icon={<Icon name="users" />}>
        Clientes
      </SideNavItem>
      <SideNavSection title="Loja">
        <SideNavItem href="#relatorios" icon={<Icon name="chart-bar" />}>
          Relatórios
        </SideNavItem>
        <SideNavItem href="#configuracoes" icon={<Icon name="sliders" />}>
          Configurações
        </SideNavItem>
      </SideNavSection>
    </SideNav>
  )
}

function Orders() {
  return (
    <>
      <PageHeader
        eyebrow="Vendas"
        title="Pedidos"
        description="Pedidos das últimas 24 horas em todas as lojas."
        divider
        actions={
          <>
            <Button variant="outline" startIcon={<Icon name="download" />}>
              Exportar
            </Button>
            <Button startIcon={<Icon name="plus" />}>Novo pedido</Button>
          </>
        }
      />
      <ul style={{ display: 'grid', gap: 0, margin: '24px 0 0', padding: 0, listStyle: 'none' }}>
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
            <strong style={{ fontFamily: 'var(--or-font-display)', minWidth: 64 }}>
              {order.id}
            </strong>
            <span style={{ flex: '1 1 10rem' }}>{order.client}</span>
            <Tag tone={order.tone}>{order.status}</Tag>
            <span style={{ fontVariantNumeric: 'tabular-nums' }}>{order.total}</span>
          </li>
        ))}
      </ul>
    </>
  )
}

const summary = (
  <div style={{ display: 'grid', gap: 12 }}>
    <p className="or-eyebrow" style={{ margin: 0 }}>
      Resumo do dia
    </p>
    <p style={{ margin: 0, fontFamily: 'var(--or-font-display)', fontSize: 32, fontWeight: 700 }}>
      R$ 8.420
    </p>
    <p style={{ margin: 0, color: 'var(--or-color-text-muted)' }}>
      37 pedidos · 5 aguardando envio
    </p>
  </div>
)

const meta = {
  title: 'Componentes/AppShell',
  component: AppShell,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Estrutura de página da aplicação: `header`, `navigation` (barra lateral fixa e recolhível; abaixo de `navDrawerBelow` vira um `Drawer`), `children` no `<main>`, `aside` e `footer`, com landmarks nomeados e `SkipLink`. Use `AppShellNavToggle` e `useAppShell()` para controlar a navegação de qualquer lugar. Redimensione a prévia para ver o painel em telas estreitas.',
      },
    },
  },
  argTypes: {
    navDrawerBelow: { control: 'inline-radio', options: ['md', 'lg'] },
    stickyHeader: { control: 'boolean' },
    stickyNav: { control: 'boolean' },
    skipLink: { control: 'boolean' },
    onNavCollapsedChange: { action: 'navCollapsedChange' },
    onNavOpenChange: { action: 'navOpenChange' },
  },
  args: {
    header: <Header />,
    navigation: <Navigation />,
    navLabel: 'Navegação do painel',
    children: <Orders />,
  },
} satisfies Meta<typeof AppShell>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithAside: Story = {
  args: { aside: summary, asideLabel: 'Resumo do dia' },
}

export const Collapsed: Story = {
  args: { defaultNavCollapsed: true },
}

export const WithFooter: Story = {
  args: {
    footer: (
      <Footer
        columns={[
          {
            title: 'Ajuda',
            links: [
              { label: 'Central de ajuda', href: '#ajuda' },
              { label: 'Status do serviço', href: 'https://status.example.com', external: true },
            ],
          },
          {
            title: 'Conta',
            links: [
              { label: 'Plano e faturas', href: '#plano' },
              { label: 'Equipe', href: '#equipe' },
            ],
          },
        ]}
        bottom={<span>© 2026 Aurora Commerce</span>}
      />
    ),
  },
}

/** Lê o estado com `useAppShell()` — útil para mostrar/ocultar o botão de menu ou outras ações. */
function ShellStatus() {
  const { isCompact, navCollapsed, navOpen } = useAppShell()
  return (
    <p style={{ color: 'var(--or-color-text-muted)' }}>
      {isCompact
        ? `Tela estreita · painel ${navOpen ? 'aberto' : 'fechado'}`
        : `Tela larga · barra ${navCollapsed ? 'recolhida' : 'expandida'}`}
    </p>
  )
}

export const WithHook: Story = {
  args: {
    children: (
      <>
        <PageHeader title="Configurações" description="Ajustes da loja e da equipe." divider />
        <ShellStatus />
      </>
    ),
  },
}

export const Contained: Story = {
  parameters: { layout: 'padded' },
  render: (args) => (
    <div style={{ height: 520, border: '1px solid var(--or-color-border)' }}>
      <AppShell {...args} fullHeight={false} />
    </div>
  ),
}
