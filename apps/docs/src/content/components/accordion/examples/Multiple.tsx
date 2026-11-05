import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@orangesys/ui'

export default function Multiple() {
  return (
    <Accordion type="multiple" headingLevel={4} defaultValue={['entrega', 'garantia']} style={{ width: '100%' }}>
      <AccordionItem value="descricao">
        <AccordionTrigger>Descrição</AccordionTrigger>
        <AccordionContent>
          Cadeira ergonômica com encosto em tela, apoio lombar regulável e braços 3D. Suporta até 120 kg.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="entrega">
        <AccordionTrigger>Entrega e montagem</AccordionTrigger>
        <AccordionContent>
          Entrega em até 7 dias úteis para capitais. A montagem leva cerca de 20 minutos e as ferramentas vão na caixa.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="garantia">
        <AccordionTrigger>Garantia</AccordionTrigger>
        <AccordionContent>
          12 meses contra defeitos de fabricação, estendidos para 24 meses no mecanismo de inclinação.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}
