import type { Meta, StoryObj } from '@storybook/react-vite'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './Accordion'

const faq = [
  {
    value: 'prazo',
    question: 'Qual o prazo de entrega?',
    answer: 'Pedidos para capitais chegam em até 5 dias úteis. Para o interior, o prazo é de até 9 dias úteis.',
  },
  {
    value: 'troca',
    question: 'Posso trocar ou devolver um produto?',
    answer: 'Sim. Você tem até 30 dias após o recebimento para solicitar a troca pela área de pedidos.',
  },
  {
    value: 'pagamento',
    question: 'Quais formas de pagamento são aceitas?',
    answer: 'Pix, cartão de crédito em até 10x sem juros e boleto bancário com vencimento em 3 dias.',
  },
]

const meta = {
  title: 'Componentes/Accordion',
  component: Accordion,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Seções que se expandem e recolhem, seguindo o padrão accordion do WAI-ARIA: botão dentro de heading, `aria-expanded`, painel `role="region"` e navegação por setas, Home e End.',
      },
    },
  },
  argTypes: {
    type: { control: 'inline-radio', options: ['single', 'multiple'] },
    variant: { control: 'inline-radio', options: ['outline', 'flush'] },
    headingLevel: { control: 'select', options: [2, 3, 4, 5, 6] },
    collapsible: { control: 'boolean' },
  },
  args: {
    type: 'single',
    variant: 'outline',
    headingLevel: 3,
    collapsible: true,
  },
  render: (args) => (
    <Accordion {...args}>
      {faq.map((item) => (
        <AccordionItem key={item.value} value={item.value}>
          <AccordionTrigger>{item.question}</AccordionTrigger>
          <AccordionContent>{item.answer}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  ),
} satisfies Meta<typeof Accordion>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const DefaultOpen: Story = {
  args: { defaultValue: 'prazo' },
}

export const Multiple: Story = {
  args: { type: 'multiple', defaultValue: ['prazo', 'pagamento'] },
}

export const NotCollapsible: Story = {
  args: { collapsible: false, defaultValue: 'troca' },
}

export const Flush: Story = {
  args: { variant: 'flush' },
}

export const DisabledItem: Story = {
  render: (args) => (
    <Accordion {...args}>
      <AccordionItem value="plano">
        <AccordionTrigger>Plano atual: Profissional</AccordionTrigger>
        <AccordionContent>Até 20 usuários, 100 GB de armazenamento e suporte prioritário.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="empresa" disabled>
        <AccordionTrigger>Plano Empresa (indisponível na sua região)</AccordionTrigger>
        <AccordionContent>Usuários ilimitados e SSO.</AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
}
