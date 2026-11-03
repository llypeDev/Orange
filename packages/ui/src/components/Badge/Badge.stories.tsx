import type { Meta, StoryObj } from '@storybook/react-vite'
import { Icon } from '../../icons'
import { Button } from '../Button'
import { Badge } from './Badge'

const meta = {
  title: 'Componentes/Badge',
  component: Badge,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Indicador numérico ou ponto, inline ou sobreposto ao canto superior direito de outro elemento. Informe `label` com o texto completo ("3 notificações não lidas").',
      },
    },
  },
  argTypes: {
    tone: { control: 'inline-radio', options: ['accent', 'neutral', 'success', 'warning', 'danger', 'info'] },
    size: { control: 'inline-radio', options: ['sm', 'md'] },
    dot: { control: 'boolean' },
    count: { control: { type: 'number', min: 0 } },
  },
  args: {
    count: 3,
    max: 99,
    tone: 'accent',
    size: 'md',
    label: '3 notificações não lidas',
  },
} satisfies Meta<typeof Badge>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Tones: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: 12 }}>
      {(['accent', 'neutral', 'success', 'warning', 'danger', 'info'] as const).map((tone) => (
        <Badge key={tone} {...args} tone={tone} label={undefined} />
      ))}
    </div>
  ),
}

export const Max: Story = {
  args: { count: 240, label: 'Mais de 99 pedidos novos' },
}

export const Dot: Story = {
  args: { dot: true, tone: 'success', label: 'Online' },
}

export const OnButton: Story = {
  render: (args) => (
    <Badge {...args}>
      <Button variant="outline" iconOnly aria-label="Notificações" startIcon={<Icon name="bell" />} />
    </Badge>
  ),
}

export const DotOnIcon: Story = {
  args: { dot: true, label: 'Há mensagens novas' },
  render: (args) => (
    <Badge {...args}>
      <Button variant="ghost" iconOnly aria-label="Mensagens" startIcon={<Icon name="mail" />} />
    </Badge>
  ),
}
