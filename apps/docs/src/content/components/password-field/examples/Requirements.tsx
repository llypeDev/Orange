import { PasswordField } from '@orangesys/ui'
import { useState } from 'react'

export default function Requirements() {
  const [password, setPassword] = useState('')

  return (
    <div style={{ width: '100%', maxWidth: 420 }}>
      <PasswordField
        label="Crie uma senha"
        required
        value={password}
        onValueChange={setPassword}
        requirements={[
          { label: 'Pelo menos 8 caracteres', met: password.length >= 8 },
          { label: 'Uma letra maiúscula', met: /[A-Z]/.test(password) },
          { label: 'Um número', met: /\d/.test(password) },
          { label: 'Um símbolo (!@#$…)', met: /[^A-Za-z0-9]/.test(password) },
        ]}
      />
    </div>
  )
}
