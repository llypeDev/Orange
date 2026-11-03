import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { Icon } from '../../icons'
import { PasswordField, type PasswordFieldProps } from './PasswordField'

const meta = {
  title: 'Componentes/PasswordField',
  component: PasswordField,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Campo de senha com botão mostrar/ocultar (`aria-pressed`) e lista opcional de requisitos com estado acessível. Ao alternar com o mouse, o foco e o cursor permanecem no campo.',
      },
    },
  },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    onVisibleChange: { action: 'visibleChange' },
  },
  args: {
    label: 'Senha',
    size: 'md',
  },
  decorators: [(Story) => <div style={{ maxWidth: 420 }}>{Story()}</div>],
} satisfies Meta<typeof PasswordField>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithIcon: Story = {
  args: { startIcon: <Icon name="lock" />, required: true },
}

function RequirementsDemo(args: PasswordFieldProps) {
  const [value, setValue] = useState('')
  return (
    <PasswordField
      {...args}
      label="Crie uma senha"
      value={value}
      onValueChange={setValue}
      requirements={[
        { label: 'Pelo menos 8 caracteres', met: value.length >= 8 },
        { label: 'Uma letra maiúscula', met: /[A-Z]/.test(value) },
        { label: 'Um número', met: /\d/.test(value) },
        { label: 'Um símbolo (!@#…)', met: /[^A-Za-z0-9]/.test(value) },
      ]}
    />
  )
}

export const WithRequirements: Story = {
  render: (args) => <RequirementsDemo {...args} />,
}

export const Visible: Story = {
  args: { defaultVisible: true, defaultValue: 'laranja-2025' },
}

export const States: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 16 }}>
      <PasswordField label="Senha atual" error="Senha incorreta. Você tem mais 2 tentativas." defaultValue="123456" />
      <PasswordField label="Desabilitado" disabled defaultValue="segredo" />
    </div>
  ),
}
