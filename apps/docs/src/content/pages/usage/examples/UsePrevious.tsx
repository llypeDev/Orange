import { Button, usePrevious } from '@orangesys/ui'
import { useState } from 'react'

export default function Cotacao() {
  const [preco, setPreco] = useState(5.42)
  const anterior = usePrevious(preco)
  const variacao = anterior === undefined ? 0 : preco - anterior
  return (
    <div className="guide-row">
      <Button
        variant="outline"
        onClick={() => setPreco((p) => Math.round((p + (Math.random() - 0.5) * 0.4) * 100) / 100)}
      >
        Atualizar cotação
      </Button>
      <p className="guide-live" role="status">
        USD → BRL <strong>{preco.toFixed(2)}</strong>{' '}
        {anterior !== undefined && (
          <span className={variacao >= 0 ? 'guide-up' : 'guide-down'}>
            {variacao >= 0 ? '▲ subiu' : '▼ caiu'} {Math.abs(variacao).toFixed(2)} (antes{' '}
            {anterior.toFixed(2)})
          </span>
        )}
      </p>
    </div>
  )
}
