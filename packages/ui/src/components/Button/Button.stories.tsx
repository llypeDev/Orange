import type { Meta, StoryObj } from '@storybook/react-vite'
import { Icon } from '../../icons'
import { Button } from './Button'

const meta = {
  title: 'Componentes/Button',
  component: Button,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Botões disparam ações (salvar, enviar, excluir). Para navegação, use `Link`. Use apenas um botão `primary` por contexto.',
      },
    },
  },
  argTypes: {
    variant: { control: 'inline-radio', options: ['primary', 'secondary', 'outline', 'ghost', 'danger'] },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    onClick: { action: 'click' },
  },
  args: {
    children: 'Começar agora',
    variant: 'primary',
    size: 'md',
  },
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = {}

export const Variants: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
      <Button {...args} variant="primary">
        Primary
      </Button>
      <Button {...args} variant="secondary">
        Secondary
      </Button>
      <Button {...args} variant="outline">
        Outline
      </Button>
      <Button {...args} variant="ghost">
        Ghost
      </Button>
      <Button {...args} variant="danger">
        Danger
      </Button>
    </div>
  ),
}

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: 12, alignItems: 'flex-end' }}>
      <Button {...args} size="sm">
        Small
      </Button>
      <Button {...args} size="md">
        Medium
      </Button>
      <Button {...args} size="lg">
        Large
      </Button>
    </div>
  ),
}

export const WithIcons: Story = {
  args: {
    children: 'Agendar demonstração',
    endIcon: <Icon name="arrow-right" />,
  },
}

export const IconOnly: Story = {
  args: {
    children: undefined,
    iconOnly: true,
    variant: 'outline',
    'aria-label': 'Buscar',
    startIcon: <Icon name="search" />,
  },
}

export const Loading: Story = {
  args: { loading: true, loadingText: 'Salvando alterações' },
}

export const Disabled: Story = {
  args: { disabled: true },
}

export const Block: Story = {
  args: { block: true },
}
