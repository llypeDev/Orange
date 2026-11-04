import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@orange/ui'

const questions = [
  {
    id: 'cobranca',
    question: 'Quando a cobrança é feita?',
    answer: 'A assinatura é cobrada no dia da contratação e renovada automaticamente a cada mês, no mesmo dia.',
  },
  {
    id: 'cancelar',
    question: 'Posso cancelar a qualquer momento?',
    answer: 'Sim. O cancelamento é imediato e você mantém o acesso até o fim do período já pago, sem multa.',
  },
  {
    id: 'nota',
    question: 'Como recebo a nota fiscal?',
    answer: 'A NFS-e é emitida em até 2 dias úteis após o pagamento e enviada para o e-mail de cobrança.',
  },
  {
    id: 'plano',
    question: 'Consigo mudar de plano depois?',
    answer: 'Pode trocar quando quiser. No upgrade, cobramos só a diferença proporcional aos dias restantes.',
  },
]

export default function Faq() {
  return (
    <Accordion headingLevel={4} defaultValue="cobranca" style={{ width: '100%' }}>
      {questions.map((item) => (
        <AccordionItem key={item.id} value={item.id}>
          <AccordionTrigger>{item.question}</AccordionTrigger>
          <AccordionContent>{item.answer}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  )
}
