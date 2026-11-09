import { Button, Icon, Stack, Stat, StatGroup } from '@orangesys/ui'
import { useState } from 'react'

export default function Dashboard() {
  // Trocar a key remonta o grupo e repete a contagem.
  const [run, setRun] = useState(0)

  return (
    <Stack gap={3} style={{ width: '100%' }}>
      <StatGroup key={run}>
        <Stat animate label="Receita" value="R$ 48,2 mil" delta="12%" trend="increase" help="vs. outubro" />
        <Stat animate label="Pedidos" value={1284} delta="4,3%" trend="increase" help="vs. outubro" />
        <Stat animate label="Ticket médio" value="R$ 37,54" delta="2,1%" trend="decrease" help="vs. outubro" />
        <Stat animate label="Conversão" value="3,8%" delta="0 p.p." trend="neutral" help="estável" />
      </StatGroup>
      <div>
        <Button variant="ghost" size="sm" startIcon={<Icon name="refresh" />} onClick={() => setRun((n) => n + 1)}>
          Repetir animação
        </Button>
      </div>
    </Stack>
  )
}
