import { SaveStatus } from '@orangesys/ui'

const salvoEm = new Date(Date.now() - 5 * 60_000)

export default function CustomLabels() {
  return (
    <div style={{ display: 'grid', gap: 12, justifyItems: 'start' }}>
      <SaveStatus
        status="saved"
        savedAt={salvoEm}
        labels={{ saved: 'Rascunho salvo', savedAt: 'Rascunho salvo {time}' }}
      />
      <SaveStatus
        status="error"
        onRetry={() => {}}
        labels={{ error: 'Sem conexão', retry: 'Reconectar' }}
      />
    </div>
  )
}
