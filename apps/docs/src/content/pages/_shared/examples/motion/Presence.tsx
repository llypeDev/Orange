import { Button, Icon, usePresence } from '@orangesys/ui'
import { useState } from 'react'

function Painel({ variante, titulo }: { variante: 'pop' | 'drop' | 'fade'; titulo: string }) {
  const [aberto, setAberto] = useState(false)
  // present continua true enquanto a animação de saída roda
  const { present, state, nodeRef } = usePresence<HTMLDivElement>(aberto)
  return (
    <div className="guide-presence">
      <Button
        size="sm"
        variant="outline"
        aria-expanded={aberto}
        onClick={() => setAberto((v) => !v)}
      >
        {aberto ? 'Fechar' : 'Abrir'} {titulo}
      </Button>
      {present && (
        <div
          ref={nodeRef}
          data-state={state}
          className={`guide-presence__panel or-motion-${variante}`}
        >
          <Icon name="bell" size="sm" />
          or-motion-{variante}
        </div>
      )}
    </div>
  )
}

export default function Presenca() {
  return (
    <div className="guide-row guide-row--top">
      <Painel variante="pop" titulo="popover" />
      <Painel variante="drop" titulo="menu" />
      <Painel variante="fade" titulo="véu" />
    </div>
  )
}
