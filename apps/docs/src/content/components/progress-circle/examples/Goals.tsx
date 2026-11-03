import { ProgressCircle } from '@orange/ui'

const goals = [
  { label: 'Meta de vendas', detail: 'R$ 82 mil de R$ 100 mil', value: 82, tone: 'success' as const },
  { label: 'Novos clientes', detail: '31 de 50', value: 62, tone: 'info' as const },
  { label: 'Chamados resolvidos', detail: '44 de 120', value: 37, tone: 'warning' as const },
]

export default function Goals() {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 40 }}>
      {goals.map((goal) => (
        <figure key={goal.label} style={{ display: 'grid', justifyItems: 'center', gap: 10, margin: 0 }}>
          <ProgressCircle size="lg" showValue value={goal.value} tone={goal.tone} label={goal.label} />
          <figcaption style={{ textAlign: 'center', fontSize: 13, color: 'var(--or-color-text-muted)' }}>
            <strong style={{ display: 'block', color: 'var(--or-color-text)' }}>{goal.label}</strong>
            {goal.detail}
          </figcaption>
        </figure>
      ))}
    </div>
  )
}
