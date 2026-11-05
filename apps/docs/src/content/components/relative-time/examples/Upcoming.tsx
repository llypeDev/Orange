import { RelativeTime } from '@orangesys/ui'

const daqui = (horas: number) => new Date(Date.now() + horas * 3_600_000)

const agenda = [
  { evento: 'Reunião de planejamento', quando: daqui(2) },
  { evento: 'Vencimento do relatório trimestral', quando: daqui(26) },
  { evento: 'Renovação do plano Pro', quando: daqui(24 * 40) },
]

export default function Upcoming() {
  return (
    <ul style={{ display: 'grid', gap: 10, margin: 0, padding: 0, listStyle: 'none' }}>
      {agenda.map((item) => (
        <li key={item.evento}>
          {item.evento} — <RelativeTime date={item.quando} format="relative" style={{ fontWeight: 600 }} />
        </li>
      ))}
    </ul>
  )
}
