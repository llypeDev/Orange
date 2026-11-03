import { Fieldset, TextField } from '@orange/ui'

export default function Address() {
  return (
    <div style={{ width: '100%', maxWidth: 520 }}>
      <Fieldset legend="Endereço de entrega" description="Enviaremos o pedido para este endereço.">
        <TextField label="CEP" inputMode="numeric" autoComplete="postal-code" style={{ maxWidth: 180 }} />
        <TextField label="Rua" autoComplete="address-line1" />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 16 }}>
          <TextField label="Número" />
          <TextField label="Complemento" optional autoComplete="address-line2" />
        </div>
      </Fieldset>
    </div>
  )
}
