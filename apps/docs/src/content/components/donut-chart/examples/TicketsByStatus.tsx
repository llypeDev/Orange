import { DonutChart } from '@orangesys/ui'

export default function TicketsByStatus() {
  return (
    <div style={{ width: '100%' }}>
      <DonutChart
        title="Tickets por status"
        description="Suporte · semana 44 de 2026"
        summary="Seis em cada dez tickets da semana já foram resolvidos; 42 seguem abertos."
        categoryLabel="Status"
        centerLabel="tickets"
        data={[
          { label: 'Resolvidos', value: 118 },
          { label: 'Abertos', value: 42 },
          { label: 'Em andamento', value: 31 },
          { label: 'Aguardando cliente', value: 9 },
        ]}
      />
    </div>
  )
}
