import { NumberField, Stack } from '@orangesys/ui'

export default function Basic() {
  return (
    <Stack gap={5} style={{ width: '100%', maxWidth: 280 }}>
      <NumberField label="Quantidade" defaultValue={1} min={1} max={10} description="Máximo de 10 unidades por pedido." />
      <NumberField label="Hóspedes" defaultValue={2} min={1} max={8} size="sm" />
    </Stack>
  )
}
