import { Button, Fieldset, TextField } from '@orange/ui'
import { useState, type FormEvent } from 'react'

export default function GroupError() {
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const missing = submitted && !email.trim() && !phone.trim()

  const onSubmit = (event: FormEvent) => {
    event.preventDefault()
    setSubmitted(true)
  }

  return (
    <form onSubmit={onSubmit} noValidate style={{ display: 'grid', gap: 20, width: '100%', maxWidth: 520 }}>
      <Fieldset
        legend="Contato"
        description="Informe pelo menos um meio de contato."
        error={missing ? 'Preencha o e-mail ou o telefone.' : undefined}
      >
        <TextField label="E-mail" type="email" value={email} onValueChange={setEmail} invalid={missing} />
        <TextField label="Telefone" type="tel" value={phone} onValueChange={setPhone} invalid={missing} />
      </Fieldset>
      <div>
        <Button type="submit">Salvar contato</Button>
      </div>
    </form>
  )
}
