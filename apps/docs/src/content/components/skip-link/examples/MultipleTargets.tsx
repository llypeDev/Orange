import { SkipLink } from '@orangesys/ui'

export default function MultipleTargets() {
  return (
    <div style={{ position: 'relative', width: '100%', minHeight: 220, transform: 'translateZ(0)', border: '1px solid var(--or-color-border)' }}>
      <SkipLink href="#loja-resultados" />
      <SkipLink href="#loja-busca">
        Pular para a busca
      </SkipLink>
      <nav aria-label="Categorias" style={{ display: 'flex', flexWrap: 'wrap', gap: '8px 20px', padding: '14px 16px', borderBottom: '1px solid var(--or-color-border)' }}>
        <a href="#notebooks">Notebooks</a>
        <a href="#monitores">Monitores</a>
        <a href="#acessorios">Acessórios</a>
      </nav>
      <div style={{ display: 'grid', gap: 12, padding: 16 }}>
        <label style={{ display: 'grid', gap: 4, maxWidth: 320 }}>
          <span style={{ fontSize: 13 }}>Buscar produtos</span>
          <input id="loja-busca" className="or-control or-control--sm" type="search" />
        </label>
        <div id="loja-resultados">
          <strong>128 resultados</strong>
        </div>
      </div>
    </div>
  )
}
