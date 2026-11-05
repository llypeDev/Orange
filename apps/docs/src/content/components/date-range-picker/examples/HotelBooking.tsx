import { DateRangePicker, Text, type DateRange } from '@orange/ui'
import { useState } from 'react'

const DIA = 24 * 60 * 60 * 1000
const DIARIA = 420
const hoje = new Date()
const moeda = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })

export default function HotelBooking() {
  const [estadia, setEstadia] = useState<DateRange>({ start: null, end: null })
  const noites =
    estadia.start && estadia.end
      ? Math.round((estadia.end.getTime() - estadia.start.getTime()) / DIA)
      : 0

  return (
    <div style={{ display: 'grid', gap: 12 }}>
      <DateRangePicker
        label="Check-in e check-out"
        description="Mínimo de 1 noite e máximo de 14. Datas passadas ficam indisponíveis."
        name="estadia"
        value={estadia}
        onChange={setEstadia}
        min={hoje}
        minLength={1}
        maxLength={14}
        weekStartsOn={1}
        required
      />
      <Text size="sm" tone="muted" aria-live="polite">
        {noites > 0
          ? `${noites} ${noites === 1 ? 'noite' : 'noites'} · ${moeda.format(noites * DIARIA)} (diária de ${moeda.format(DIARIA)})`
          : 'Escolha as datas da estadia.'}
      </Text>
    </div>
  )
}
