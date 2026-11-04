import type { Meta, StoryObj } from '@storybook/react-vite'
import { CurrencyField } from './CurrencyField'

const meta = {
  title: 'Componentes/CurrencyField',
  component: CurrencyField,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Campo de valor monetário com `Intl.NumberFormat`: símbolo da moeda no campo, digitação natural (vírgula ou ponto) e formatação ao sair. Entrega um `number` ou `null`.',
      },
    },
  },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    currency: { control: 'select', options: ['BRL', 'USD', 'EUR', 'JPY', 'GBP'] },
    locale: { control: 'select', options: ['pt-BR', 'en-US', 'de-DE', 'ja-JP', 'en-GB'] },
    currencyDisplay: { control: 'inline-radio', options: ['symbol', 'narrowSymbol', 'code'] },
    disabled: { control: 'boolean' },
    onChange: { action: 'change' },
  },
  args: {
    label: 'Valor do produto',
    defaultValue: 1299.9,
    size: 'md',
  },
  decorators: [(Story) => <div style={{ maxWidth: 320 }}>{Story()}</div>],
} satisfies Meta<typeof CurrencyField>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Empty: Story = {
  args: {
    defaultValue: null,
    label: 'Valor da proposta',
    description: 'Use vírgula para os centavos.',
  },
}

export const OtherCurrencies: Story = {
  render: (args) => (
    <div style={{ display: 'grid', gap: 16 }}>
      <CurrencyField {...args} label="Dólar (en-US)" currency="USD" locale="en-US" />
      <CurrencyField {...args} label="Euro (de-DE)" currency="EUR" locale="de-DE" />
      <CurrencyField {...args} label="Iene (ja-JP)" currency="JPY" locale="ja-JP" />
    </div>
  ),
}

export const MinMax: Story = {
  args: { label: 'Valor do Pix', min: 1, max: 5000, description: 'Entre R$ 1,00 e R$ 5.000,00.' },
}

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'grid', gap: 16 }}>
      <CurrencyField {...args} size="sm" label="Pequeno" />
      <CurrencyField {...args} size="md" label="Médio" />
      <CurrencyField {...args} size="lg" label="Grande" />
    </div>
  ),
}

export const Invalid: Story = {
  args: { error: 'O valor excede o seu limite disponível.' },
}

export const Disabled: Story = {
  args: { disabled: true },
}
