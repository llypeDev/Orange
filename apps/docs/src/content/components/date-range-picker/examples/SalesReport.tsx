import { DateRangePicker, Stack, Text, type DateRange } from '@orangesys/ui'
import { useState } from 'react'

const DIA = 24 * 60 * 60 * 1000
const hoje = new Date()
const ano = hoje.getFullYear()
const trimestre = Math.floor(hoje.getMonth() / 3)

export default function SalesReport() {
  const [periodo, setPeriodo] = useState<DateRange>({
    start: new Date(ano, hoje.getMonth(), hoje.getDate() - 6),
    end: hoje,
  })
  const dias =
    periodo.start && periodo.end
      ? Math.round((periodo.end.getTime() - periodo.start.getTime()) / DIA) + 1
      : 0

  return (
    <Stack gap={3}>
      <DateRangePicker
        label="Período do relatório de vendas"
        description="Pedidos faturados até hoje."
        value={periodo}
        onChange={setPeriodo}
        max={hoje}
        weekStartsOn={1}
        presets={[
          'today',
          'last7Days',
          'last30Days',
          'thisMonth',
          'lastMonth',
          {
            label: 'Trimestre anterior',
            range: () => ({
              start: new Date(ano, (trimestre - 1) * 3, 1),
              end: new Date(ano, trimestre * 3, 0),
            }),
          },
        ]}
      />
      <Text size="sm" tone="muted" aria-live="polite">
        {dias > 0
          ? `Exibindo vendas de ${dias} ${dias === 1 ? 'dia' : 'dias'}.`
          : 'Escolha o período para atualizar o relatório.'}
      </Text>
    </Stack>
  )
}
