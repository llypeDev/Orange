import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState, type FormEvent } from 'react'
import { Button } from '../Button'
import { TextField } from '../TextField'
import { ErrorSummary, type ErrorSummaryItem } from './ErrorSummary'

const meta = {
  title: 'Componentes/ErrorSummary',
  component: ErrorSummary,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Resumo de erros no topo do formulário: título, links que focam cada campo inválido e foco automático ao aparecer para ser anunciado por leitores de tela.',
      },
    },
  },
  args: {
    autoFocus: false,
    errors: [
      { id: 'story-nome', message: 'Informe seu nome completo.' },
      { id: 'story-email', message: 'Informe um e-mail no formato nome@empresa.com.' },
    ],
  },
  decorators: [(Story) => <div style={{ maxWidth: 560 }}>{Story()}</div>],
} satisfies Meta<typeof ErrorSummary>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => (
    <div style={{ display: 'grid', gap: 24 }}>
      <ErrorSummary {...args} />
      <TextField id="story-nome" label="Nome completo" error="Informe seu nome completo." />
      <TextField id="story-email" label="E-mail" type="email" error="Informe um e-mail no formato nome@empresa.com." />
    </div>
  ),
}

export const WithDescription: Story = {
  args: {
    title: 'Não foi possível criar sua conta',
    description: 'Revise os campos abaixo e tente novamente.',
  },
}

function SubmitDemo() {
  const [errors, setErrors] = useState<ErrorSummaryItem[]>([])
  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const next: ErrorSummaryItem[] = []
    if (!String(data.get('empresa')).trim()) next.push({ id: 'demo-empresa', message: 'Informe o nome da empresa.' })
    if (!String(data.get('cnpj')).trim()) next.push({ id: 'demo-cnpj', message: 'Informe o CNPJ.' })
    setErrors(next)
  }
  const errorFor = (id: string) => errors.find((e) => e.id === id)?.message
  return (
    <form noValidate onSubmit={onSubmit} style={{ display: 'grid', gap: 20 }}>
      <ErrorSummary key={errors.map((e) => e.id).join()} errors={errors} />
      <TextField id="demo-empresa" name="empresa" label="Empresa" error={errorFor('demo-empresa')} />
      <TextField id="demo-cnpj" name="cnpj" label="CNPJ" inputMode="numeric" error={errorFor('demo-cnpj')} />
      <div>
        <Button type="submit">Cadastrar empresa</Button>
      </div>
    </form>
  )
}

export const OnSubmit: Story = {
  render: () => <SubmitDemo />,
}
