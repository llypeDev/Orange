import { Button, DateRangePicker, type DateRange } from '@orangesys/ui'
import { useState, type FormEvent } from 'react'

export default function Validation() {
  const [vigencia, setVigencia] = useState<DateRange>({ start: null, end: null })
  const [enviado, setEnviado] = useState(false)

  const enviar = (event: FormEvent) => {
    event.preventDefault()
    setEnviado(true)
  }

  return (
    <form onSubmit={enviar} noValidate style={{ display: 'grid', gap: 16, justifyItems: 'start' }}>
      <DateRangePicker
        label="Vigência do contrato"
        description="Tente digitar uma data final anterior à inicial."
        required
        name="vigencia"
        value={vigencia}
        onChange={setVigencia}
        error={
          enviado && (!vigencia.start || !vigencia.end)
            ? 'Informe o início e o fim da vigência.'
            : undefined
        }
      />
      <DateRangePicker
        label="Período de apuração"
        defaultValue={{ start: new Date(2026, 9, 1), end: new Date(2026, 9, 31) }}
        readOnly
      />
      <DateRangePicker label="Período de carência" disabled />
      <Button type="submit">Salvar contrato</Button>
    </form>
  )
}
