import { Button, useToast } from '@orange/ui'
import { useState } from 'react'

export default function WithAction() {
  const { toast } = useToast()
  const [archived, setArchived] = useState(0)

  const archive = () => {
    setArchived((n) => n + 3)
    toast({
      title: '3 conversas arquivadas',
      action: { label: 'Desfazer', onClick: () => setArchived((n) => n - 3) },
    })
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
      <Button variant="outline" onClick={archive}>
        Arquivar selecionadas
      </Button>
      <span style={{ color: 'var(--or-color-text-muted)' }}>Arquivadas: {archived}</span>
    </div>
  )
}
