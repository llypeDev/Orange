import type { Meta, StoryObj } from '@storybook/react-vite'
import { Avatar } from '../Avatar'
import { AvatarGroup } from './AvatarGroup'

const team = ['Mariana Lopes', 'Rafael Costa', 'Beatriz Nunes', 'Diego Almeida', 'Lívia Martins', 'Thiago Rocha', 'Sofia Ramos']

const meta = {
  title: 'Componentes/AvatarGroup',
  component: AvatarGroup,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Avatares sobrepostos em uma lista rotulada (`role="list"`). Use `max` para limitar os visíveis; o excedente vira um contador "+N" com nome acessível.',
      },
    },
  },
  argTypes: {
    size: { control: 'inline-radio', options: ['xs', 'sm', 'md', 'lg', 'xl'] },
    shape: { control: 'inline-radio', options: ['square', 'circle'] },
    max: { control: { type: 'number', min: 1 } },
  },
  args: {
    label: 'Pessoas com acesso ao projeto',
    size: 'md',
    shape: 'square',
    max: 4,
  },
  render: (args) => (
    <AvatarGroup {...args}>
      {team.map((name) => (
        <Avatar key={name} name={name} />
      ))}
    </AvatarGroup>
  ),
} satisfies Meta<typeof AvatarGroup>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Circle: Story = {
  args: { shape: 'circle', size: 'lg' },
}

export const WithTotal: Story = {
  args: { max: undefined, total: 128, size: 'sm' },
  render: (args) => (
    <AvatarGroup {...args}>
      {team.slice(0, 5).map((name) => (
        <Avatar key={name} name={name} />
      ))}
    </AvatarGroup>
  ),
}

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'grid', gap: 16 }}>
      {(['xs', 'sm', 'md', 'lg', 'xl'] as const).map((size) => (
        <AvatarGroup key={size} {...args} size={size} label={`Equipe (${size})`}>
          {team.map((name) => (
            <Avatar key={name} name={name} />
          ))}
        </AvatarGroup>
      ))}
    </div>
  ),
}
