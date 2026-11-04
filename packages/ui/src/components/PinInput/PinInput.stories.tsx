import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { PinInput } from './PinInput'

const meta = {
  title: 'Componentes/PinInput',
  component: PinInput,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Campos de um caractere para códigos de verificação (OTP) e PINs. Avança sozinho, aceita colar o código inteiro e o preenchimento automático do SMS (`autocomplete="one-time-code"`).',
      },
    },
  },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    type: { control: 'inline-radio', options: ['numeric', 'alphanumeric'] },
    length: { control: { type: 'number', min: 3, max: 10 } },
    mask: { control: 'boolean' },
    disabled: { control: 'boolean' },
    onChange: { action: 'change' },
    onComplete: { action: 'complete' },
  },
  args: {
    label: 'Código de verificação',
    description: 'Enviamos um código de 6 dígitos para (11) •••• 4821.',
    length: 6,
    size: 'md',
  },
} satisfies Meta<typeof PinInput>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Grouped: Story = {
  args: { groupSize: 3 },
}

export const Masked: Story = {
  args: { label: 'PIN do cartão', description: undefined, length: 4, mask: true },
}

export const Alphanumeric: Story = {
  args: {
    label: 'Código do cupom',
    description: undefined,
    type: 'alphanumeric',
    length: 8,
    groupSize: 4,
  },
}

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'grid', gap: 20 }}>
      <PinInput {...args} size="sm" label="Pequeno" description={undefined} />
      <PinInput {...args} size="md" label="Médio" description={undefined} />
      <PinInput {...args} size="lg" label="Grande" description={undefined} />
    </div>
  ),
}

export const Invalid: Story = {
  args: { defaultValue: '123456', error: 'Código incorreto. Restam 2 tentativas.' },
}

export const Disabled: Story = {
  args: { disabled: true },
}

/** Movimento: pop a cada dígito, borda success em onda ao completar e tremor no erro (use 123456 para acertar). */
export const MotionVerification: Story = {
  render: function MotionVerification(args) {
    const [code, setCode] = useState('')
    const [error, setError] = useState<string>()
    return (
      <PinInput
        {...args}
        description="Digite 123456 para acertar; qualquer outro código treme o grupo."
        value={code}
        onChange={(value) => {
          setCode(value)
          if (value.length < (args.length ?? 6)) setError(undefined)
        }}
        onComplete={(value) => setError(value === '123456' ? undefined : 'Código incorreto.')}
        error={error}
      />
    )
  },
}
