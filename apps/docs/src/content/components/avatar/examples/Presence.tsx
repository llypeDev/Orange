import { Avatar } from '@orange/ui'
import beatriz from './photos/beatriz.svg'
import mariana from './photos/mariana.svg'

const team = [
  { name: 'Mariana Lopes', role: 'Product designer', src: mariana, status: 'online' },
  { name: 'Rafael Costa', role: 'Engenheiro front-end', status: 'busy', statusLabel: 'Ocupado — em reunião até 15h' },
  { name: 'Beatriz Nunes', role: 'Pesquisadora UX', src: beatriz, status: 'away' },
  { name: 'Thiago Rocha', role: 'Gerente de produto', status: 'offline' },
] as const

export default function Presence() {
  return (
    <ul style={{ display: 'grid', gap: 16, margin: 0, padding: 0, listStyle: 'none' }}>
      {team.map((person) => (
        <li key={person.name} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {/* alt="" porque o nome já está escrito ao lado; o status continua acessível */}
          <Avatar
            alt=""
            name={person.name}
            src={'src' in person ? person.src : undefined}
            status={person.status}
            statusLabel={'statusLabel' in person ? person.statusLabel : undefined}
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
