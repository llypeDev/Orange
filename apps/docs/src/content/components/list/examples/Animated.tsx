import { Button, Icon, List, ListItem } from '@orangesys/ui'
import { useState } from 'react'

export default function Animated() {
  // Trocar a key remonta a lista e repete a entrada.
  const [rodada, setRodada] = useState(0)

  return (
    <div style={{ display: 'grid', gap: 20, maxWidth: 480 }}>
      <div>
        <Button size="sm" variant="outline" startIcon={<Icon name="refresh" />} onClick={() => setRodada((r) => r + 1)}>
          Repetir animação
        </Button>
      </div>
      <List key={rodada} variant="numbered" size="lg" animated>
        <ListItem description="Importe faturas e extratos em poucos cliques.">Conecte seus bancos</ListItem>
        <ListItem description="Regras automáticas casam lançamentos e pagamentos.">Concilie todos os dias</ListItem>
        <ListItem description="Relatórios prontos para a reunião de fechamento.">Feche o mês sem planilhas</ListItem>
      </List>
    </div>
  )
}
