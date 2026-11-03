import { Alert, Button } from '@orange/ui'
import { useState } from 'react'

export default function Dismissible() {
  const [open, setOpen] = useState(true)

  return (
    <div style={{ width: '100%' }}>
      {open ? (
        <Alert
          tone="info"
          title="Novo: exportação para Excel"
          dismissible
          onDismiss={() => setOpen(false)}
        >
          Agora você pode baixar qualquer relatório em .xlsx pelo menu <strong>Exportar</strong>.
        </Alert>
      ) : (
        <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
          Mostrar aviso novamente
        </Button>
      )}
    </div>
  )
}
