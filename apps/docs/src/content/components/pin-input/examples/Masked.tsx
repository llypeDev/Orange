import { PinInput, Stack } from '@orangesys/ui'

export default function Masked() {
  return (
    <Stack gap={6}>
      <PinInput
        label="Senha do cartão"
        description="4 dígitos. Os números ficam ocultos."
        length={4}
        mask
      />
      <PinInput label="Código do autenticador" length={6} groupSize={3} placeholder="·" />
    </Stack>
  )
}
