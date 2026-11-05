import { Button } from '@orangesys/ui'
import { useState } from 'react'

export default function Loading() {
  const [saving, setSaving] = useState(false)

  const save = () => {
    setSaving(true)
    setTimeout(() => setSaving(false), 2000)
  }

  return (
    <>
      <Button loading={saving} loadingText="Salvando alterações" onClick={save}>
        Salvar alterações
      </Button>
      <Button variant="outline" disabled>
        Desabilitado
      </Button>
    </>
  )
}
