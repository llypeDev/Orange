import { NumberField } from '@orange/ui'

export default function Units() {
  return (
    <div style={{ display: 'grid', gap: 20, width: '100%', maxWidth: 280 }}>
      <NumberField label="Peso do pacote" defaultValue={1.5} min={0.1} step={0.1} suffix="kg" />
      <NumberField
        label="Distância máxima"
        defaultValue={25}
        min={1}
        max={200}
        largeStep={25}
        formatOptions={{ style: 'unit', unit: 'kilometer' }}
        description="PageUp/PageDown avançam 25 km."
      />
      <NumberField label="Altura" defaultValue={172} suffix="cm" hideStepper />
    </div>
  )
}
