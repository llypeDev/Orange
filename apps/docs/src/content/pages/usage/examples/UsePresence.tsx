import { Button, Icon, usePresence } from '@orange/ui'
import { useState } from 'react'

export default function AvisoDeSalvamento() {
  const [visivel, setVisivel] = useState(false)
  // present segue true durante a saída; state vai para 'closed' na hora
  const { present, state, nodeRef } = usePresence<HTMLDivElement>(visivel)
  return (
    <div className="guide-stack">
      <div>
        <Button variant="outline" onClick={() => setVisivel((v) => !v)}>
          {visivel ? 'Esconder aviso' : 'Mostrar aviso'}
        </Button>
      </div>
      <p className="guide-live">
        visivel: <strong>{String(visivel)}</strong> · present: <strong>{String(present)}</strong> · state:{' '}
        <strong>{state}</strong>
      </p>
      {present && (
        <div ref={nodeRef} data-state={state} role="status" className="guide-presence__panel or-motion-pop">
          <Icon name="check-circle" size="sm" />
          Rascunho salvo às 14h32
        </div>
      )}
    </div>
  )
}
