import { IconButton } from '@orange/ui'
import { useState } from 'react'

export default function States() {
  const [syncing, setSyncing] = useState(false)

  const sync = () => {
    setSyncing(true)
    setTimeout(() => setSyncing(false), 2000)
  }

  return (
    <>
      <IconButton
        icon="refresh"
        label="Sincronizar caixa de entrada"
        variant="outline"
        loading={syncing}
        loadingText="Sincronizando caixa de entrada"
        onClick={sync}
      />
      <IconButton icon="send" label="Enviar mensagem" variant="primary" disabled />
    </>
  )
}
