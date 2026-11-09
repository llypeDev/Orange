import { SegmentedControl, Stack, type SegmentedControlOption } from '@orangesys/ui'

const units: SegmentedControlOption[] = [
  { value: 'km', label: 'Quilômetros' },
  { value: 'mi', label: 'Milhas' },
]

export default function Sizes() {
  return (
    <Stack gap={6} style={{ width: '100%', maxWidth: 480 }}>
      <SegmentedControl label="Small" size="sm" options={units} />
      <SegmentedControl label="Medium" size="md" options={units} />
      <SegmentedControl label="Large" size="lg" options={units} />
      <SegmentedControl
        label="Ciclo de cobrança"
        description="No plano anual você economiza 20%."
        block
        defaultValue="yearly"
        options={[
          { value: 'monthly', label: 'Mensal' },
          { value: 'yearly', label: 'Anual' },
        ]}
      />
    </Stack>
  )
}
