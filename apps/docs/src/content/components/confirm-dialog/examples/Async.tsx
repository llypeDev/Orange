import { Button, ConfirmDialog } from '@orange/ui'
import { useState } from 'react'

const encerrarSessoes = () => new Promise((resolve) => setTimeout(resolve, 1800))

export default function Async() {
  const [status, setStatus] = useState('3 dispositivos conectados')

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
      <span>{status}</span>
      <ConfirmDialog
        tone="danger"
        title="Encerrar todas as sessões?"
        description="Você continuará conectado aqui. Nos outros dispositivos será preciso entrar de novo."
        confirmLabel="Encerrar sessões"
        loadingText="Encerrando sessões"
        onConfirm={async () => {
          await encerrarSessoes()
          setStatus('Apenas este dispositivo está conectado')
        }}
        trigger={<Button variant="outline">Encerrar sessões</Button>}
      />
    </div>
  )
}
