import type { Meta, StoryObj } from '@storybook/react-vite'
import { iconNames } from '../../icons'
import { IconButton } from './IconButton'

const meta = {
  title: 'Componentes/IconButton',
  component: IconButton,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Botão quadrado só com ícone. `label` é obrigatório e vira o `aria-label`. Use para ações reconhecíveis pelo ícone (buscar, fechar, editar) — na dúvida, prefira um Button com texto.',
      },
    },
  },
  argTypes: {
    icon: { control: 'select', options: iconNames },
    variant: {
      control: 'inline-radio',
      options: ['primary', 'secondary', 'outline', 'ghost', 'danger'],
    },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    onClick: { action: 'click' },
  },
  args: {
    icon: 'search',
    label: 'Buscar',
    variant: 'ghost',
    size: 'md',
  },
} satisfies Meta<typeof IconButton>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Variants: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: 12 }}>
      <IconButton {...args} variant="primary" icon="plus" label="Novo projeto" />
      <IconButton {...args} variant="secondary" icon="edit" label="Editar" />
      <IconButton {...args} variant="outline" icon="download" label="Baixar" />
      <IconButton {...args} variant="ghost" icon="more-horizontal" label="Mais ações" />
      <IconButton {...args} variant="danger" icon="trash" label="Excluir" />
    </div>
  ),
}

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
      <IconButton {...args} variant="outline" size="sm" />
      <IconButton {...args} variant="outline" size="md" />
      <IconButton {...args} variant="outline" size="lg" />
    </div>
  ),
}

export const Loading: Story = {
  args: { loading: true, variant: 'outline', icon: 'refresh', label: 'Atualizar' },
}

export const Disabled: Story = {
  args: { disabled: true, variant: 'outline' },
}
