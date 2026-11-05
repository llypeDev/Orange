import type { Meta, StoryObj } from '@storybook/react-vite'
import { Stat, StatGroup } from '../Stat'
import { Sparkline } from './Sparkline'

const meta = {
  title: 'Componentes/Sparkline',
  component: Sparkline,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Tendência em miniatura, em linha com o texto (Stat, tabelas, listas). Não interativa e sem eixos: o `label` obrigatório resume a tendência em palavras e é o texto alternativo. Linha no neutro e ponto final no acento.',
      },
    },
  },
  argTypes: {
    width: { control: { type: 'number', min: 40, step: 8 } },
    height: { control: { type: 'number', min: 16, step: 4 } },
    area: { control: 'boolean' },
    showEndPoint: { control: 'boolean' },
    showMinMax: { control: 'boolean' },
  },
  args: {
    data: [182, 176, 195, 201, 188, 214, 215],
    label: 'Vendas subiram 18% em 7 dias',
    width: 96,
    height: 28,
  },
} satisfies Meta<typeof Sparkline>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const MinMaxAndArea: Story = {
  args: { showMinMax: true, area: true, width: 160, height: 40 },
}

export const InStats: Story = {
  render: () => (
    <StatGroup>
      <Stat
        label="Vendas (7 dias)"
        value="R$ 215 mil"
        delta="18%"
        trend="increase"
        help={<Sparkline data={[182, 176, 195, 201, 188, 214, 215]} label="Vendas subiram 18% em 7 dias" />}
      />
      <Stat
        label="Pedidos (7 dias)"
        value={1284}
        delta="4%"
        trend="increase"
        help={<Sparkline data={[171, 180, 176, 189, 185, 190, 193]} label="Pedidos subiram 4% em 7 dias" />}
      />
      <Stat
        label="Cancelamentos"
        value="2,4%"
        delta="0,6 p.p."
        trend="decrease"
        deltaTone="positive"
        help={<Sparkline data={[3.0, 2.9, 2.8, 2.8, 2.6, 2.5, 2.4]} label="Cancelamentos caíram de 3% para 2,4% em 7 dias" />}
      />
    </StatGroup>
  ),
}
