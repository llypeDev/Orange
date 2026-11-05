import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from '../Button'
import { Paper } from '../Paper'
import { Switch } from '../Switch'
import { Stack } from './Stack'

const blocks = ['Dados da loja', 'Pagamento', 'Entrega']

const meta = {
  title: 'Componentes/Stack',
  component: Stack,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Layout em uma dimensão: empilha os filhos na vertical ou na horizontal com `gap` da escala de espaço. `direction` e `gap` aceitam valores por breakpoint (`{ base, sm, md, lg, xl }`). Não há `reverse`: a ordem visual é sempre a do DOM (WCAG 1.3.2).',
      },
    },
  },
  argTypes: {
    as: { control: 'select', options: ['div', 'section', 'ul', 'ol', 'nav'] },
    direction: { control: 'inline-radio', options: ['vertical', 'horizontal'] },
    gap: { control: 'select', options: [0, 1, 2, 3, 4, 5, 6, 8, 10, 12, 16] },
    align: { control: 'inline-radio', options: ['start', 'center', 'end', 'stretch', 'baseline'] },
    justify: {
      control: 'inline-radio',
      options: ['start', 'center', 'end', 'between', 'around', 'evenly'],
    },
    wrap: { control: 'boolean' },
    separator: { control: 'boolean' },
  },
  args: {
    direction: 'vertical',
    gap: 4,
    align: 'stretch',
    justify: 'start',
    wrap: false,
    separator: false,
  },
  render: (args) => (
    <Stack {...args}>
      {blocks.map((label) => (
        <Paper key={label} padding={4}>
          {label}
        </Paper>
      ))}
    </Stack>
  ),
} satisfies Meta<typeof Stack>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Horizontal: Story = {
  args: { direction: 'horizontal', align: 'center', gap: 3 },
}

/** Empilhado no celular, em linha a partir de 768px (redimensione a janela). */
export const ResponsiveDirection: Story = {
  args: { direction: { base: 'vertical', md: 'horizontal' }, gap: { base: 3, md: 6 } },
}

export const Separators: Story = {
  args: { as: 'ul', separator: true, gap: 4, 'aria-label': 'Notificações' },
  render: (args) => (
    <Stack {...args} style={{ maxWidth: 480 }}>
      <li>
        <Switch label="Resumo semanal por e-mail" defaultChecked />
      </li>
      <li>
        <Switch label="Alertas de estoque baixo" />
      </li>
      <li>
        <Switch label="Novidades do produto" />
      </li>
    </Stack>
  ),
}

export const HorizontalSeparators: Story = {
  args: { direction: 'horizontal', separator: true, gap: 3, align: 'center' },
  render: (args) => (
    <Stack {...args}>
      <span>12 itens</span>
      <span>Atualizado há 5 min</span>
      <span>Visível para a equipe</span>
    </Stack>
  ),
}

export const Toolbar: Story = {
  args: { direction: 'horizontal', justify: 'between', align: 'center', wrap: true, gap: 3 },
  render: (args) => (
    <Stack {...args}>
      <strong>3 pedidos selecionados</strong>
      <Stack direction="horizontal" gap={2}>
        <Button variant="outline" size="sm">
          Exportar
        </Button>
        <Button size="sm">Marcar como enviados</Button>
      </Stack>
    </Stack>
  ),
}
