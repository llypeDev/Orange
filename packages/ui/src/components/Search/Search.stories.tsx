import type { Meta, StoryObj } from '@storybook/react-vite'
import { Search } from './Search'

const meta = {
  title: 'Componentes/Search',
  component: Search,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Campo de busca: `<form role="search">` com input `type="search"`, lupa, botão de limpar (devolve o foco ao campo) e envio por Enter. Escape limpa o texto.',
      },
    },
  },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    hideLabel: { control: 'boolean' },
    loading: { control: 'boolean' },
    debounce: { control: 'number' },
    onChange: { action: 'change' },
    onSearch: { action: 'search' },
    onClear: { action: 'clear' },
  },
  args: {
    label: 'Buscar produtos',
    placeholder: 'Buscar por nome, marca ou código',
    size: 'md',
  },
  decorators: [(Story) => <div style={{ maxWidth: 420 }}>{Story()}</div>],
} satisfies Meta<typeof Search>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const VisibleLabel: Story = {
  args: { hideLabel: false, label: 'Buscar pedidos', description: 'Número do pedido, e-mail ou CPF do cliente.' },
}

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'grid', gap: 16 }}>
      <Search {...args} size="sm" label="Busca pequena" />
      <Search {...args} size="md" label="Busca média" />
      <Search {...args} size="lg" label="Busca grande" />
    </div>
  ),
}

export const Debounced: Story = {
  args: { debounce: 400, label: 'Filtrar clientes', placeholder: 'Filtra enquanto você digita' },
}

export const Loading: Story = {
  args: { loading: true, defaultValue: 'cadeira gamer' },
}

export const Disabled: Story = {
  args: { disabled: true },
}
