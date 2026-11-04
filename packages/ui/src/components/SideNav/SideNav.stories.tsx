import type { Meta, StoryObj } from '@storybook/react-vite'
import { Icon } from '../../icons'
import { SideNav, SideNavGroup, SideNavItem, SideNavSection } from './SideNav'

const meta = {
  title: 'Componentes/SideNav',
  component: SideNav,
  subcomponents: { SideNavItem, SideNavGroup, SideNavSection } as Record<string, React.ComponentType<unknown>>,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Navegação lateral da aplicação: itens com ícone, rótulo e badge; grupos recolhíveis (`aria-expanded`/`aria-controls`); seções; item atual com `aria-current="page"` e barra laranja; modo `collapsed` só com ícones (rótulos continuam acessíveis).',
      },
    },
  },
  argTypes: {
    collapsed: { control: 'boolean' },
    collapsible: { control: 'boolean' },
    onCollapsedChange: { action: 'collapsedChange' },
  },
  args: {
    currentHref: '#checkout',
    collapsible: true,
  },
  render: (args) => (
    <div style={{ height: 560, display: 'flex' }}>
      <SideNav {...args} header={({ collapsed }) => <strong>{collapsed ? 'O' : 'Orange Labs'}</strong>}>
        <SideNavItem href="#inicio" icon={<Icon name="home" />}>
          Início
        </SideNavItem>
        <SideNavItem href="#caixa" icon={<Icon name="inbox" />} badge={12}>
          Caixa de entrada
        </SideNavItem>
        <SideNavGroup label="Projetos" icon={<Icon name="folder" />}>
          <SideNavItem href="#checkout">Checkout 2.0</SideNavItem>
          <SideNavItem href="#app">App mobile</SideNavItem>
          <SideNavItem href="#site">Site institucional</SideNavItem>
        </SideNavGroup>
        <SideNavGroup label="Relatórios" icon={<Icon name="chart-bar" />}>
          <SideNavItem href="#vendas">Vendas</SideNavItem>
          <SideNavItem href="#funil">Funil</SideNavItem>
        </SideNavGroup>
        <SideNavSection title="Conta">
          <SideNavItem href="#equipe" icon={<Icon name="users" />}>
            Equipe
          </SideNavItem>
          <SideNavItem href="#config" icon={<Icon name="sliders" />}>
            Configurações
          </SideNavItem>
        </SideNavSection>
      </SideNav>
    </div>
  ),
} satisfies Meta<typeof SideNav>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Collapsed: Story = {
  args: { defaultCollapsed: true },
}

export const WithoutToggle: Story = {
  args: { collapsible: false },
}
