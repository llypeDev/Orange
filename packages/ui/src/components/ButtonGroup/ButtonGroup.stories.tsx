import type { Meta, StoryObj } from '@storybook/react-vite'
import { Icon } from '../../icons'
import { Button } from '../Button'
import { IconButton } from '../IconButton/IconButton'
import { ButtonGroup } from './ButtonGroup'

const meta = {
  title: 'Componentes/ButtonGroup',
  component: ButtonGroup,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Agrupa botões relacionados com `role="group"` e `aria-label`. `attached` cola os botões com bordas compartilhadas; `size`, `variant` e `disabled` são repassados aos filhos.',
      },
    },
  },
  argTypes: {
    orientation: { control: 'inline-radio', options: ['horizontal', 'vertical'] },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    variant: {
      control: 'select',
      options: [undefined, 'primary', 'secondary', 'outline', 'ghost', 'danger'],
    },
    attached: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
  args: {
    'aria-label': 'Ações do relatório',
    orientation: 'horizontal',
    attached: false,
    variant: 'outline',
  },
  render: (args) => (
    <ButtonGroup {...args}>
      <Button startIcon={<Icon name="download" />}>Exportar</Button>
      <Button startIcon={<Icon name="link" />}>Compartilhar</Button>
      <Button startIcon={<Icon name="trash" />}>Excluir</Button>
    </ButtonGroup>
  ),
} satisfies Meta<typeof ButtonGroup>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Attached: Story = {
  args: { attached: true },
}

export const AttachedPrimary: Story = {
  args: { attached: true, variant: 'primary', 'aria-label': 'Período' },
  render: (args) => (
    <ButtonGroup {...args}>
      <Button>Hoje</Button>
      <Button>7 dias</Button>
      <Button>30 dias</Button>
    </ButtonGroup>
  ),
}

export const Vertical: Story = {
  args: { orientation: 'vertical', attached: true, variant: 'ghost' },
}

export const WithIconButtons: Story = {
  args: { attached: true, 'aria-label': 'Zoom' },
  render: (args) => (
    <ButtonGroup {...args}>
      <IconButton icon="minus" label="Diminuir zoom" />
      <Button>100%</Button>
      <IconButton icon="plus" label="Aumentar zoom" />
    </ButtonGroup>
  ),
}

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'grid', gap: 16, justifyItems: 'start' }}>
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <ButtonGroup key={size} {...args} attached size={size}>
          <Button>Anterior</Button>
          <Button>Próximo</Button>
        </ButtonGroup>
      ))}
    </div>
  ),
}

export const Disabled: Story = {
  args: { disabled: true },
}
