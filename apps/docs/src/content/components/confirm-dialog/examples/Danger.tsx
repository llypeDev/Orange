import { Button, ConfirmDialog } from '@orange/ui'
import { useState } from 'react'

export default function Danger() {
  const [excluido, setExcluido] = useState(false)

  if (excluido) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <span>Projeto excluído.</span>
        <Button variant="ghost" onClick={() => setExcluido(false)}>
          Desfazer
        </Button>
      </div>
    )
  }

  return (
    <ConfirmDialog
      tone="danger"
      title="Excluir o projeto Site 2026?"
      description="O projeto, seus 12 arquivos e o histórico de versões serão removidos para sempre."
      confirmLabel="Excluir projeto"
      onConfirm={() => setExcluido(true)}
      trigger={<Button variant="danger">Excluir projeto</Button>}
    />
  )
}
