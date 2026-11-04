import { Button, ConfirmDialog } from '@orange/ui'

const integracoes = [
  'Slack — canal #vendas',
  'Google Agenda — 2 calendários',
  'Webhook de faturamento',
]

export default function WithDetails() {
  return (
    <ConfirmDialog
      title="Desconectar 3 integrações?"
      description="As automações abaixo deixam de rodar até você conectar de novo."
      confirmLabel="Desconectar"
      trigger={<Button variant="outline">Desconectar integrações</Button>}
    >
      <ul style={{ margin: 0, paddingLeft: 18, display: 'grid', gap: 4 }}>
        {integracoes.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </ConfirmDialog>
  )
}
