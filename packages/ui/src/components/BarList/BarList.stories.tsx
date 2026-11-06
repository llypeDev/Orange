import type { Meta, StoryObj } from '@storybook/react-vite'
import { BarList } from './BarList'

const paginas = [
  { label: 'Página inicial', value: 12480 },
  { label: '/produtos', value: 8930 },
  { label: '/blog/como-emitir-nota-fiscal', value: 5210 },
  { label: '/precos', value: 3120 },
  { label: '/contato', value: 1460 },
  { label: '/carreiras', value: 980 },
  { label: '/ajuda/trocas-e-devolucoes', value: 640 },
]

const meta = {
  title: 'Componentes/BarList',
  component: BarList,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Ranking em barras horizontais: uma lista (`ul`) em que cada item traz rótulo, valor e uma barra proporcional ao maior valor. Ordena do maior para o menor por padrão, linhas com `href` são links inteiros e `limit` mostra os primeiros com "Mostrar todos (N)". As barras crescem uma vez ao entrar na tela.',
      },
    },
  },
  argTypes: {
    sort: { control: 'inline-radio', options: ['desc', 'asc', 'none'] },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    limit: { control: { type: 'number', min: 0, step: 1 } },
    color: { control: 'text' },
  },
  args: {
    'aria-label': 'Páginas mais visitadas',
    data: paginas,
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 480 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof BarList>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithLinks: Story = {
  args: {
    data: paginas.map((p) => ({ ...p, href: `#${p.label === 'Página inicial' ? '/' : p.label}` })),
  },
}

export const Limit: Story = {
  args: { limit: 4 },
}

export const Currency: Story = {
  args: {
    'aria-label': 'Produtos mais vendidos',
    valueFormat: { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 },
    data: [
      { label: 'Tênis de corrida Leve 3', value: 84200 },
      { label: 'Mochila urbana 22 L', value: 51900 },
      { label: 'Garrafa térmica 1 L', value: 38400 },
      { label: 'Jaqueta corta-vento', value: 27100 },
      { label: 'Meias de compressão (par)', value: 12800 },
    ],
  },
}

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'grid', gap: 32 }}>
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <BarList
          key={size}
          {...args}
          aria-label={`Páginas mais visitadas (${size})`}
          size={size}
          limit={3}
        />
      ))}
    </div>
  ),
}

export const Accent: Story = {
  args: { color: 'var(--or-color-accent)', limit: 5 },
}
