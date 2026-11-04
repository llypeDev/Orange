import type { Meta, StoryObj } from '@storybook/react-vite'
import { Stat, StatGroup } from './Stat'

const meta = {
  title: 'Componentes/Stat',
  component: Stat,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Métrica em destaque (Space Grotesk com tracking negativo) com rótulo, variação e ajuda. `StatGroup` organiza várias métricas em grade com divisórias de 1px, usando um único `<dl>`.',
      },
    },
  },
  argTypes: {
    trend: { control: 'inline-radio', options: ['increase', 'decrease', 'neutral'] },
    deltaTone: { control: 'inline-radio', options: [undefined, 'positive', 'negative', 'neutral'] },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    animate: { control: 'boolean' },
  },
  args: {
    label: 'Receita recorrente mensal',
    value: 'R$ 48,2 mil',
    delta: '12%',
    trend: 'increase',
    help: 'vs. mês anterior',
    size: 'md',
  },
} satisfies Meta<typeof Stat>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Decrease: Story = {
  args: { label: 'Ticket médio', value: 'R$ 182', delta: '3,1%', trend: 'decrease' },
}

export const InvertedTone: Story = {
  args: { label: 'Taxa de cancelamento', value: '2,4%', delta: '0,6 p.p.', trend: 'decrease', deltaTone: 'positive' },
}

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: 48, alignItems: 'flex-end' }}>
      <Stat {...args} size="sm" />
      <Stat {...args} size="md" />
      <Stat {...args} size="lg" />
    </div>
  ),
}

export const Group: Story = {
  render: () => (
    <StatGroup>
      <Stat label="Receita" value="R$ 48,2 mil" delta="12%" trend="increase" help="vs. setembro" />
      <Stat label="Pedidos" value="1.284" delta="4,3%" trend="increase" />
      <Stat label="Conversão" value="3,8%" delta="0,2 p.p." trend="decrease" />
      <Stat label="Tempo de resposta" value="1h 12min" delta="18%" trend="decrease" deltaTone="positive" />
    </StatGroup>
  ),
}

export const GroupLarge: Story = {
  render: () => (
    <StatGroup size="lg" columns={3}>
      <Stat label="Componentes acessíveis" value="60+" />
      <Stat label="Critérios WCAG 2.2 atendidos" value="AA" />
      <Stat label="Dependências de runtime" value="1" />
    </StatGroup>
  ),
}

export const Animated: Story = {
  render: () => (
    <StatGroup>
      <Stat animate label="Receita" value="R$ 48,2 mil" delta="12%" trend="increase" help="vs. setembro" />
      <Stat animate label="Pedidos" value={1284} delta="4,3%" trend="increase" />
      <Stat animate label="Tempo de resposta" value="1h 12min" delta="18%" trend="decrease" deltaTone="positive" />
    </StatGroup>
  ),
}
