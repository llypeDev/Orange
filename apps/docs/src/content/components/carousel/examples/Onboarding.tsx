import { Carousel, CarouselSlide, Heading, Image, Text } from '@orangesys/ui'
import alertas from './media/alertas.svg'
import boasVindas from './media/boas-vindas.svg'
import pedidos from './media/pedidos.svg'
import pronto from './media/pronto.svg'

const steps = [
  {
    id: 'boas-vindas',
    image: boasVindas,
    title: 'Boas-vindas à Laranja Store',
    text: 'Monte sua lista de desejos e receba ofertas dos produtos que você acompanha.',
  },
  {
    id: 'pedidos',
    image: pedidos,
    title: 'Acompanhe cada pedido',
    text: 'Veja quando o pedido sai do centro de distribuição e em que etapa da entrega ele está.',
  },
  {
    id: 'alertas',
    image: alertas,
    title: 'Alertas de preço',
    text: 'Avisamos quando um item da sua lista baixar de preço ou voltar ao estoque.',
  },
  {
    id: 'pronto',
    image: pronto,
    title: 'Tudo pronto',
    text: 'Ative as notificações e comece a explorar as categorias.',
  },
]

export default function Onboarding() {
  return (
    <Carousel label="Primeiros passos" style={{ maxWidth: 440 }}>
      {steps.map((step) => (
        // O título visível nomeia o slide; a ilustração é decorativa (alt="").
        <CarouselSlide key={step.id} aria-labelledby={`onboarding-${step.id}`}>
          <Image src={step.image} alt="" ratio="4/3" bordered />
          <Heading level={4} size="lg" id={`onboarding-${step.id}`} style={{ marginTop: 16 }}>
            {step.title}
          </Heading>
          <Text tone="muted" style={{ marginTop: 4 }}>
            {step.text}
          </Text>
        </CarouselSlide>
      ))}
    </Carousel>
  )
}
