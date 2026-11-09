import { NumberField, Stack } from '@orangesys/ui'

export default function Currency() {
  return (
    <Stack gap={5} style={{ width: '100%', maxWidth: 280 }}>
      <NumberField
        label="Preço de venda"
        defaultValue={149.9}
        min={0}
        step={0.5}
        formatOptions={{ style: 'currency', currency: 'BRL' }}
      />
      <NumberField
        label="Desconto"
        defaultValue={0.1}
        min={0}
        max={1}
        step={0.05}
        formatOptions={{ style: 'percent' }}
        description="Entre 0% e 100%."
      />
    </Stack>
  )
}
