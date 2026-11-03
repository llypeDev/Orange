import { Button, Icon, Paper } from '@orange/ui'

export default function Inverse() {
  return (
    <Paper tone="inverse" padding={8} border="none" style={{ width: '100%' }}>
      <p className="or-eyebrow" style={{ margin: 0 }}>
        Teste grátis
      </p>
      <h3 style={{ margin: '8px 0 8px', fontSize: 26 }}>Leve a conciliação bancária para toda a equipe</h3>
      <p style={{ margin: '0 0 20px', color: 'var(--or-color-text-muted)', maxWidth: 520 }}>
        14 dias com todos os recursos do plano Pro. Sem cartão de crédito.
      </p>
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <Button endIcon={<Icon name="arrow-right" />}>Começar agora</Button>
        <Button variant="outline">Falar com vendas</Button>
      </div>
    </Paper>
  )
}
