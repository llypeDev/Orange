import { Stack, TimeField } from '@orangesys/ui'

export default function States() {
  return (
    <Stack gap={4} direction="horizontal" wrap>
      <TimeField
        label="Abertura da loja"
        defaultValue="08:00"
        readOnly
        description="Definido pela franquia."
      />
      <TimeField label="Fechamento" defaultValue="23:30" max="22:00" />
      <TimeField label="Intervalo" defaultValue="12:00" disabled />
    </Stack>
  )
}
