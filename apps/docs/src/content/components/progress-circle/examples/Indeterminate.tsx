import { ProgressCircle, Stack } from '@orangesys/ui'

export default function Indeterminate() {
  return (
    <Stack gap={8} direction="horizontal" align="center">
      <ProgressCircle size="sm" label="Sincronizando agenda" />
      <ProgressCircle size="md" tone="neutral" label="Sincronizando agenda" />
      <ProgressCircle size="lg" label="Sincronizando agenda" />
    </Stack>
  )
}
