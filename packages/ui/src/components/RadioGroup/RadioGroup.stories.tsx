import type { Meta, StoryObj } from '@storybook/react-vite'
import { Radio } from './Radio'
import { RadioGroup } from './RadioGroup'

const plans = [
  { value: 'gratis', label: 'Gratuito', description: 'Até 3 projetos e 1 GB.' },
  { value: 'pro', label: 'Pro — R$ 49/mês', description: 'Projetos ilimitados e 100 GB.' },
  { value: 'empresa', label: 'Empresa', description: 'SSO, auditoria e suporte dedicado.' },
]

const meta = {
  title: 'Componentes/RadioGroup',
  component: RadioGroup,
  subcomponents: { Radio },
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Escolha única entre poucas opções, com `<fieldset>`/`<legend>` e radios nativos: Tab entra no grupo e as setas mudam a seleção. A variante `card` mostra cada opção em um cartão com borda laranja quando selecionado.',
      },
    },
  },
  argTypes: {
    orientation: { control: 'inline-radio', options: ['vertical', 'horizontal'] },
    variant: { control: 'inline-radio', options: ['default', 'card'] },
    onChange: { action: 'change' },
  },
  args: {
    label: 'Escolha um plano',
    options: plans,
    defaultValue: 'pro',
    orientation: 'vertical',
    variant: 'default',
  },
} satisfies Meta<typeof RadioGroup>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Horizontal: Story = {
  args: {
    label: 'Tamanho',
    orientation: 'horizontal',
    defaultValue: 'm',
    options: ['P', 'M', 'G', 'GG'].map((s) => ({ value: s.toLowerCase(), label: s })),
  },
}

export const Cards: Story = {
  args: { variant: 'card', orientation: 'horizontal' },
}

export const WithChildren: Story = {
  render: () => (
    <RadioGroup label="Forma de entrega" description="O prazo começa a contar após a confirmação do pagamento." defaultValue="padrao">
      <Radio value="padrao" label="Padrão" description="5 a 8 dias úteis — grátis" />
      <Radio value="expressa" label="Expressa" description="1 a 2 dias úteis — R$ 24,90" />
      <Radio value="retirada" label="Retirar na loja" description="Indisponível para este CEP" disabled />
    </RadioGroup>
  ),
}

export const WithError: Story = {
  args: {
    defaultValue: null,
    required: true,
    error: 'Escolha um plano para continuar.',
  },
}

export const Disabled: Story = {
  args: { disabled: true },
}
