import { Avatar, AvatarGroup, Button } from '@orange/ui'
import type { CSSProperties } from 'react'

const editors = ['Mariana Lopes', 'Rafael Costa', 'Beatriz Nunes', 'Diego Almeida', 'Lívia Martins']

// Em superfícies elevadas, a borda dos avatares acompanha o fundo via --or-avatar-ring.
const panel = {
  '--or-avatar-ring': 'var(--or-color-surface-raised)',
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: 16,
  padding: 20,
  border: '1px solid var(--or-color-border)',
  background: 'var(--or-color-surface-raised)',
} as CSSProperties

export default function OnSurface() {
  return (
    <div style={panel}>
      <span id="editores" style={{ fontWeight: 600 }}>
        Editando agora
      </span>
      <AvatarGroup aria-labelledby="editores" max={3} size="sm">
        {editors.map((name) => (
          <Avatar key={name} name={name} status="online" />
        ))}
      </AvatarGroup>
      <Button variant="outline" size="sm" style={{ marginLeft: 'auto' }}>
        Compartilhar
      </Button>
    </div>
  )
}
