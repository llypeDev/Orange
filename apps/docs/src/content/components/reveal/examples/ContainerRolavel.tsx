import { Button, Icon, Reveal, useReducedMotion } from '@orange/ui'
import { useRef } from 'react'

const pedidos = [
  { id: '#4821', cliente: 'Ana Souza', total: 'R$ 289,90' },
  { id: '#4822', cliente: 'Bruno Lima', total: 'R$ 74,50' },
  { id: '#4823', cliente: 'Carla Dias', total: 'R$ 1.120,00' },
  { id: '#4824', cliente: 'Diego Alves', total: 'R$ 56,00' },
  { id: '#4825', cliente: 'Elisa Rocha', total: 'R$ 432,10' },
  { id: '#4826', cliente: 'Fábio Nunes', total: 'R$ 98,40' },
]

export default function ContainerRolavel() {
  const caixa = useRef<HTMLDivElement>(null)
  const reduzido = useReducedMotion()
  const repetir = () => {
    const el = caixa.current
    if (!el) return
    el.scrollTo({ top: 0 })
    window.setTimeout(
      () => el.scrollTo({ top: el.scrollHeight, behavior: reduzido ? 'auto' : 'smooth' }),
      150,
    )
  }
  return (
    <div className="guide-stack">
      <div
        ref={caixa}
        className="guide-stage"
        tabIndex={0}
        role="region"
        aria-label="Pedidos recentes (área rolável)"
      >
        <p className="guide-stage__hint">
          Role dentro da caixa <Icon name="arrow-down" size="sm" />
        </p>
        <div className="guide-stage__spacer" />
        <ul className="guide-reveal-orders">
          {pedidos.map((p) => (
            // once={false}: esconde ao sair da área visível e revela de novo ao voltar
            <Reveal as="li" key={p.id} once={false} className="guide-reveal-order">
              <span className="guide-mono">{p.id}</span>
              <span>{p.cliente}</span>
              <strong>{p.total}</strong>
            </Reveal>
          ))}
        </ul>
      </div>
      <div>
        <Button
          size="sm"
          variant="ghost"
          startIcon={<Icon name="refresh" size="sm" />}
          onClick={repetir}
        >
          Repetir
        </Button>
      </div>
    </div>
  )
}
