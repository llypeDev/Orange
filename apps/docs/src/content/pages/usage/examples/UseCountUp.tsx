import { Button, Icon, useCountUp } from '@orangesys/ui'
import { useState } from 'react'

function Total({ valor }: { valor: number }) {
  // Com movimento reduzido, devolve o valor final direto.
  const atual = useCountUp(valor, { duration: 900 })
  return (
    <p className="guide-count-big">
      {atual.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
    </p>
  )
}

export default function Faturamento() {
  const [valor, setValor] = useState(48250.9)
  return (
    <div className="guide-stack">
      <span className="or-eyebrow">Faturamento de hoje</span>
      <Total valor={valor} />
      <div>
        {/* Cada novo alvo recomeça a contagem a partir de `from` (padrão: 0) */}
        <Button
          size="sm"
          variant="ghost"
          startIcon={<Icon name="refresh" size="sm" />}
          onClick={() => setValor(Math.round((40000 + Math.random() * 20000) * 100) / 100)}
        >
          Atualizar
        </Button>
      </div>
    </div>
  )
}
