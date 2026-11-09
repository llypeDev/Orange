import { SaveStatus, Stack } from '@orangesys/ui'

const doisMinutosAtras = new Date(Date.now() - 2 * 60_000)

export default function States() {
  return (
    <Stack gap={3} align="start">
      <SaveStatus status="idle" labels={{ idle: 'Salvamento automático ativado' }} />
      <SaveStatus status="saving" />
      <SaveStatus status="saved" savedAt={doisMinutosAtras} />
      <SaveStatus status="error" onRetry={() => {}} />
    </Stack>
  )
}
