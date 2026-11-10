import { Stack, TimeField } from '@orangesys/ui'

export default function TimeList() {
  return (
    <Stack gap={4} direction="horizontal" wrap>
      <TimeField label="De hora em hora" listStep={3600} defaultValue="09:00" />
      <TimeField
        label="Sem lista"
        description="Só digitação e setas."
        listStep={false}
        defaultValue="09:00"
      />
    </Stack>
  )
}
