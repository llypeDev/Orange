import { Stack, Tab, TabList, TabPanel, Tabs } from '@orangesys/ui'
import { useState } from 'react'

const periods = { '7d': 'Últimos 7 dias', '30d': 'Últimos 30 dias', '90d': 'Últimos 90 dias', '12m': 'Últimos 12 meses' }
type Period = keyof typeof periods

export default function Manual() {
  const [period, setPeriod] = useState<Period>('30d')
  return (
    <Stack gap={3} style={{ width: '100%' }}>
      {/* Cada painel dispara uma consulta pesada: seleção só com Enter/Espaço. */}
      <Tabs value={period} onChange={(v) => setPeriod(v as Period)} activation="manual" size="sm">
        <TabList aria-label="Período do relatório">
          {Object.entries(periods).map(([value, label]) => (
            <Tab key={value} value={value}>
              {label}
            </Tab>
          ))}
        </TabList>
        {Object.keys(periods).map((value) => (
          <TabPanel key={value} value={value}>
            Receita, pedidos e ticket médio — {periods[value as Period].toLowerCase()}.
          </TabPanel>
        ))}
      </Tabs>
      <small style={{ color: 'var(--or-color-text-subtle)' }}>Período carregado: {period}</small>
    </Stack>
  )
}
