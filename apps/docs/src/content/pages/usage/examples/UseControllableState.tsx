import { Button, Icon, useControllableState } from '@orange/ui'
import { useState } from 'react'

interface QuantidadeProps {
  value?: number
  defaultValue?: number
  onChange?: (value: number) => void
  max?: number
}

/** Funciona controlado (value + onChange) e não controlado (defaultValue). */
function Quantidade({ value, defaultValue = 1, onChange, max = 10 }: QuantidadeProps) {
  const [quantidade, setQuantidade] = useControllableState({ value, defaultValue, onChange })
  return (
    <div className="guide-row" role="group" aria-label="Quantidade">
      <Button
        size="sm"
        variant="outline"
        iconOnly
        aria-label="Diminuir"
        disabled={quantidade <= 1}
        onClick={() => setQuantidade((q) => q - 1)}
      >
        <Icon name="minus" size="sm" />
      </Button>
      <output className="guide-qty" aria-live="polite">
        {quantidade}
      </output>
      <Button
        size="sm"
        variant="outline"
        iconOnly
        aria-label="Aumentar"
        disabled={quantidade >= max}
        onClick={() => setQuantidade((q) => q + 1)}
      >
        <Icon name="plus" size="sm" />
      </Button>
    </div>
  )
}

export default function Carrinho() {
  const [itens, setItens] = useState(2)
  return (
    <div className="guide-stack">
      <p className="guide-live">Não controlado:</p>
      <Quantidade defaultValue={1} />
      <p className="guide-live">
        Controlado pelo pai: <strong>{itens}</strong> {itens === 1 ? 'item' : 'itens'} · total R${' '}
        {(itens * 89.9).toFixed(2).replace('.', ',')}
      </p>
      <Quantidade value={itens} onChange={setItens} />
    </div>
  )
}
