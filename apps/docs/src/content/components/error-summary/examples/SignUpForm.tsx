import { Button, Checkbox, ErrorSummary, RadioGroup, TextField, type ErrorSummaryItem } from '@orange/ui'
import { useState, type FormEvent } from 'react'

export default function SignUpForm() {
  const [errors, setErrors] = useState<ErrorSummaryItem[]>([])
  const [attempt, setAttempt] = useState(0)

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const next: ErrorSummaryItem[] = []
    if (!String(data.get('empresa') ?? '').trim()) next.push({ id: 'cadastro-empresa', message: 'Informe o nome da empresa.' })
    if (!/^\S+@\S+\.\S+$/.test(String(data.get('email') ?? ''))) next.push({ id: 'cadastro-email', message: 'Informe um e-mail válido, como nome@empresa.com.' })
    if (!data.get('porte')) next.push({ id: 'cadastro-porte', message: 'Escolha o porte da empresa.' })
    if (!data.get('termos')) next.push({ id: 'cadastro-termos', message: 'Aceite os termos de uso para continuar.' })
    setErrors(next)
    setAttempt((n) => n + 1)
  }

  const errorFor = (id: string) => errors.find((e) => e.id === id)?.message

  return (
    <form onSubmit={onSubmit} noValidate style={{ display: 'grid', gap: 20, width: '100%', maxWidth: 520 }}>
      {/* A key muda a cada envio: o resumo é remontado e recebe o foco de novo. */}
      <ErrorSummary key={attempt} errors={errors} />
      <TextField id="cadastro-empresa" name="empresa" label="Nome da empresa" error={errorFor('cadastro-empresa')} />
      <TextField id="cadastro-email" name="email" type="email" label="E-mail de trabalho" error={errorFor('cadastro-email')} />
      <RadioGroup
        id="cadastro-porte"
        name="porte"
        label="Porte da empresa"
        orientation="horizontal"
        error={errorFor('cadastro-porte')}
        options={[
          { value: '1-10', label: '1–10 pessoas' },
          { value: '11-50', label: '11–50' },
          { value: '51+', label: '51 ou mais' },
        ]}
      />
      <Checkbox id="cadastro-termos" name="termos" label="Li e aceito os Termos de uso" error={errorFor('cadastro-termos')} />
      <div>
        <Button type="submit">Criar conta</Button>
      </div>
    </form>
  )
}
