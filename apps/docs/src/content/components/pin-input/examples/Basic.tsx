import { PinInput } from '@orange/ui'
import { useState } from 'react'

export default function Basic() {
  const [status, setStatus] = useState('')

  return (
    <div style={{ display: 'grid', gap: 12 }}>
      <PinInput
        label="Código de verificação"
        description="Enviamos um código de 6 dígitos por SMS para (11) •••••-4821."
        onChange={() => setStatus('')}
        onComplete={(codigo) => setStatus(`Verificando o código ${codigo}…`)}
      />
      <p role="status" style={{ margin: 0, fontSize: 13, color: 'var(--or-color-text-subtle)' }}>
        {status}
      </p>
    </div>
  )
}
