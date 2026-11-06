import { Button, Stepper } from '@orangesys/ui'
import { useState } from 'react'

const steps = [
  { label: 'Carrinho', description: '3 itens' },
  { label: 'Entrega', description: 'Endereço e frete' },
  { label: 'Pagamento', description: 'Cartão ou Pix' },
  { label: 'Revisão', description: 'Confirme o pedido' },
]

export default function Checkout() {
  const [active, setActive] = useState(1)
  return (
    <div style={{ display: 'grid', gap: 24, width: '100%' }}>
      <Stepper steps={steps} step={active} aria-label="Etapas do checkout" />
      <div style={{ display: 'flex', gap: 8 }}>
        <Button variant="outline" disabled={active === 0} onClick={() => setActive((v) => v - 1)}>
          Voltar
        </Button>
        <Button disabled={active === steps.length} onClick={() => setActive((v) => v + 1)}>
          {active >= steps.length - 1 ? 'Finalizar pedido' : 'Continuar'}
        </Button>
      </div>
    </div>
  )
}
