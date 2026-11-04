import { Icon } from '@orange/ui'

const planos = [
  { nome: 'Starter', preco: 'R$ 0', texto: '1 loja, 100 pedidos por mês.' },
  { nome: 'Pro', preco: 'R$ 49', texto: 'Até 10 lojas e relatórios.' },
  { nome: 'Escala', preco: 'R$ 199', texto: 'Lojas ilimitadas e API.' },
]

export default function CartoesQueSobem() {
  return (
    <ul className="guide-lift-grid">
      {planos.map((plano) => (
        <li key={plano.nome}>
          {/* or-lift: sobe --or-distance-lift (4px) com sombra 0 8px 0 -4px no hover e no foco */}
          <a href="#elevar" className="guide-lift-card or-lift or-nudge">
            <span className="or-eyebrow">{plano.nome}</span>
            <strong>{plano.preco}/mês</strong>
            <span>{plano.texto}</span>
            <span className="guide-lift-card__more">
              Ver plano <Icon name="arrow-right" size="sm" className="or-nudge__icon" />
            </span>
          </a>
        </li>
      ))}
    </ul>
  )
}
