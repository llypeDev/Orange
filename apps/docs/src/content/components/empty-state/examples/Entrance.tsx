import { Button, EmptyState, Stack } from '@orangesys/ui'
import { useState } from 'react'

export default function Entrance() {
  // trocar a key remonta o EmptyState e repete a entrada
  const [round, setRound] = useState(0)

  return (
    <Stack gap={4} align="center" style={{ width: '100%' }}>
      <EmptyState
        key={round}
        icon="check-circle"
        title="Tudo em dia"
        description="Nenhuma fatura pendente neste mês."
      />
      <Button size="sm" variant="ghost" onClick={() => setRound((r) => r + 1)}>
        Repetir animação
      </Button>
    </Stack>
  )
}
