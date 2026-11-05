import { Button, EmptyState } from '@orangesys/ui'
import { useState } from 'react'

export default function Entrance() {
  // trocar a key remonta o EmptyState e repete a entrada
  const [round, setRound] = useState(0)

  return (
    <div style={{ display: 'grid', gap: 16, justifyItems: 'center', width: '100%' }}>
      <EmptyState
        key={round}
        icon="check-circle"
        title="Tudo em dia"
        description="Nenhuma fatura pendente neste mês."
      />
      <Button size="sm" variant="ghost" onClick={() => setRound((r) => r + 1)}>
        Repetir animação
      </Button>
    </div>
  )
}
