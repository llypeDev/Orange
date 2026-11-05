import { Button, Icon } from '@orangesys/ui'
import { useState } from 'react'

export default function EntradaDePagina() {
  const [rodada, setRodada] = useState(0)
  return (
    <div className="guide-stack">
      {/* or-page-enter: opacidade + --or-distance-md (8px) na troca de rota */}
      <div key={rodada} className="guide-page-mock">
        <span className="or-eyebrow">Pedidos</span>
        <strong>Pedidos em aberto</strong>
        <span>32 pedidos aguardam separação.</span>
      </div>
      <div>
        <Button
          size="sm"
          variant="ghost"
          startIcon={<Icon name="refresh" size="sm" />}
          onClick={() => setRodada((n) => n + 1)}
        >
          Trocar de página
        </Button>
      </div>
    </div>
  )
}
