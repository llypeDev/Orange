import type { Meta, StoryObj } from '@storybook/react-vite'
import { LineChart } from './LineChart'

const brl = { style: 'currency', currency: 'BRL' } as const
const meses = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez']

const meta = {
  title: 'Componentes/LineChart',
  component: LineChart,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Gráfico de linhas em SVG puro para evolução no tempo. Cada série tem cor, traço e marcador próprios; `null` interrompe a linha. Tabela de dados alternativa, dica com cruz vertical e exploração por teclado. As linhas se desenham uma vez ao entrar na tela.',
      },
    },
  },
  argTypes: {
    area: { control: 'boolean' },
    endLabels: { control: 'boolean' },
    includeZero: { control: 'boolean' },
    variant: { control: 'inline-radio', options: ['outline', 'plain'] },
    hideCaption: { control: 'boolean' },
    height: { control: { type: 'number', min: 160, step: 20 } },
  },
  args: {
    title: 'Ticket médio por canal',
    description: 'R$ por pedido · 1º semestre de 2026',
    source: 'Fonte: painel de vendas (dados fictícios).',
    categoryLabel: 'Mês',
    valueFormat: brl,
    series: [
      { key: 'site', label: 'Site' },
      { key: 'app', label: 'App' },
    ],
    data: [
      { label: 'jan', values: { site: 152.4, app: 131.9 } },
      { label: 'fev', values: { site: 158.1, app: 136.2 } },
      { label: 'mar', values: { site: 149.7, app: 141.0 } },
      { label: 'abr', values: { site: 163.2, app: 146.5 } },
      { label: 'mai', values: { site: 171.0, app: 152.8 } },
      { label: 'jun', values: { site: 168.4, app: 159.3 } },
    ],
  },
} satisfies Meta<typeof LineChart>

export default meta
type Story = StoryObj<typeof meta>

export const TwoSeries: Story = {}

export const AreaSingleSeries: Story = {
  args: {
    title: 'Receita mensal',
    description: 'R$ · 2026',
    area: true,
    valueFormat: { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 },
    series: [{ key: 'receita', label: 'Receita' }],
    data: [184000, 176500, 195300, 201800, 188900, 214600, 221300, 219800, 232400, 241100, 255900, 268700].map(
      (receita, i) => ({ label: meses[i], values: { receita } }),
    ),
  },
}

export const WithGaps: Story = {
  args: {
    title: 'Pedidos por dia',
    description: 'Unidades · a integração do marketplace ficou fora do ar na quarta',
    valueFormat: undefined,
    categoryLabel: 'Dia',
    series: [
      { key: 'site', label: 'Site' },
      { key: 'marketplace', label: 'Marketplace' },
    ],
    data: [
      { label: 'seg', values: { site: 214, marketplace: 120 } },
      { label: 'ter', values: { site: 231, marketplace: 134 } },
      { label: 'qua', values: { site: 226, marketplace: null } },
      { label: 'qui', values: { site: 248, marketplace: 141 } },
      { label: 'sex', values: { site: 273, marketplace: 158 } },
      { label: 'sáb', values: { site: 301, marketplace: 176 } },
      { label: 'dom', values: { site: 262, marketplace: 149 } },
    ],
  },
}

export const FiveSeries: Story = {
  args: {
    title: 'Conversão por origem',
    description: '% das visitas que viraram pedido · 2026',
    valueFormat: { style: 'percent', maximumFractionDigits: 1 },
    categoryLabel: 'Mês',
    series: [
      { key: 'busca', label: 'Busca orgânica' },
      { key: 'email', label: 'E-mail' },
      { key: 'social', label: 'Redes sociais' },
      { key: 'anuncios', label: 'Anúncios' },
      { key: 'direto', label: 'Direto' },
    ],
    data: meses.slice(0, 6).map((label, i) => ({
      label,
      values: {
        busca: 0.031 + i * 0.001,
        email: 0.052 - i * 0.0015,
        social: 0.012 + i * 0.0008,
        anuncios: 0.024 + (i % 2) * 0.003,
        direto: 0.041 + i * 0.0012,
      },
    })),
  },
}
