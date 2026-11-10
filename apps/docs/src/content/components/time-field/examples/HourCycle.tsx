import { Stack, TimeField } from '@orangesys/ui'

export default function HourCycle() {
  return (
    <Stack gap={4} direction="horizontal" wrap>
      <TimeField label="Relógio de 24 horas" hourCycle={24} defaultValue="14:30" />
      <TimeField label="Relógio de 12 horas" hourCycle={12} defaultValue="14:30" />
    </Stack>
  )
}
