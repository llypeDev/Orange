import { Alert, Button } from '@orangesys/ui'
import { useState } from 'react'

export default function Dismissible() {
  const [open, setOpen] = useState(true)

  return (
    <div style={{ width: '100%' }}>
      {/* open mantém o Alert montado: a saída recolhe a altura e a reabertura anima a entrada */}
      <Alert
        open={open}
        tone="info"
        title="Novo: exportação para Excel"
        dismissible
        onDismiss={() => setOpen(false)}
      >
        Agora você pode baixar qualquer relatório em .xlsx pelo menu <strong>Exportar</strong>.
      </Alert>
      {!open && (
        <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
          Mostrar aviso novamente
        </Button>
      )}
    </div>
  )
}
