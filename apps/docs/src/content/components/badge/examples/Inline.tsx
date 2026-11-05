import { Badge, Icon } from '@orangesys/ui'

const folders = [
  { name: 'Caixa de entrada', icon: 'inbox', count: 12, label: '12 não lidas', tone: 'accent' },
  { name: 'Aguardando aprovação', icon: 'clock', count: 3, label: '3 pendentes', tone: 'warning' },
  { name: 'Com erro', icon: 'alert-triangle', count: 1, label: '1 com erro', tone: 'danger' },
  { name: 'Arquivadas', icon: 'folder', count: 0, label: 'nenhuma', tone: 'neutral' },
] as const

export default function Inline() {
  return (
    <nav aria-label="Pastas" style={{ width: '100%', maxWidth: 320 }}>
      <ul style={{ display: 'grid', gap: 4, margin: 0, padding: 0, listStyle: 'none' }}>
        {folders.map((folder) => (
          <li key={folder.name}>
            <a
              href={`#${folder.icon}`}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '8px 12px',
                color: 'inherit',
                textDecoration: 'none',
                border: '1px solid var(--or-color-border)',
              }}
            >
              <Icon name={folder.icon} size="sm" />
              <span style={{ marginRight: 'auto' }}>{folder.name}</span>
              {/* count 0 esconde o badge automaticamente */}
              <Badge count={folder.count} tone={folder.tone} label={folder.label} />
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
