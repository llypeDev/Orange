import type { Meta, StoryObj } from '@storybook/react-vite'
import { TextField } from '../TextField'
import { Fieldset } from './Fieldset'

const meta = {
  title: 'Componentes/Fieldset',
  component: Fieldset,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Agrupa campos relacionados com `<fieldset>` e `<legend>` nativos. A legenda é anunciada ao entrar no grupo e `disabled` desabilita todos os controles internos.',
      },
    },
  },
  argTypes: {
    gap: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    disabled: { control: 'boolean' },
  },
  args: {
    legend: 'Endereço de entrega',
    description: 'Enviaremos o pedido para este endereço.',
    gap: 'md',
  },
  render: (args) => (
    <Fieldset {...args}>
      <TextField label="CEP" inputMode="numeric" maxLength={9} style={{ maxWidth: 200 }} />
      <TextField label="Rua" />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 16 }}>
        <TextField label="Número" />
        <TextField label="Complemento" optional />
      </div>
    </Fieldset>
  ),
  decorators: [(Story) => <div style={{ maxWidth: 520 }}>{Story()}</div>],
} satisfies Meta<typeof Fieldset>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Gaps: Story = {
  render: (args) => (
    <div style={{ display: 'grid', gap: 40 }}>
      {(['sm', 'md', 'lg'] as const).map((gap) => (
        <Fieldset key={gap} {...args} legend={`Espaçamento ${gap}`} description={undefined} gap={gap}>
          <TextField label="Nome" />
          <TextField label="E-mail" type="email" />
        </Fieldset>
      ))}
    </div>
  ),
}

export const WithError: Story = {
  args: {
    legend: 'Contato',
    description: 'Informe pelo menos um meio de contato.',
    error: 'Preencha o e-mail ou o telefone.',
  },
  render: (args) => (
    <Fieldset {...args}>
      <TextField label="E-mail" type="email" invalid />
      <TextField label="Telefone" type="tel" invalid />
    </Fieldset>
  ),
}

export const Disabled: Story = {
  args: { disabled: true },
}
