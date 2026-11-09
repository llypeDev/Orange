import { Button, Stack, useToast } from '@orangesys/ui'
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
    <Stack gap={4} direction="horizontal" align="center">
      <Button variant="outline" onClick={archive}>
        Arquivar selecionadas
      </Button>
      <span style={{ color: 'var(--or-color-text-muted)' }}>Arquivadas: {archived}</span>
    </Stack>
  )
}
