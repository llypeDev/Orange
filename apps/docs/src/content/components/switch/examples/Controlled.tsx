import { Switch, Text } from '@orangesys/ui'
import { useState } from 'react'

export default function Controlled() {
  const [maintenance, setMaintenance] = useState(false)

  return (
    <div style={{ display: 'grid', gap: 12 }}>
      <Switch
        label="Modo manutenção"
        description="Visitantes verão uma página de aviso enquanto estiver ligado."
        checked={maintenance}
        onCheckedChange={setMaintenance}
      />
      <Text size="sm" tone={maintenance ? 'warning' : 'success'} role="status">
        {maintenance ? 'Site em manutenção — apenas administradores têm acesso.' : 'Site no ar para todos os visitantes.'}
      </Text>
    </div>
  )
}
