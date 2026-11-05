import { RangeCalendar, Text, type DateRange } from '@orange/ui'
import { useState } from 'react'

const DIA = 24 * 60 * 60 * 1000
const hoje = new Date()
const ehFimDeSemana = (data: Date) => data.getDay() === 0 || data.getDay() === 6

export default function TeamVacation() {
  const [ferias, setFerias] = useState<DateRange | null>(null)
  const dias =
    ferias?.start && ferias.end
      ? Math.round((ferias.end.getTime() - ferias.start.getTime()) / DIA) + 1
      : 0

  return (
    <div style={{ display: 'grid', gap: 12, justifyItems: 'start' }}>
      <RangeCalendar
        aria-label="Férias da equipe de suporte"
        value={ferias}
        onChange={setFerias}
        min={hoje}
        maxLength={29}
        visibleMonths={2}
        weekStartsOn={1}
        isDateDisabled={ehFimDeSemana}
      />
      <Text size="sm" tone="muted">
        {dias > 0
          ? `${dias} dias corridos de férias, começando e terminando em dias úteis.`
          : 'Clique no primeiro e no último dia das férias (até 30 dias corridos).'}
      </Text>
    </div>
  )
}
