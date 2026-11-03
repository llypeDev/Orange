import { PinInput } from '@orange/ui'

export default function Masked() {
  return (
    <div style={{ display: 'grid', gap: 24 }}>
      <PinInput label="Senha do cartão" description="4 dígitos. Os números ficam ocultos." length={4} mask />
      <PinInput label="Código do autenticador" length={6} groupSize={3} placeholder="·" />
    </div>
  )
}
