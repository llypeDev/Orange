import { Alert, Icon, Stack } from '@orangesys/ui'

export default function WithoutTitle() {
  return (
    <Stack gap={3} style={{ width: '100%' }}>
      <Alert tone="neutral">As alterações são salvas automaticamente a cada 30 segundos.</Alert>
      <Alert tone="info" icon={<Icon name="sparkle" />}>
        Dica: pressione <kbd>/</kbd> para buscar em qualquer tela.
      </Alert>
    </Stack>
  )
}
