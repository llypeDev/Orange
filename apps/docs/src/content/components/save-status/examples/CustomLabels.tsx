import { SaveStatus, Stack } from '@orangesys/ui'

const salvoEm = new Date(Date.now() - 5 * 60_000)

export default function CustomLabels() {
  return (
    <Stack gap={3} align="start">
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
    </Stack>
  )
}
