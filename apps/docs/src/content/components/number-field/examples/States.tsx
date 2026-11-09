import { NumberField, Stack } from '@orangesys/ui'

export default function States() {
  return (
    <Stack gap={5} style={{ width: '100%', maxWidth: 280 }}>
      <NumberField label="Parcelas" defaultValue={0} min={1} max={12} error="Escolha de 1 a 12 parcelas." />
      <NumberField label="Estoque atual" defaultValue={128} readOnly />
      <NumberField label="Limite de usuários" defaultValue={5} disabled description="Disponível no plano Pro." />
    </Stack>
  )
}
