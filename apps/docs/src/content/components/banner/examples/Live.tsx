import { Banner, Button } from '@orange/ui'
import { useState } from 'react'

export default function Live() {
  const [online, setOnline] = useState<boolean | null>(null)

  return (
    <div style={{ display: 'grid', gap: 12, width: '100%' }}>
      {online === false && (
        <Banner live tone="danger" title="Sem conexão">
          Suas alterações ficam salvas neste dispositivo e serão enviadas quando a conexão voltar.
        </Banner>
      )}
      {online === true && (
        <Banner
          live
          tone="success"
          title="Conexão restabelecida"
          dismissible
          onDismiss={() => setOnline(null)}
        >
          Sincronizamos 3 alterações pendentes.
        </Banner>
      )}
      <div style={{ display: 'flex', gap: 8 }}>
        <Button variant="outline" size="sm" onClick={() => setOnline(false)}>
          Simular queda
        </Button>
        <Button variant="outline" size="sm" onClick={() => setOnline(true)}>
          Simular retorno
        </Button>
      </div>
    </div>
  )
}
