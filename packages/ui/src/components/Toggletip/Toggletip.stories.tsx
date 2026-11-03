import type { Meta, StoryObj } from '@storybook/react-vite'
import { Toggletip } from './Toggletip'

const meta = {
  title: 'Componentes/Toggletip',
  component: Toggletip,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Botão de informação que abre/fecha uma bolha com uma explicação curta. O conteúdo é inserido numa região `aria-live="polite"` e anunciado sem mover o foco (padrão do Inclusive Components). Fecha com Escape, clique fora ou ao focar outro controle.',
      },
    },
  },
  argTypes: {
    placement: { control: 'select', options: ['top', 'right', 'bottom', 'left'] },
    size: { control: 'inline-radio', options: ['sm', 'md'] },
    onOpenChange: { action: 'openChange' },
  },
  args: {
    label: 'Sobre a taxa de conversão',
    content: 'Visitantes que concluíram uma compra, divididos pelo total de visitantes no período.',
    placement: 'top',
    size: 'sm',
  },
} satisfies Meta<typeof Toggletip>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '64px 0' }}>
      <strong>Taxa de conversão</strong>
      <Toggletip {...args} />
    </div>
  ),
}

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '64px 0' }}>
      <Toggletip {...args} size="sm" />
      <Toggletip {...args} size="md" />
    </div>
  ),
}
