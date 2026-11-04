import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { Icon } from '../../icons'
import { Button } from '../Button'
import { TextField } from './TextField'

const meta = {
  title: 'Componentes/TextField',
  component: TextField,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Campo de texto de uma linha com rótulo, ajuda, erro, ícones, prefixo/sufixo e contador de caracteres. A `ref` e as props nativas vão para o `<input>`.',
      },
    },
  },
  argTypes: {
    type: { control: 'inline-radio', options: ['text', 'email', 'url', 'tel', 'search'] },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    onChange: { action: 'change' },
  },
  args: {
    label: 'Nome da empresa',
    placeholder: 'Ex.: Laranja Tecnologia',
    size: 'md',
  },
  decorators: [(Story) => <div style={{ maxWidth: 420 }}>{Story()}</div>],
} satisfies Meta<typeof TextField>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithDescription: Story = {
  args: {
    label: 'E-mail de trabalho',
    type: 'email',
    description: 'Enviaremos o convite para este endereço.',
    placeholder: 'voce@empresa.com',
  },
}

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'grid', gap: 16 }}>
      <TextField {...args} size="sm" label="Pequeno (sm)" />
      <TextField {...args} size="md" label="Médio (md)" />
      <TextField {...args} size="lg" label="Grande (lg)" />
    </div>
  ),
}

export const IconsAndAffixes: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 16 }}>
      <TextField label="Buscar pedidos" type="search" startIcon={<Icon name="search" />} placeholder="Número ou cliente" />
      <TextField label="Site" type="url" prefix="https://" placeholder="suaempresa.com.br" />
      <TextField label="Peso" inputMode="decimal" suffix="kg" />
      <TextField label="E-mail" type="email" endIcon={<Icon name="mail" />} />
    </div>
  ),
}

export const CharacterCount: Story = {
  args: {
    label: 'Título do anúncio',
    maxLength: 60,
    showCount: true,
    defaultValue: 'Apartamento com 2 quartos',
  },
}

export const States: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 16 }}>
      <TextField label="Obrigatório" required />
      <TextField label="Opcional" optional />
      <TextField label="Com erro" defaultValue="joao@" error="Informe um e-mail válido, como nome@empresa.com." />
      <TextField label="Somente leitura" readOnly defaultValue="ORG-2931" />
      <TextField label="Desabilitado" disabled defaultValue="Plano gratuito" />
    </div>
  ),
}

function ErrorMotionDemo() {
  const [value, setValue] = useState('')
  const [error, setError] = useState<string>()
  return (
    <form
      noValidate
      style={{ display: 'grid', gap: 16 }}
      onSubmit={(event) => {
        event.preventDefault()
        setError(/^\S+@\S+\.\S+$/.test(value) ? undefined : 'Informe um e-mail no formato nome@empresa.com.')
      }}
    >
      <TextField
        label="E-mail"
        type="email"
        value={value}
        onValueChange={(next) => {
          setValue(next)
          setError(undefined)
        }}
        error={error}
      />
      <div>
        <Button type="submit">Validar</Button>
      </div>
    </form>
  )
}

/** Motion: o erro entra deslizando 4px e a moldura treme uma vez (só de válido → inválido). */
export const ErrorMotion: Story = {
  render: () => <ErrorMotionDemo />,
}
