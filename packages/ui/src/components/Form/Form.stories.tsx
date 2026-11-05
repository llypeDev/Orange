import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { Alert } from '../Alert'
import { Button } from '../Button'
import { Checkbox } from '../Checkbox'
import { DatePicker } from '../DatePicker'
import { NumberField } from '../NumberField'
import { Select } from '../Select'
import { TextField } from '../TextField'
import { Form, FormActions, useForm, type FormErrors, type FormValues } from './Form'

const text = (value: FormValues[string]) => String(value ?? '').trim()

const validateSignUp = (values: FormValues): FormErrors => ({
  nome: text(values.nome) ? undefined : 'Informe seu nome completo.',
  email: /^\S+@\S+\.\S+$/.test(text(values.email)) ? undefined : 'Informe um e-mail como nome@empresa.com.',
  empresa: text(values.empresa) ? undefined : 'Informe o nome da empresa.',
  licencas: Number(values.licencas) >= 1 ? undefined : 'Informe quantas licenças você precisa (mínimo 1).',
  termos: values.termos ? undefined : 'Aceite os termos de uso para continuar.',
})

const meta = {
  title: 'Componentes/Form',
  component: Form,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Orquestra o envio no padrão GOV.UK: valida no envio, mostra o `ErrorSummary` no topo com links para cada campo, move o foco para ele e tira os erros conforme são corrigidos. Os campos recebem os erros pelo render-prop `children` ou por `useForm()`. `onSubmit` assíncrono deixa o formulário `aria-busy` e bloqueia envio duplo.',
      },
    },
  },
  argTypes: {
    errorSummary: { control: 'boolean' },
    errorSummaryTitle: { control: 'text' },
    gap: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    onSubmit: { action: 'submit' },
  },
  args: {
    errorSummary: true,
    gap: 'md',
  },
  decorators: [(Story) => <div style={{ maxWidth: 520 }}>{Story()}</div>],
} satisfies Meta<typeof Form>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: { validate: validateSignUp },
  render: (args) => (
    <Form aria-label="Criar conta" {...args}>
      {({ errors }) => (
        <>
          <TextField name="nome" label="Nome completo" autoComplete="name" error={errors.nome} />
          <TextField name="email" type="email" label="E-mail de trabalho" autoComplete="email" error={errors.email} />
          <TextField name="empresa" label="Empresa" autoComplete="organization" error={errors.empresa} />
          <NumberField name="licencas" label="Número de licenças" min={1} max={500} error={errors.licencas} />
          <Checkbox name="termos" label="Li e aceito os termos de uso" error={errors.termos} />
          <FormActions>
            <Button type="submit">Criar conta</Button>
          </FormActions>
        </>
      )}
    </Form>
  ),
}

export const CustomTitle: Story = {
  ...Default,
  args: { validate: validateSignUp, errorSummaryTitle: 'Não foi possível criar sua conta' },
}

export const WithoutSummary: Story = {
  ...Default,
  args: { validate: validateSignUp, errorSummary: false },
  parameters: {
    docs: { description: { story: 'Sem o resumo, o foco vai para o primeiro campo inválido.' } },
  },
}

function AsyncDemo() {
  const [serverErrors, setServerErrors] = useState<FormErrors>({})
  const [sent, setSent] = useState(false)
  const onSubmit = async (values: FormValues) => {
    setServerErrors({})
    setSent(false)
    await new Promise((resolve) => setTimeout(resolve, 1200))
    if (text(values.email).endsWith('@acme.com.br')) {
      setServerErrors({ email: 'Este e-mail já está cadastrado. Entre na sua conta ou use outro e-mail.' })
      return
    }
    setSent(true)
  }
  return (
    <Form
      aria-label="Convidar pessoa"
      errors={serverErrors}
      onSubmit={onSubmit}
      validate={(v) => ({
        email: /^\S+@\S+\.\S+$/.test(text(v.email)) ? undefined : 'Informe um e-mail como nome@empresa.com.',
      })}
    >
      {({ errors, isSubmitting }) => (
        <>
          {sent && (
            <Alert tone="success" live title="Convite enviado">
              A pessoa vai receber um link para entrar na equipe.
            </Alert>
          )}
          <TextField
            name="email"
            type="email"
            label="E-mail de trabalho"
            description="Tente ana@acme.com.br para ver o erro do servidor."
            error={errors.email}
          />
          <FormActions>
            <Button type="submit" loading={isSubmitting} loadingText="Enviando convite">
              Enviar convite
            </Button>
          </FormActions>
        </>
      )}
    </Form>
  )
}

export const AsyncWithServerError: Story = {
  render: () => <AsyncDemo />,
  parameters: {
    docs: {
      description: {
        story:
          'Enquanto a promessa de `onSubmit` está pendente, o formulário fica `aria-busy` e ignora novos envios. O erro do servidor chega por `errors` e some quando o campo muda.',
      },
    },
  },
}

function ScheduleFields() {
  const { getError } = useForm()
  return (
    <>
      <Select
        name="plano"
        label="Plano"
        placeholder="Selecione um plano"
        error={getError('plano')}
        options={[
          { value: 'essencial', label: 'Essencial' },
          { value: 'profissional', label: 'Profissional' },
          { value: 'empresarial', label: 'Empresarial' },
        ]}
      />
      <DatePicker name="inicio" label="Início da assinatura" min={new Date()} error={getError('inicio')} />
    </>
  )
}

export const WithUseForm: Story = {
  args: {
    validate: (values: FormValues) => ({
      plano: values.plano ? undefined : 'Escolha um plano.',
      inicio: values.inicio ? undefined : 'Escolha a data de início da assinatura.',
    }),
  },
  render: (args) => (
    <Form aria-label="Assinatura" {...args}>
      <ScheduleFields />
      <FormActions>
        <Button type="submit">Assinar</Button>
      </FormActions>
    </Form>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Campos em componentes próprios leem os erros com `useForm()`. O `DatePicker` envia a data (AAAA-MM-DD) por um input oculto com `name`.',
      },
    },
  },
}
