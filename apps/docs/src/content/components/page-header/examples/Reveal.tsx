import { Button, Icon, PageHeader } from '@orangesys/ui'
import { useState } from 'react'

export default function Reveal() {
  // A revelação roda ao montar: trocar a key remonta o cabeçalho para ver de novo.
  const [run, setRun] = useState(0)
  return (
    <div style={{ display: 'grid', gap: 24 }}>
      <PageHeader
        headingLevel={2}
        key={run}
        reveal
        eyebrow="Relatórios"
        title="Vendas do trimestre"
        description="Receita, ticket médio e conversão por canal, atualizados a cada hora."
        actions={<Button variant="outline">Compartilhar</Button>}
      />
      <div>
        <Button
          variant="ghost"
          size="sm"
          startIcon={<Icon name="refresh" />}
          onClick={() => setRun((n) => n + 1)}
        >
          Repetir animação
        </Button>
      </div>
    </div>
  )
}
