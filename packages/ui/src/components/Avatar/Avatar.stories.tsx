import type { Meta, StoryObj } from '@storybook/react-vite'
import { Avatar } from './Avatar'

const photo =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80"><rect width="80" height="80" fill="#2a2a30"/><circle cx="40" cy="31" r="14" fill="#f58549"/><rect x="16" y="52" width="48" height="28" fill="#f58549"/></svg>',
  )

const meta = {
  title: 'Componentes/Avatar',
  component: Avatar,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Representa uma pessoa ou organização com foto, iniciais (derivadas do `name`) ou ícone. A cor de fundo é determinística pelo nome e o status de presença tem texto acessível.',
      },
    },
  },
  argTypes: {
    size: { control: 'inline-radio', options: ['xs', 'sm', 'md', 'lg', 'xl'] },
    shape: { control: 'inline-radio', options: ['square', 'circle'] },
    status: { control: 'select', options: [undefined, 'online', 'away', 'busy', 'offline'] },
    pulse: { control: 'boolean' },
  },
  args: {
    name: 'Mariana Lopes',
    size: 'md',
    shape: 'square',
  },
} satisfies Meta<typeof Avatar>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithImage: Story = {
  args: { src: photo, alt: 'Foto de Mariana Lopes' },
}

export const BrokenImage: Story = {
  args: { src: '/nao-existe.jpg', name: 'Rafael Costa' },
}

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: 16, alignItems: 'flex-end' }}>
      {(['xs', 'sm', 'md', 'lg', 'xl'] as const).map((size) => (
        <Avatar key={size} {...args} size={size} />
      ))}
    </div>
  ),
}

export const Shapes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: 16 }}>
      <Avatar {...args} shape="square" />
      <Avatar {...args} shape="circle" />
    </div>
  ),
}

export const Status: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: 16 }}>
      <Avatar {...args} name="Ana Souza" status="online" />
      <Avatar {...args} name="Bruno Lima" status="away" />
      <Avatar {...args} name="Carla Dias" status="busy" />
      <Avatar {...args} name="Diego Alves" status="offline" />
    </div>
  ),
}

export const Fallbacks: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 16 }}>
      {['Beatriz Nunes', 'Thiago Rocha', 'Lívia Martins', 'Pedro Henrique', 'Sofia Ramos', 'Orange Labs'].map((n) => (
        <Avatar key={n} name={n} />
      ))}
      <Avatar alt="Convidado" />
    </div>
  ),
}

export const Pulse: Story = {
  args: { status: 'online', pulse: true, shape: 'circle', size: 'lg' },
}
