import { Button, Icon, useCountUp, useInView } from '@orange/ui'
import { useState } from 'react'

const formatar = (n: number, casas: number) =>
  n.toLocaleString('pt-BR', { minimumFractionDigits: casas, maximumFractionDigits: casas })

/** Monta só quando visível: começa em 0 e desacelera até o valor (900ms). */
function Contagem({ valor, casas }: { valor: number; casas: number }) {
  const atual = useCountUp(valor, { duration: 900 })
  return <>{formatar(atual, casas)}</>
}

function Numero({
  valor,
  rotulo,
  prefixo = '',
  casas = 0,
}: {
  valor: number
  rotulo: string
  prefixo?: string
  casas?: number
}) {
  const [ref, visivel] = useInView<HTMLDivElement>()
  return (
    <div ref={ref} className="guide-count">
      <dt>{rotulo}</dt>
      <dd>
        {prefixo}
        {visivel ? <Contagem valor={valor} casas={casas} /> : formatar(0, casas)}
      </dd>
    </div>
  )
}

export default function Contadores() {
  const [rodada, setRodada] = useState(0)
  return (
    <div className="guide-stack">
      <dl key={rodada} className="guide-count-row">
        <Numero valor={3214} rotulo="pedidos em março" />
        <Numero valor={182.4} rotulo="faturamento (mil)" prefixo="R$ " casas={1} />
        <Numero valor={98} rotulo="% entregues no prazo" />
      </dl>
      <div>
        <Button
          size="sm"
          variant="ghost"
          startIcon={<Icon name="refresh" size="sm" />}
          onClick={() => setRodada((n) => n + 1)}
        >
          Repetir
        </Button>
      </div>
    </div>
  )
}
