import { Button, DatePicker } from '@orange/ui'
import { useState, type FormEvent } from 'react'

export default function Validation() {
  const [vencimento, setVencimento] = useState<Date | null>(null)
  const [enviado, setEnviado] = useState(false)

  const enviar = (event: FormEvent) => {
    event.preventDefault()
    setEnviado(true)
  }

  return (
    <form onSubmit={enviar} noValidate style={{ display: 'grid', gap: 16, justifyItems: 'start' }}>
      <DatePicker
        label="Vencimento do boleto"
        required
        name="vencimento"
        value={vencimento}
        onChange={setVencimento}
        error={enviado && !vencimento ? 'Informe uma data de vencimento válida.' : undefined}
      />
      <DatePicker label="Data de emissão" defaultValue={new Date(2026, 9, 1)} readOnly />
      <DatePicker label="Data de compensação" disabled />
      <Button type="submit">Gerar boleto</Button>
    </form>
  )
}
