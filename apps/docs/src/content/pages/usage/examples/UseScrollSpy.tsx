import { useScrollSpy } from '@orangesys/ui'
import { useRef } from 'react'

const etapas = [
  { id: 'spy-resumo', titulo: 'Resumo' },
  { id: 'spy-entrega', titulo: 'Entrega' },
  { id: 'spy-pagamento', titulo: 'Pagamento' },
  { id: 'spy-revisao', titulo: 'Revisão' },
]

export default function IndiceProprio() {
  const painel = useRef<HTMLDivElement>(null)
  // Painel rolável: a faixa é o topo do painel (30%). Sem `root`, vale a janela.
  const { activeId, setActiveId } = useScrollSpy(
    etapas.map((etapa) => etapa.id),
    { root: painel, rootMargin: '0px 0px -70% 0px' },
  )
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24, width: '100%' }}>
      <nav aria-label="Etapas do checkout" style={{ flex: '0 0 180px' }}>
        <ol style={{ margin: 0, padding: 0, listStyle: 'none', display: 'grid', gap: 4 }}>
          {etapas.map((etapa, i) => {
            const atual = activeId === etapa.id
            return (
              <li key={etapa.id}>
                <a
                  href={`#${etapa.id}`}
                  aria-current={atual ? 'location' : undefined}
                  // Marca na hora e segura a marca durante o salto.
                  onClick={() => setActiveId(etapa.id)}
                  style={{
                    display: 'flex',
                    gap: 10,
                    alignItems: 'center',
                    padding: '6px 10px',
                    textDecoration: 'none',
                    color: atual ? 'var(--or-color-text)' : 'var(--or-color-text-muted)',
                    background: atual ? 'var(--or-color-accent-subtle)' : 'transparent',
                    fontWeight: atual ? 600 : 400,
                  }}
                >
                  <span
                    aria-hidden="true"
                    style={{ fontFamily: 'var(--or-font-mono)', fontSize: 12 }}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  {etapa.titulo}
                </a>
              </li>
            )
          })}
        </ol>
      </nav>
      <div
        ref={painel}
        tabIndex={0}
        role="region"
        aria-label="Checkout"
        style={{ flex: '1 1 280px', minWidth: 0, height: 280, overflow: 'auto', paddingRight: 16 }}
      >
        {etapas.map((etapa) => (
          <section key={etapa.id} style={{ minHeight: 160 }}>
            <h4 id={etapa.id} style={{ margin: '0 0 8px' }}>
              {etapa.titulo}
            </h4>
            <p style={{ margin: 0, color: 'var(--or-color-text-muted)' }}>
              Conteúdo da etapa “{etapa.titulo.toLowerCase()}” do checkout.
            </p>
          </section>
        ))}
      </div>
    </div>
  )
}
