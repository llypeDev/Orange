import {
  Alert,
  Button,
  Checkbox,
  Form,
  FormActions,
  NumberField,
  TextField,
  type FormErrors,
  type FormValues,
} from '@orange/ui'
import { useState } from 'react'

const text = (value: FormValues[string]) => String(value ?? '').trim()

function validate(values: FormValues): FormErrors {
  const email = text(values.email)
  return {
    nome: text(values.nome) ? undefined : 'Informe seu nome completo.',
    email: !email
      ? 'Informe seu e-mail de trabalho.'
      : /^\S+@\S+\.\S+$/.test(email)
        ? undefined
        : 'Informe um e-mail no formato nome@empresa.com.',
    empresa: text(values.empresa) ? undefined : 'Informe o nome da empresa.',
    licencas: Number(values.licencas) >= 1 ? undefined : 'Informe quantas licenças a equipe precisa (mínimo 1).',
    termos: values.termos ? undefined : 'Aceite os termos de uso para criar a conta.',
  }
}

export default function SignUp() {
  const [createdFor, setCreatedFor] = useState<string | null>(null)

  return (
    <Form
      aria-label="Criar conta"
      validate={validate}
      onSubmit={(values) => setCreatedFor(text(values.email))}
      style={{ width: '100%', maxWidth: 520 }}
    >
      {({ errors }) => (
        <>
          {createdFor && (
            <Alert tone="success" live title="Conta criada">
              Enviamos o link de acesso para {createdFor}.
            </Alert>
          )}
          <TextField name="nome" label="Nome completo" autoComplete="name" error={errors.nome} />
          <TextField
            name="email"
            type="email"
            label="E-mail de trabalho"
            autoComplete="email"
            error={errors.email}
          />
          <TextField name="empresa" label="Empresa" autoComplete="organization" error={errors.empresa} />
          <NumberField
            name="licencas"
            label="Número de licenças"
            description="Uma por pessoa que vai usar o sistema."
            min={1}
            max={500}
            style={{ maxWidth: 200 }}
            error={errors.licencas}
          />
          <Checkbox name="termos" label="Li e aceito os termos de uso" error={errors.termos} />
          <FormActions>
            <Button type="submit">Criar conta</Button>
          </FormActions>
        </>
      )}
    </Form>
  )
}
