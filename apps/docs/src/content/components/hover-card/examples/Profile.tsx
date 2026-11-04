import { HoverCard } from '@orange/ui'

function Perfil() {
  return (
    <div style={{ display: 'grid', gap: 12 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <span
          aria-hidden="true"
          style={{
            display: 'grid',
            placeItems: 'center',
            width: 44,
            height: 44,
            borderRadius: '50%',
            background: 'var(--or-color-accent)',
            color: 'var(--or-color-text-on-accent)',
            fontFamily: 'var(--or-font-display)',
            fontWeight: 700,
          }}
        >
          AS
        </span>
        <div style={{ display: 'grid' }}>
          <strong style={{ fontFamily: 'var(--or-font-display)', fontSize: 16 }}>Ana Souza</strong>
          <span style={{ color: 'var(--or-color-text-subtle)' }}>@ana.souza</span>
        </div>
      </div>
      <p style={{ margin: 0, color: 'var(--or-color-text-muted)' }}>
        Designer de produto no time de Pagamentos. Cuida do checkout e do app do lojista.
      </p>
      <span style={{ fontSize: 12, color: 'var(--or-color-text-subtle)' }}>
        São Paulo · 14 projetos · desde 2021
      </span>
    </div>
  )
}

export default function Profile() {
  return (
    <p style={{ margin: 0 }}>
      Revisão solicitada por{' '}
      <HoverCard trigger={<a href="#perfil-ana">Ana Souza</a>} placement="bottom-start">
        <Perfil />
      </HoverCard>{' '}
      há 2 horas.
    </p>
  )
}
