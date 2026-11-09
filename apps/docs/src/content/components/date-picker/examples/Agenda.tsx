import { Calendar, Stack, Text, useLocale } from '@orangesys/ui'
import { useState } from 'react'

const hoje = new Date()
const ano = hoje.getFullYear()
const mes = hoje.getMonth()

const eventos: Record<string, string[]> = {
  [new Date(ano, mes, 5).toDateString()]: ['09:30 · Daily do time de pagamentos'],
  [new Date(ano, mes, 12).toDateString()]: [
    '14:00 · Revisão de design do checkout',
    '16:30 · 1:1 com a liderança',
  ],
  [new Date(ano, mes, 18).toDateString()]: ['10:00 · Planejamento do trimestre'],
}

export default function Agenda() {
  const { locale } = useLocale()
  const [dia, setDia] = useState<Date | null>(new Date(ano, mes, 12))
  const doDia = dia ? (eventos[dia.toDateString()] ?? []) : []

  return (
    <Stack gap={8} direction="horizontal" align="start" wrap>
      <Calendar value={dia} onChange={setDia} weekStartsOn={1} showTodayButton />
      <div style={{ minWidth: 220 }}>
        <p className="or-eyebrow">
          {dia?.toLocaleDateString(locale, { weekday: 'long', day: 'numeric', month: 'long' })}
        </p>
        {doDia.length > 0 ? (
          <ul style={{ margin: '8px 0 0', paddingLeft: 18 }}>
            {doDia.map((evento) => (
              <li key={evento}>{evento}</li>
            ))}
          </ul>
        ) : (
          <Text size="sm" tone="muted">
            Nenhum compromisso neste dia.
          </Text>
        )}
      </div>
    </Stack>
  )
}
