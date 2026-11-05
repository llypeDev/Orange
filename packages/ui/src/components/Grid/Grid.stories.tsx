import type { Meta, StoryObj } from '@storybook/react-vite'
import { Paper } from '../Paper'
import { Stat } from '../Stat'
import { Grid, GridItem } from './Grid'

const produtos = [
  'Cadeira Flex',
  'Mesa Atlas',
  'Luminária Arco',
  'Estante Modular',
  'Gaveteiro Slim',
  'Apoio de pés',
]

const meta = {
  title: 'Componentes/Grid',
  component: Grid,
  subcomponents: { GridItem },
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Layout em duas dimensões: `columns` fixo (ou por breakpoint) ou `minItemWidth` para colunas automáticas sem media queries. `variant="bordered"` desenha linhas de 1px entre as células. `GridItem` ocupa várias colunas com `span`.',
      },
    },
  },
  argTypes: {
    as: { control: 'select', options: ['div', 'section', 'ul', 'dl'] },
    columns: { control: { type: 'number', min: 1, max: 12 } },
    minItemWidth: { control: 'text' },
    gap: { control: 'select', options: [0, 1, 2, 3, 4, 5, 6, 8, 10, 12, 16] },
    variant: { control: 'inline-radio', options: ['plain', 'bordered'] },
  },
  args: {
    columns: 3,
    gap: 4,
    variant: 'plain',
  },
  render: (args) => (
    <Grid {...args}>
      {produtos.map((nome) => (
        <Paper key={nome} padding={4}>
          {nome}
        </Paper>
      ))}
    </Grid>
  ),
} satisfies Meta<typeof Grid>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

/** 1 coluna no celular, 2 a partir de 640px e 3 a partir de 1024px. */
export const ResponsiveColumns: Story = {
  args: { columns: { base: 1, sm: 2, lg: 3 } },
}

/** Quantas colunas couberem com pelo menos 12rem cada — sem media queries. */
export const AutoFit: Story = {
  args: { columns: undefined, minItemWidth: '12rem' },
}

/** Linhas de 1px entre as células, como as grades de números do zop.dev. Funciona com linhas incompletas. */
export const Bordered: Story = {
  args: { variant: 'bordered', columns: { base: 1, sm: 2, lg: 4 }, gap: 6 },
  render: (args) => (
    <Grid {...args}>
      <Stat label="Receita do mês" value="R$ 48,2 mil" delta="12%" trend="increase" />
      <Stat label="Pedidos" value="1.284" delta="4%" trend="increase" />
      <Stat label="Ticket médio" value="R$ 37,50" delta="2%" trend="decrease" />
      <Stat
        label="Taxa de devolução"
        value="1,8%"
        delta="0,3 p.p."
        trend="decrease"
        deltaTone="positive"
      />
      <Stat label="Avaliação média" value="4,7" />
    </Grid>
  ),
}

export const Spans: Story = {
  args: { columns: { base: 1, md: 3 } },
  render: (args) => (
    <Grid {...args}>
      <GridItem span="full">
        <Paper padding={4}>Resumo do trimestre (linha inteira)</Paper>
      </GridItem>
      <GridItem span={{ base: 1, md: 2 }}>
        <Paper padding={4}>Vendas por canal (2 colunas)</Paper>
      </GridItem>
      <Paper padding={4}>Pedidos recentes</Paper>
    </Grid>
  ),
}

export const AsList: Story = {
  args: { as: 'ul', columns: { base: 2, md: 3 }, 'aria-label': 'Categorias' },
  render: (args) => (
    <Grid {...args}>
      {['Escritório', 'Iluminação', 'Armazenamento', 'Acessórios', 'Ergonomia'].map((c) => (
        <Paper as="li" key={c} padding={4}>
          {c}
        </Paper>
      ))}
    </Grid>
  ),
}
