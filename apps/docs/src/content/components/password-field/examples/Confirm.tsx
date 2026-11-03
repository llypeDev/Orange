import { Button, PasswordField } from '@orange/ui'
import { useState, type FormEvent } from 'react'

export default function Confirm() {
  const [password, setPassword] = useState('')
  const [confirmation, setConfirmation] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const mismatch = submitted && password !== confirmation

  const onSubmit = (event: FormEvent) => {
    event.preventDefault()
    setSubmitted(true)
  }

  return (
    <form style={{ display: 'grid', gap: 20, width: '100%', maxWidth: 420 }} onSubmit={onSubmit} noValidate>
      <PasswordField label="Nova senha" autoComplete="new-password" value={password} onValueChange={setPassword} />
      <PasswordField
        label="Confirme a nova senha"
        autoComplete="new-password"
        value={confirmation}
        onValueChange={setConfirmation}
        error={mismatch ? 'As senhas não coincidem. Digite a mesma senha nos dois campos.' : undefined}
      />
      <div>
        <Button type="submit">Alterar senha</Button>
      </div>
    </form>
  )
}
