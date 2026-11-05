import { PinInput } from '@orangesys/ui'

export default function Alphanumeric() {
  return (
    <PinInput
      label="Código do cupom"
      description="Letras e números — tente colar “PRIMA2026”."
      type="alphanumeric"
      length={8}
      groupSize={4}
      size="sm"
    />
  )
}
