import { Stack, TextField } from '@orangesys/ui'
import { useState } from 'react'

const isEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)

export default function Validation() {
  const [email, setEmail] = useState('ana@')
  const [touched, setTouched] = useState(true)
  const error = touched && !isEmail(email) ? 'Informe um e-mail no formato nome@empresa.com.' : undefined

  return (
    <Stack gap={5} style={{ width: '100%', maxWidth: 420 }}>
      <TextField
        label="E-mail"
        type="email"
        required
        value={email}
        onValueChange={setEmail}
        onBlur={() => setTouched(true)}
        error={error}
      />
      <TextField label="Código da organização" readOnly defaultValue="ORG-2931" description="Gerado automaticamente." />
      <TextField label="Plano" disabled defaultValue="Gratuito" />
    </Stack>
  )
}
