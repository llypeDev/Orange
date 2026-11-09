import { Stack, Table, type TableColumn } from '@orangesys/ui'
import { useState } from 'react'

interface Reading {
  id: string
  sensor: string
  site: string
  kind: string
  value: number
  takenAt: Date
}

const sites = ['Guarulhos', 'Extrema', 'Recife', 'Curitiba']
const kinds = ['Temperatura', 'Umidade', 'Vibração']
const time = new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })

// 10.000 leituras fictícias, geradas de forma determinística.
const readings: Reading[] = Array.from({ length: 10000 }, (_, index) => ({
  id: `L-${String(index + 1).padStart(5, '0')}`,
  sensor: `S-${String((index % 48) + 1).padStart(2, '0')}`,
  site: sites[index % sites.length],
  kind: kinds[index % kinds.length],
  value: Math.round((18 + ((index * 37) % 640) / 10) * 10) / 10,
  takenAt: new Date(2026, 10, 1, 0, index * 3),
}))

const option = (value: string) => ({ value, label: value })

const columns: TableColumn<Reading>[] = [
  { key: 'id', header: 'Leitura', rowHeader: true, sortable: true, filter: 'text', width: 140 },
  { key: 'sensor', header: 'Sensor', sortable: true, filter: 'text', width: 120 },
  { key: 'site', header: 'Unidade', filter: 'select', filterOptions: sites.map(option) },
  { key: 'kind', header: 'Grandeza', filter: 'select', filterOptions: kinds.map(option) },
  { key: 'value', header: 'Valor', align: 'end', sortable: true, render: (r) => r.value.toLocaleString('pt-BR', { minimumFractionDigits: 1 }) },
  { key: 'takenAt', header: 'Medida em', sortable: true, render: (r) => time.format(r.takenAt) },
]

export default function Virtualized() {
  const [selected, setSelected] = useState<string[]>([])

  return (
    <Stack gap={3}>
      <p style={{ margin: 0 }} aria-live="polite">
        {selected.length.toLocaleString('pt-BR')} de {readings.length.toLocaleString('pt-BR')} leituras selecionadas
      </p>
      {/* virtualized exige maxHeight: só as linhas à vista vão para o DOM. */}
      <Table
        caption="Leituras dos sensores"
        hideCaption
        columns={columns}
        data={readings}
        virtualized
        maxHeight={420}
        density="compact"
        striped
        selectable
        selectedRows={selected}
        onSelectedRowsChange={setSelected}
      />
    </Stack>
  )
}
