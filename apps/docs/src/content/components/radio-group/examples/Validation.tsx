import { Button, RadioGroup } from '@orangesys/ui'
import { useState, type FormEvent } from 'react'

export default function Validation() {
  const [payment, setPayment] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(false)

  const onSubmit = (event: FormEvent) => {
    event.preventDefault()
    setSubmitted(true)
  }

  return (
    <form onSubmit={onSubmit} noValidate style={{ display: 'grid', gap: 20 }}>
      <RadioGroup
        label="Forma de pagamento"
        required
        value={payment}
        onChange={setPayment}
        error={submitted && !payment ? 'Escolha uma forma de pagamento.' : undefined}
        options={[
          { value: 'pix', label: 'Pix', description: 'Aprovação na hora.' },
          { value: 'cartao', label: 'Cartão de crédito', description: 'Em até 12x.' },
          { value: 'boleto', label: 'Boleto', description: 'Compensa em até 3 dias úteis.' },
        ]}
      />
      <div>
        <Button type="submit">Finalizar compra</Button>
      </div>
    </form>
  )
}
