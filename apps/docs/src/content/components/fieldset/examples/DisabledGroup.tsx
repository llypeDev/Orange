import { Checkbox, Fieldset, Stack, TextField } from '@orangesys/ui'
import { useState } from 'react'

export default function DisabledGroup() {
  const [sameAddress, setSameAddress] = useState(true)

  return (
    <Stack gap={5} style={{ width: '100%', maxWidth: 520 }}>
      <Checkbox
        label="Usar o endereço de entrega para a cobrança"
        checked={sameAddress}
        onCheckedChange={setSameAddress}
      />
      <Fieldset legend="Endereço de cobrança" disabled={sameAddress} gap="sm">
        <TextField label="CEP" inputMode="numeric" style={{ maxWidth: 180 }} />
        <TextField label="Rua e número" />
      </Fieldset>
    </Stack>
  )
}
