import type { Meta, StoryObj } from '@storybook/react-vite'
import { Icon } from '../../icons'
import { BottomNavigation, type BottomNavigationItem } from './BottomNavigation'

const items: BottomNavigationItem[] = [
  { value: 'inicio', label: 'Início', icon: <Icon name="home" /> },
  { value: 'buscar', label: 'Buscar', icon: <Icon name="search" /> },
  { value: 'pedidos', label: 'Pedidos', icon: <Icon name="inbox" />, badge: 3, badgeLabel: '3 em andamento' },
  { value: 'favoritos', label: 'Favoritos', icon: <Icon name="heart" /> },
  { value: 'conta', label: 'Conta', icon: <Icon name="user" />, badge: true, badgeLabel: 'novidades' },
]

const meta = {
  title: 'Componentes/BottomNavigation',
  component: BottomNavigation,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Barra inferior para mobile com 3–5 destinos (ícone + rótulo sempre visível). Destino ativo com `aria-current="page"` e indicador laranja no topo; alvos de 56px.',
      },
    },
  },
  argTypes: {
    onChange: { action: 'change' },
    fixed: { control: 'boolean' },
  },
  args: {
    items,
    defaultValue: 'inicio',
    fixed: false,
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 420, margin: '24px auto', border: '1px solid var(--or-color-border)' }}>
        <div style={{ height: 240, padding: 16 }}>Conteúdo da tela</div>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof BottomNavigation>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const ThreeItems: Story = {
  args: { items: items.slice(0, 3), defaultValue: 'buscar' },
}

export const AsLinks: Story = {
  args: { items: items.map((item) => ({ ...item, href: `#${item.value}` })) },
}
