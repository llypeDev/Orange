import { Accordion, AccordionContent, AccordionItem, AccordionTrigger, Button } from '@orange/ui'
import { useState } from 'react'

const steps = [
  { id: 'entrega', title: '1. Endereço de entrega', body: 'Rua das Laranjeiras, 120 — Botafogo, Rio de Janeiro/RJ' },
  { id: 'pagamento', title: '2. Pagamento', body: 'Pix com 5% de desconto. O código expira em 30 minutos.' },
  { id: 'revisao', title: '3. Revisão do pedido', body: '3 itens · Frete grátis · Total de R$ 489,90' },
]

export default function Checkout() {
  const [step, setStep] = useState<string | null>('entrega')

  return (
    <Accordion
      headingLevel={4}
      collapsible={false}
      value={step}
      onChange={setStep}
      style={{ width: '100%' }}
    >
      {steps.map((item, index) => {
        const next = steps[index + 1]
        return (
          <AccordionItem key={item.id} value={item.id}>
            <AccordionTrigger>{item.title}</AccordionTrigger>
            <AccordionContent>
              <p>{item.body}</p>
              {next ? (
                <Button size="sm" onClick={() => setStep(next.id)}>
                  Continuar
                </Button>
              ) : (
                <Button size="sm">Finalizar compra</Button>
              )}
            </AccordionContent>
          </AccordionItem>
        )
      })}
    </Accordion>
  )
}
