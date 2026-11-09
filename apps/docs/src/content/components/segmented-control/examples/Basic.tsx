import { SegmentedControl, Stack } from '@orangesys/ui'
import { useState } from 'react'

const labels: Record<string, string> = {
  day: 'de hoje',
  week: 'dos últimos 7 dias',
  month: 'dos últimos 30 dias',
  year: 'de 2026',
}

export default function Basic() {
  const [period, setPeriod] = useState('week')

  return (
    <Stack gap={3}>
      <SegmentedControl
        label="Período do relatório"
        value={period}
        onChange={setPeriod}
        options={[
          { value: 'day', label: 'Dia' },
          { value: 'week', label: 'Semana' },
          { value: 'month', label: 'Mês' },
          { value: 'year', label: 'Ano' },
        ]}
      />
      <p style={{ margin: 0, fontSize: 'var(--or-text-sm)', color: 'var(--or-color-text-muted)' }}>
        Exibindo vendas {labels[period]}.
      </p>
    </Stack>
  )
}
