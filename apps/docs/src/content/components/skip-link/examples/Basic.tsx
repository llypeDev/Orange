import { SkipLink } from '@orangesys/ui'

export default function Basic() {
  return (
    // transform cria um contexto para o position: fixed — só para a prévia.
    <div style={{ position: 'relative', width: '100%', minHeight: 200, transform: 'translateZ(0)', border: '1px solid var(--or-color-border)' }}>
      <SkipLink href="#conteudo-pedidos" />
      <nav aria-label="Principal" style={{ display: 'flex', gap: 20, padding: '14px 16px', borderBottom: '1px solid var(--or-color-border)' }}>
        <a href="#painel">Painel</a>
        <a href="#pedidos">Pedidos</a>
        <a href="#clientes">Clientes</a>
        <a href="#relatorios">Relatórios</a>
      </nav>
      <div id="conteudo-pedidos" style={{ padding: 16 }}>
        <h4 style={{ margin: '0 0 8px' }}>Pedidos</h4>
        <p style={{ margin: 0, color: 'var(--or-color-text-muted)' }}>
          Com o atalho em foco, Enter pula a navegação e traz o foco para este bloco.
        </p>
      </div>
    </div>
  )
}
