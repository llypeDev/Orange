import { Icon } from '@orange/ui'
import { useId, useState } from 'react'

const perguntas = [
  {
    p: 'Posso trocar de plano depois?',
    r: 'Sim. A mudança vale a partir do próximo ciclo e o valor é calculado proporcionalmente.',
  },
  {
    p: 'Como exporto meus pedidos?',
    r: 'Em Pedidos → Exportar. O arquivo CSV chega por e-mail em poucos minutos.',
  },
]

function Pergunta({ p, r }: { p: string; r: string }) {
  const [aberto, setAberto] = useState(false)
  const id = useId()
  return (
    <div className="guide-faq">
      <button
        type="button"
        className="guide-faq__trigger"
        aria-expanded={aberto}
        aria-controls={id}
        onClick={() => setAberto((v) => !v)}
      >
        {p}
        <Icon name="chevron-down" size="sm" className="guide-faq__chevron" />
      </button>
      {/* or-collapse: grid-template-rows 0fr → 1fr + opacidade em --or-duration-slow */}
      <div id={id} className="or-collapse" data-state={aberto ? 'open' : 'closed'} inert={!aberto}>
        <div>
          <p className="guide-faq__answer">{r}</p>
        </div>
      </div>
    </div>
  )
}

export default function PerguntasFrequentes() {
  return (
    <div className="guide-faq-list">
      {perguntas.map((item) => (
        <Pergunta key={item.p} {...item} />
      ))}
    </div>
  )
}
