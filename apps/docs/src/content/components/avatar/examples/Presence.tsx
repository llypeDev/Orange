import { Avatar, type AvatarStatus } from '@orange/ui'
import beatriz from './photos/beatriz.svg'
import mariana from './photos/mariana.svg'

interface Member {
  name: string
  role: string
  photo?: string
  status: AvatarStatus
  statusLabel?: string
}

const team: Member[] = [
  { name: 'Mariana Lopes', role: 'Product designer', photo: mariana, status: 'online' },
  { name: 'Rafael Costa', role: 'Engenheiro front-end', status: 'busy', statusLabel: 'Ocupado, em reunião até 15h' },
  { name: 'Beatriz Nunes', role: 'Pesquisadora UX', photo: beatriz, status: 'away' },
  { name: 'Thiago Rocha', role: 'Gerente de produto', status: 'offline' },
]

export default function Presence() {
  return (
    <ul style={{ display: 'grid', gap: 16, margin: 0, padding: 0, listStyle: 'none' }}>
      {team.map((person) => (
        <li key={person.name} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {/* alt="" porque o nome já está escrito ao lado; o status continua acessível */}
          <Avatar
            alt=""
            name={person.name}
            src={person.photo}
            status={person.status}
            statusLabel={person.statusLabel}
            pulse={person.status === 'online'}
          />
          <span style={{ display: 'grid' }}>
            <strong style={{ fontWeight: 600 }}>{person.name}</strong>
            <span style={{ color: 'var(--or-color-text-subtle)', fontSize: 'var(--or-text-sm)' }}>{person.role}</span>
          </span>
        </li>
      ))}
    </ul>
  )
}
