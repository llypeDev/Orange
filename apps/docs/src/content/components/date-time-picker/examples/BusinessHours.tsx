import { DateTimePicker } from '@orangesys/ui'
import { useState } from 'react'

const hoje = new Date()
const amanha = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate() + 1, 8, 0)
const limite = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate() + 30, 18, 0)
const ehFimDeSemana = (data: Date) => data.getDay() === 0 || data.getDay() === 6

export default function BusinessHours() {
  const [visita, setVisita] = useState<Date | null>(null)
  const minutos = visita ? visita.getHours() * 60 + visita.getMinutes() : 0
  const foraDoExpediente = visita !== null && (minutos < 8 * 60 || minutos > 17 * 60 + 30)

  return (
    <DateTimePicker
      label="Visita técnica"
      description="Dias úteis a partir de amanhã, das 08:00 às 17:30, de 30 em 30 minutos."
      min={amanha}
      max={limite}
      isDateDisabled={ehFimDeSemana}
      weekStartsOn={1}
      step={1800}
      defaultTime="08:00"
      value={visita}
      onChange={setVisita}
      error={foraDoExpediente ? 'Escolha um horário entre 08:00 e 17:30.' : undefined}
    />
  )
}
