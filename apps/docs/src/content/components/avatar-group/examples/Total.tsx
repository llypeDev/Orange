import { Avatar, AvatarGroup } from '@orangesys/ui'

// A API devolveu só os 5 primeiros participantes, mas o evento tem 128.
const firstPage = ['Lívia Martins', 'Pedro Henrique', 'Sofia Ramos', 'Gustavo Lima', 'Helena Duarte']

export default function Total() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <AvatarGroup label="Participantes do webinar" total={128} size="sm" shape="circle">
        {firstPage.map((name) => (
          <Avatar key={name} name={name} />
        ))}
      </AvatarGroup>
      <span style={{ color: 'var(--or-color-text-muted)', fontSize: 'var(--or-text-sm)' }}>128 inscritos</span>
    </div>
  )
}
