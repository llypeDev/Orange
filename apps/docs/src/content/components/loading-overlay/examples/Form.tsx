import { Button, LoadingOverlay } from '@orangesys/ui'
import { useState, type FormEvent } from 'react'

const field = {
  width: '100%',
  height: 40,
  padding: '0 12px',
  border: '1px solid var(--or-color-border-control)',
  background: 'var(--or-color-surface)',
} as const

export default function Form() {
  const [saving, setSaving] = useState(false)

  const submit = (event: FormEvent) => {
    event.preventDefault()
    setSaving(true)
    setTimeout(() => setSaving(false), 2000)
  }

  return (
    <LoadingOverlay
      visible={saving}
      message="Salvando endereço…"
      style={{ width: '100%', maxWidth: 400 }}
    >
      <form
        onSubmit={submit}
        style={{
          display: 'grid',
          gap: 12,
          padding: 20,
          border: '1px solid var(--or-color-border)',
        }}
      >
        <label style={{ display: 'grid', gap: 6, fontSize: 13 }}>
          CEP
          <input style={field} defaultValue="01310-100" inputMode="numeric" />
        </label>
        <label style={{ display: 'grid', gap: 6, fontSize: 13 }}>
          Número
          <input style={field} defaultValue="1578" />
        </label>
        <div>
          <Button type="submit">Salvar endereço</Button>
        </div>
      </form>
    </LoadingOverlay>
  )
}
