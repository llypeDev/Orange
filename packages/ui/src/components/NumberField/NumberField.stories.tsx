import type { Meta, StoryObj } from '@storybook/react-vite'
import { NumberField } from './NumberField'

const meta = {
  title: 'Componentes/NumberField',
  component: NumberField,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Campo numérico no padrão spinbutton do WAI-ARIA: ↑/↓, PageUp/PageDown (×10), Home/End e botões − / +. Formata com `Intl.NumberFormat` no idioma do provider e trabalha com `number | null`.',
      },
    },
  },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    onChange: { action: 'change' },
  },
  args: {
    label: 'Quantidade',
    defaultValue: 1,
    min: 0,
    max: 99,
    step: 1,
    size: 'md',
  },
  decorators: [(Story) => <div style={{ maxWidth: 320 }}>{Story()}</div>],
} satisfies Meta<typeof NumberField>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Currency: Story = {
  args: {
    label: 'Preço de venda',
    defaultValue: 149.9,
    min: 0,
    max: undefined,
    step: 0.5,
    formatOptions: { style: 'currency', currency: 'BRL' },
  },
}

export const Percent: Story = {
  args: {
    label: 'Desconto',
    defaultValue: 0.1,
    min: 0,
    max: 1,
    step: 0.05,
    formatOptions: { style: 'percent' },
  },
}

export const WithSuffix: Story = {
  args: {
    label: 'Peso do pacote',
    defaultValue: 1.5,
    step: 0.1,
    suffix: 'kg',
    description: 'Use ponto ou vírgula para casas decimais.',
  },
}

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'grid', gap: 16 }}>
      <NumberField {...args} size="sm" label="Pequeno (sm)" />
      <NumberField {...args} size="md" label="Médio (md)" />
      <NumberField {...args} size="lg" label="Grande (lg)" />
    </div>
  ),
}

export const States: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 16 }}>
      <NumberField label="Com erro" defaultValue={0} min={1} error="O pedido mínimo é de 1 unidade." />
      <NumberField label="Somente leitura" defaultValue={12} readOnly />
      <NumberField label="Desabilitado" defaultValue={3} disabled />
      <NumberField label="Sem botões" defaultValue={42} hideStepper />
    </div>
  ),
}
