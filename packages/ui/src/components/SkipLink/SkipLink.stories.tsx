import type { Meta, StoryObj } from '@storybook/react-vite'
import { SkipLink } from './SkipLink'

const meta = {
  title: 'Componentes/SkipLink',
  component: SkipLink,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Link de atalho que leva usuários de teclado direto ao conteúdo principal. Fica invisível até receber foco — clique na prévia e pressione Tab para vê-lo.',
      },
    },
  },
  argTypes: {
    href: { control: 'text' },
  },
  args: {
    href: '#story-main',
  },
  render: (args) => (
    <div style={{ position: 'relative', minHeight: 220, transform: 'translateZ(0)' }}>
      <SkipLink {...args} />
      <nav aria-label="Principal" style={{ display: 'flex', gap: 16, padding: 16 }}>
        <a href="#painel">Painel</a>
        <a href="#pedidos">Pedidos</a>
        <a href="#clientes">Clientes</a>
      </nav>
      <main id="story-main" style={{ padding: 16 }}>
        <h1 style={{ margin: 0 }}>Pedidos</h1>
        <p>Pressione Tab para revelar o atalho e Enter para pular a navegação.</p>
      </main>
    </div>
  ),
} satisfies Meta<typeof SkipLink>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const CustomLabel: Story = {
  args: { children: 'Pular para a lista de pedidos' },
}
