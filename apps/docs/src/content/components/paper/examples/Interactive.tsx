import { Icon, Paper } from '@orangesys/ui'

const planos = [
  { nome: 'Essencial', resumo: 'Até 5 usuários e conciliação diária.', href: '#plano-essencial' },
  { nome: 'Pro', resumo: 'Usuários ilimitados e relatórios avançados.', href: '#plano-pro' },
  { nome: 'Empresa', resumo: 'SSO, auditoria e suporte dedicado.', href: '#plano-empresa' },
]

export default function Interactive() {
  return (
    <ul
      style={{
        display: 'grid',
        gap: 16,
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
        width: '100%',
        margin: 0,
        padding: '8px 0',
        listStyle: 'none',
      }}
    >
      {planos.map((plano) => (
        <li key={plano.nome}>
          {/* or-nudge: a seta desliza 4px no hover/foco (utilitário de motion.css) */}
          <Paper as="a" href={plano.href} interactive padding={5} className="or-nudge">
            <p className="or-eyebrow" style={{ margin: 0 }}>
              Plano
            </p>
            <strong style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 6, fontSize: 18 }}>
              {plano.nome}
              <span className="or-nudge__icon" aria-hidden="true">
                <Icon name="arrow-right" size="sm" />
              </span>
            </strong>
            <span style={{ display: 'block', marginTop: 4, color: 'var(--or-color-text-muted)', fontSize: 14 }}>
              {plano.resumo}
            </span>
          </Paper>
        </li>
      ))}
    </ul>
  )
}
