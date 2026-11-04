import type { Meta, StoryObj } from '@storybook/react-vite'
import { Select } from './Select'

const estados = [
  { value: 'ba', label: 'Bahia' },
  { value: 'mg', label: 'Minas Gerais' },
  { value: 'pr', label: 'Paraná' },
  { value: 'rj', label: 'Rio de Janeiro' },
  { value: 'rs', label: 'Rio Grande do Sul' },
  { value: 'sp', label: 'São Paulo' },
]

const meta = {
  title: 'Componentes/Select',
  component: Select,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Lista suspensa baseada no `<select>` nativo: teclado, leitores de tela e foco prontos. Onde o navegador suporta o select customizável (`appearance: base-select`), a lista aberta também ganha o visual do Orange; nos demais, abre o seletor do sistema. Use para escolher uma opção entre poucas; para listas longas com busca, use `Combobox`.',
      },
    },
  },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    disabled: { control: 'boolean' },
    required: { control: 'boolean' },
    onChange: { action: 'change' },
  },
  args: {
    label: 'Estado',
    placeholder: 'Selecione um estado',
    options: estados,
    size: 'md',
  },
  decorators: [(Story) => <div style={{ maxWidth: 360 }}>{Story()}</div>],
} satisfies Meta<typeof Select>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithDescription: Story = {
  args: { description: 'Usado para calcular o frete.' },
}

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'grid', gap: 16 }}>
      <Select {...args} size="sm" label="Pequeno" />
      <Select {...args} size="md" label="Médio" />
      <Select {...args} size="lg" label="Grande" />
    </div>
  ),
}

export const Groups: Story = {
  args: {
    label: 'Plano',
    placeholder: 'Escolha um plano',
    options: [
      {
        label: 'Mensal',
        options: [
          { value: 'starter-m', label: 'Starter — R$ 49/mês' },
          { value: 'pro-m', label: 'Pro — R$ 129/mês' },
        ],
      },
      {
        label: 'Anual (2 meses grátis)',
        options: [
          { value: 'starter-a', label: 'Starter — R$ 490/ano' },
          { value: 'pro-a', label: 'Pro — R$ 1.290/ano' },
          { value: 'enterprise', label: 'Enterprise — sob consulta', disabled: true },
        ],
      },
    ],
  },
}

export const NativeChildren: Story = {
  args: { options: undefined, placeholder: undefined, label: 'Moeda' },
  render: (args) => (
    <Select {...args}>
      <option value="brl">Real (BRL)</option>
      <option value="usd">Dólar (USD)</option>
      <option value="eur">Euro (EUR)</option>
    </Select>
  ),
}

export const Required: Story = {
  args: { required: true, error: 'Selecione o estado para continuar.' },
}

export const Disabled: Story = {
  args: { disabled: true, defaultValue: 'sp', placeholder: undefined },
}
