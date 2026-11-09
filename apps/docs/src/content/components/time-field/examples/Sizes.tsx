import { Stack, TimeField } from '@orangesys/ui'

export default function Sizes() {
  return (
    <Stack gap={4} direction="horizontal" align="end" wrap>
      <TimeField label="Pequeno" size="sm" defaultValue="07:45" />
      <TimeField label="Médio" size="md" defaultValue="12:00" />
      <TimeField label="Grande" size="lg" defaultValue="18:30" />
    </Stack>
  )
}
