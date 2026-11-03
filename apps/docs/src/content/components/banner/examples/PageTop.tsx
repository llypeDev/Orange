import { Banner } from '@orange/ui'

export default function PageTop() {
  return (
    <div style={{ width: '100%', border: '1px solid var(--or-color-border)' }}>
      <Banner
        tone="info"
        title="Nova central de ajuda"
        action={<a href="#ajuda">Conhecer</a>}
        dismissible
        style={{ borderInline: 0, borderTop: 0 }}
      >
        Artigos, vídeos e o status dos serviços em um só lugar.
      </Banner>
      <header
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          padding: '16px 24px',
          borderBottom: '1px solid var(--or-color-border)',
          fontFamily: 'var(--or-font-display)',
          fontWeight: 700,
        }}
      >
        <span>Painel financeiro</span>
        <span style={{ color: 'var(--or-color-text-subtle)', fontWeight: 400 }}>Ana Souza</span>
      </header>
      <div style={{ padding: 24, color: 'var(--or-color-text-muted)' }}>Conteúdo da página…</div>
    </div>
  )
}
