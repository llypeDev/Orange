import { Stack, Table, type TableColumn, type TableColumnWidths } from '@orangesys/ui'
import { useState } from 'react'

interface Shipment {
  id: string
  customer: string
  origin: string
  destination: string
  carrier: string
  weight: number
  status: string
  freight: number
}

const brl = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })

const shipments: Shipment[] = [
  { id: 'ENV-3301', customer: 'Padaria Aurora', origin: 'Guarulhos (SP)', destination: 'Recife (PE)', carrier: 'Rota Norte', weight: 12.4, status: 'Em trânsito', freight: 186.5 },
  { id: 'ENV-3302', customer: 'Clínica Bem Viver', origin: 'Extrema (MG)', destination: 'Curitiba (PR)', carrier: 'Via Sul', weight: 3.1, status: 'Entregue', freight: 64.9 },
  { id: 'ENV-3303', customer: 'Atelier Norte', origin: 'Guarulhos (SP)', destination: 'Belém (PA)', carrier: 'Rota Norte', weight: 27.8, status: 'Aguardando coleta', freight: 412 },
  { id: 'ENV-3304', customer: 'Livraria Ponto e Vírgula', origin: 'Recife (PE)', destination: 'Goiânia (GO)', carrier: 'Expresso Cerrado', weight: 8.6, status: 'Em trânsito', freight: 143.2 },
  { id: 'ENV-3305', customer: 'Oficina do Bairro', origin: 'Extrema (MG)', destination: 'Porto Alegre (RS)', carrier: 'Via Sul', weight: 41.5, status: 'Entregue', freight: 298.75 },
]

const columns: TableColumn<Shipment>[] = [
  // pinned: a coluna fica presa à borda enquanto as outras rolam.
  { key: 'id', header: 'Envio', rowHeader: true, pinned: 'start' },
  // resizable: arraste a borda direita do cabeçalho; clique duplo ajusta ao conteúdo.
  { key: 'customer', header: 'Cliente', sortable: true, resizable: true },
  { key: 'origin', header: 'Origem', resizable: true },
  { key: 'destination', header: 'Destino', resizable: true },
  { key: 'carrier', header: 'Transportadora', resizable: true },
  { key: 'weight', header: 'Peso (kg)', align: 'end', sortable: true, render: (s) => s.weight.toLocaleString('pt-BR') },
  { key: 'status', header: 'Situação' },
  { key: 'freight', header: 'Frete', align: 'end', pinned: 'end', render: (s) => brl.format(s.freight) },
]

// Com a largura de todas as colunas informada, a tabela já nasce com largura fixa (a soma delas)
// e rola na horizontal quando não cabe. Sem isso, as larguras são registradas no primeiro
// redimensionamento.
const INITIAL_WIDTHS: TableColumnWidths = {
  id: 120,
  customer: 220,
  origin: 170,
  destination: 170,
  carrier: 180,
  weight: 120,
  status: 170,
  freight: 120,
}

export default function PinnedResizable() {
  // Controlado para mostrar (ou guardar) as larguras; defaultColumnWidths bastaria para iniciar.
  const [widths, setWidths] = useState(INITIAL_WIDTHS)

  return (
    <Stack gap={3}>
      <Table
        caption="Envios da semana"
        columns={columns}
        data={shipments}
        selectable
        columnWidths={widths}
        onColumnWidthsChange={setWidths}
      />
      <p style={{ margin: 0 }} aria-live="polite">
        Cliente {widths.customer}px · Origem {widths.origin}px · Destino {widths.destination}px · Transportadora{' '}
        {widths.carrier}px
      </p>
    </Stack>
  )
}
