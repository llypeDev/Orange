import { Banner, Button } from '@orangesys/ui'
import { useState } from 'react'

export default function Live() {
  const [online, setOnline] = useState<boolean | null>(null)

  return (
    <div style={{ width: '100%' }}>
      {/* open mantém os banners montados: quem sai recolhe a altura, quem chega desce 8px */}
      <Banner
        live
        pulse
        open={online === false}
        tone="danger"
        title="Sem conexão agora"
        style={{ marginBottom: 12 }}
      >
        Suas alterações ficam salvas neste dispositivo e serão enviadas quando a conexão voltar.
      </Banner>
      <Banner
        live
        open={online === true}
        tone="success"
        title="Conexão restabelecida"
        dismissible
        onDismiss={() => setOnline(null)}
        style={{ marginBottom: 12 }}
      >
        Sincronizamos 3 alterações pendentes.
      </Banner>
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
