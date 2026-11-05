import { TableOfContents } from '@orangesys/ui'
import { useRef } from 'react'

const sections = [
  { id: 'guia-credenciais', label: 'Credenciais', level: 2 },
  { id: 'guia-sandbox', label: 'Ambiente de testes', level: 3 },
  { id: 'guia-producao', label: 'Produção', level: 3 },
  { id: 'guia-webhooks', label: 'Webhooks', level: 2 },
  { id: 'guia-erros', label: 'Tratamento de erros', level: 2 },
  { id: 'guia-limites', label: 'Limites de uso', level: 2 },
]

export default function Manual() {
  const panelRef = useRef<HTMLDivElement>(null)
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 32, width: '100%' }}>
      <div
        ref={panelRef}
        tabIndex={0}
        role="region"
        aria-label="Guia de integração"
        style={{ flex: '1 1 320px', height: 320, overflow: 'auto', paddingRight: 16 }}
      >
        {sections.map((s) => {
          const Heading = s.level === 2 ? 'h4' : 'h5'
          return (
            <section key={s.id} style={{ minHeight: 180 }}>
              <Heading id={s.id} style={{ margin: '0 0 8px' }}>
                {s.label}
              </Heading>
              <p style={{ margin: 0, color: 'var(--or-color-text-muted)' }}>
                Instruções sobre {s.label.toLowerCase()} para integrar a API de pagamentos.
              </p>
            </section>
          )
        })}
      </div>
      <TableOfContents
        items={sections}
        title="Neste guia"
        root={panelRef}
        rootMargin="0px 0px -70% 0px"
        style={{ flex: '0 0 200px' }}
      />
    </div>
  )
}
