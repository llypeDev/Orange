import { Button, Icon, useReducedMotion } from '@orange/ui'
import { useState } from 'react'

const passos = ['Conecte a loja', 'Importe os pedidos', 'Convide a equipe']

type Fase = 'parado' | 'rodando' | 'fim'

export default function PassosTemporizados() {
  const reduzido = useReducedMotion()
  const [fase, setFase] = useState<Fase>('parado')
  const [atual, setAtual] = useState(0)
  const [rodada, setRodada] = useState(0)

  const iniciar = () => {
    setAtual(0)
    setRodada((n) => n + 1)
    // Com movimento reduzido, nada avança sozinho: mostra o resultado final.
    setFase(reduzido ? 'fim' : 'rodando')
  }

  return (
    <div className="guide-stack">
      <ol className="guide-steps-timed">
        {passos.map((passo, i) => {
          const cheio = fase === 'fim' || (fase === 'rodando' && i < atual)
          const animando = fase === 'rodando' && i === atual
          return (
            <li key={passo} aria-current={animando ? 'step' : undefined}>
              <span className="guide-steps-timed__track" aria-hidden="true">
                {animando ? (
                  // or-fill-x: scaleX 0 → 1 a partir da esquerda; ao terminar, avança
                  <span
                    key={rodada}
                    className="guide-steps-timed__bar guide-steps-timed__bar--run"
                    onAnimationEnd={() =>
                      i < passos.length - 1 ? setAtual(i + 1) : setFase('fim')
                    }
                  />
                ) : (
                  <span className="guide-steps-timed__bar" data-full={cheio || undefined} />
                )}
              </span>
              <span className="guide-steps-timed__label">
                {String(i + 1).padStart(2, '0')} · {passo}
              </span>
            </li>
          )
        })}
      </ol>
      <div>
        <Button
          size="sm"
          variant="ghost"
          startIcon={<Icon name={fase === 'parado' ? 'play' : 'refresh'} size="sm" />}
          onClick={iniciar}
        >
          {fase === 'parado' ? 'Reproduzir' : 'Repetir'}
        </Button>
      </div>
    </div>
  )
}
