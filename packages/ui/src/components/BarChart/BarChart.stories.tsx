import type { Meta, StoryObj } from '@storybook/react-vite'
import { BarChart } from './BarChart'

const brl = { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 } as const

const canais = [
  { key: 'site', label: 'Site' },
  { key: 'app', label: 'App' },
  { key: 'loja', label: 'Lojas físicas' },
]

const vendas = [
  { label: 'jan', values: { site: 48200, app: 31500, loja: 22800 } },
  { label: 'fev', values: { site: 45100, app: 33900, loja: 21400 } },
  { label: 'mar', values: { site: 52700, app: 38200, loja: 23900 } },
  { label: 'abr', values: { site: 50300, app: 41800, loja: 22100 } },
  { label: 'mai', values: { site: 55900, app: 44600, loja: 24700 } },
  { label: 'jun', values: { site: 61200, app: 49300, loja: 26300 } },
]

const meta = {
  title: 'Componentes/BarChart',
  component: BarChart,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Gráfico de barras em SVG puro: compara quantidades entre categorias com eixo a partir de zero. Agrupado ou empilhado, vertical ou horizontal. Legenda com marcas, tabela de dados alternativa ("Ver dados") e exploração por teclado (setas, Home/End, Escape). Cores dos tokens `--or-color-viz-*`.',
      },
    },
  },
  argTypes: {
    orientation: { control: 'inline-radio', options: ['vertical', 'horizontal'] },
    layout: { control: 'inline-radio', options: ['grouped', 'stacked'] },
    variant: { control: 'inline-radio', options: ['outline', 'plain'] },
    showValues: { control: 'boolean' },
    hideCaption: { control: 'boolean' },
    height: { control: { type: 'number', min: 160, step: 20 } },
  },
  args: {
    title: 'Vendas por canal',
    description: 'R$ por mês · 1º semestre de 2026',
    source: 'Fonte: ERP de vendas (dados fictícios).',
    categoryLabel: 'Mês',
    valueFormat: brl,
    series: canais,
    data: vendas,
  },
} satisfies Meta<typeof BarChart>

export default meta
type Story = StoryObj<typeof meta>

export const Grouped: Story = {}

export const Stacked: Story = {
  args: {
    title: 'Receita por região',
    description: 'R$ por trimestre · 2026',
    layout: 'stacked',
    categoryLabel: 'Trimestre',
    series: [
      { key: 'sudeste', label: 'Sudeste' },
      { key: 'sul', label: 'Sul' },
      { key: 'nordeste', label: 'Nordeste' },
      { key: 'outras', label: 'Outras', color: 'var(--or-color-viz-other)' },
    ],
    data: [
      { label: '1º tri', values: { sudeste: 412000, sul: 168000, nordeste: 121000, outras: 64000 } },
      { label: '2º tri', values: { sudeste: 438000, sul: 175000, nordeste: 139000, outras: 71000 } },
      { label: '3º tri', values: { sudeste: 451000, sul: 182000, nordeste: 152000, outras: 69000 } },
    ],
    showValues: true,
  },
}

export const Horizontal: Story = {
  args: {
    title: 'Pedidos por categoria',
    description: 'Março de 2026 · unidades',
    orientation: 'horizontal',
    categoryLabel: 'Categoria',
    valueFormat: undefined,
    showValues: true,
    series: [{ key: 'pedidos', label: 'Pedidos' }],
    data: [
      { label: 'Eletrônicos e informática', values: { pedidos: 1284 } },
      { label: 'Casa e decoração', values: { pedidos: 962 } },
      { label: 'Moda e acessórios', values: { pedidos: 871 } },
      { label: 'Esporte e lazer', values: { pedidos: 455 } },
      { label: 'Livros', values: { pedidos: 318 } },
    ],
  },
}

export const Highlight: Story = {
  args: {
    title: 'Pedidos por mês',
    description: '1º semestre de 2026 · junho em destaque',
    valueFormat: undefined,
    series: [{ key: 'pedidos', label: 'Pedidos' }],
    highlight: 'jun',
    data: [312, 348, 401, 377, 452, 518].map((pedidos, i) => ({
      label: ['jan', 'fev', 'mar', 'abr', 'mai', 'jun'][i],
      values: { pedidos },
    })),
  },
}

export const NegativeValues: Story = {
  args: {
    title: 'Resultado por loja',
    description: 'R$ · março vs. fevereiro de 2026',
    categoryLabel: 'Loja',
    series: [
      { key: 'fev', label: 'Fevereiro' },
      { key: 'mar', label: 'Março' },
    ],
    data: [
      { label: 'Centro', values: { fev: 18400, mar: 21900 } },
      { label: 'Shopping', values: { fev: -3200, mar: 4100 } },
      { label: 'Aeroporto', values: { fev: 9800, mar: -1500 } },
      { label: 'Online', values: { fev: 26100, mar: 29400 } },
    ],
  },
}

export const Plain: Story = {
  args: { variant: 'plain', hideCaption: true, height: 220 },
  render: (args) => (
    <div style={{ maxWidth: 480, padding: 24, border: '1px solid var(--or-color-border)' }}>
      <BarChart {...args} />
    </div>
  ),
}
