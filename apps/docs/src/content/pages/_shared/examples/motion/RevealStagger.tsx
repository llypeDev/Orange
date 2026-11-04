import { Button, Icon, Reveal, useReducedMotion } from '@orange/ui'
import { useRef } from 'react'

const etapas = ['01 Tokens', '02 Fundamentos', '03 Componentes', '04 Storybook']

export default function RevelacaoEscalonada() {
  const caixa = useRef<HTMLDivElement>(null)
  const reduzido = useReducedMotion()
  // Volta ao topo (o grupo sai da área visível e se esconde) e rola até ele de novo.
  const repetir = () => {
    const el = caixa.current
    if (!el) return
    el.scrollTo({ top: 0 })
    window.setTimeout(() => el.scrollTo({ top: el.scrollHeight, behavior: reduzido ? 'auto' : 'smooth' }), 150)
  }
  return (
    <div className="guide-stack">
      <div ref={caixa} className="guide-stage" tabIndex={0} role="region" aria-label="Área rolável: revelação escalonada">
        <p className="guide-stage__hint">
          Role dentro da caixa <Icon name="arrow-down" size="sm" />
        </p>
        <div className="guide-stage__spacer" />
        {/* stagger: cada filho entra --or-stagger (80ms) depois do anterior; once={false} repete ao voltar */}
        <Reveal stagger once={false} className="guide-reveal-grid">
          {etapas.map((etapa) => (
            <div key={etapa} className="guide-reveal-card">
              {etapa}
            </div>
          ))}
        </Reveal>
      </div>
      <div>
        <Button size="sm" variant="ghost" startIcon={<Icon name="refresh" size="sm" />} onClick={repetir}>
          Repetir
        </Button>
      </div>
    </div>
  )
}
