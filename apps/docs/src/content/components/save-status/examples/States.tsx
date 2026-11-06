import { SaveStatus } from '@orangesys/ui'

const doisMinutosAtras = new Date(Date.now() - 2 * 60_000)

export default function States() {
  return (
    <div style={{ display: 'grid', gap: 12, justifyItems: 'start' }}>
      <SaveStatus status="idle" labels={{ idle: 'Salvamento automático ativado' }} />
      <SaveStatus status="saving" />
      <SaveStatus status="saved" savedAt={doisMinutosAtras} />
      <SaveStatus status="error" onRetry={() => {}} />
    </div>
  )
}
