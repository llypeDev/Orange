import type { Meta, StoryObj } from '@storybook/react-vite'
import { DonutChart } from './DonutChart'

const brl = { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 } as const

const meta = {
  title: 'Componentes/DonutChart',
  component: DonutChart,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Gráfico de rosca em SVG puro para a participação de cada parte num todo. Total no centro, legenda com valor e percentual (arredondados para somar 100%), tabela de dados alternativa ("Ver dados") e exploração por teclado (setas, Home/End, Escape). Cores dos tokens `--or-color-viz-*`, até cinco fatias + "Outros".',
      },
    },
  },
  argTypes: {
    variant: { control: 'inline-radio', options: ['outline', 'plain'] },
    hideCaption: { control: 'boolean' },
    height: { control: { type: 'number', min: 120, step: 20 } },
    centerLabel: { control: 'text' },
  },
  args: {
    title: 'Vendas por canal',
    description: 'R$ · março de 2026',
    source: 'Fonte: ERP de vendas (dados fictícios).',
    categoryLabel: 'Canal',
    valueFormat: brl,
    data: [
      { label: 'Site', value: 48200 },
      { label: 'App', value: 39800 },
      { label: 'Lojas físicas', value: 24400 },
      { label: 'Marketplace', value: 12200 },
      { label: 'Outros', value: 3800, color: 'var(--or-color-viz-other)' },
    ],
  },
} satisfies Meta<typeof DonutChart>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const TicketsByStatus: Story = {
  args: {
    title: 'Tickets por status',
    description: 'Suporte · semana 44 de 2026',
    source: 'Fonte: central de atendimento (dados fictícios).',
    categoryLabel: 'Status',
    centerLabel: 'tickets',
    valueFormat: undefined,
    summary: 'Seis em cada dez tickets da semana já foram resolvidos; 42 seguem abertos.',
    data: [
      { label: 'Resolvidos', value: 118 },
      { label: 'Em andamento', value: 31 },
      { label: 'Abertos', value: 42 },
      { label: 'Aguardando cliente', value: 9 },
    ],
  },
}

export const SingleSlice: Story = {
  args: {
    title: 'Pedidos entregues no prazo',
    description: 'Outubro de 2026',
    centerLabel: 'pedidos',
    valueFormat: undefined,
    data: [{ label: 'No prazo', value: 1284 }],
  },
}

export const Empty: Story = {
  args: {
    title: 'Devoluções por motivo',
    description: 'Novembro de 2026',
    data: [],
  },
}

export const Plain: Story = {
  args: { variant: 'plain', hideCaption: true, height: 160 },
  render: (args) => (
    <div style={{ maxWidth: 480, padding: 24, border: '1px solid var(--or-color-border)' }}>
      <DonutChart {...args} />
    </div>
  ),
}
