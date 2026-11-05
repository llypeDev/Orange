import { Alert, Button, Form, FormActions, TextField, type FormErrors, type FormValues } from '@orange/ui'
import { useState } from 'react'

const text = (value: FormValues[string]) => String(value ?? '').trim()

/** Simula a API: e-mails @acme.com.br já têm conta. */
async function convidar(email: string): Promise<{ ok: true } | { ok: false; errors: FormErrors }> {
  await new Promise((resolve) => setTimeout(resolve, 1200))
  if (email.endsWith('@acme.com.br')) {
    return { ok: false, errors: { email: 'Este e-mail já está cadastrado. Peça para a pessoa entrar na conta dela.' } }
  }
  return { ok: true }
}

export default function ServerError() {
  const [serverErrors, setServerErrors] = useState<FormErrors>({})
  const [invited, setInvited] = useState<string | null>(null)

  const onSubmit = async (values: FormValues) => {
    setServerErrors({}) // limpa os erros do envio anterior
    setInvited(null)
    const result = await convidar(text(values.email))
    if (result.ok) setInvited(text(values.email))
    else setServerErrors(result.errors)
  }

  return (
    <Form
      aria-label="Convidar pessoa"
      errors={serverErrors}
      onSubmit={onSubmit}
      validate={(values) => ({
        email: /^\S+@\S+\.\S+$/.test(text(values.email)) ? undefined : 'Informe um e-mail no formato nome@empresa.com.',
      })}
      style={{ width: '100%', maxWidth: 520 }}
    >
      {({ errors, isSubmitting }) => (
        <>
          {invited && (
            <Alert tone="success" live title="Convite enviado">
              {invited} vai receber um link para entrar na equipe.
            </Alert>
          )}
          <TextField
            name="email"
            type="email"
            label="E-mail de trabalho"
            description="Use ana@acme.com.br para ver o erro do servidor."
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
