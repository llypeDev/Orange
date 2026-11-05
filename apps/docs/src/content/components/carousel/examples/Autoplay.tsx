import { Carousel, CarouselSlide, Eyebrow, Heading, Image, Text } from '@orangesys/ui'
import deploy from './media/deploy.svg'
import equipes from './media/equipes.svg'
import monitoramento from './media/monitoramento.svg'
import seguranca from './media/seguranca.svg'

const features = [
  {
    id: 'deploy',
    image: deploy,
    eyebrow: 'Entrega',
    title: 'Deploy contínuo sem fila',
    text: 'Cada merge vira uma versão publicada em minutos, com rollback em um clique.',
  },
  {
    id: 'monitoramento',
    image: monitoramento,
    eyebrow: 'Observabilidade',
    title: 'Monitoramento em tempo real',
    text: 'Latência, erros e custo por serviço no mesmo painel, com alertas por canal.',
  },
  {
    id: 'equipes',
    image: equipes,
    eyebrow: 'Colaboração',
    title: 'Espaços por equipe',
    text: 'Permissões por projeto e revisão obrigatória antes de chegar à produção.',
  },
  {
    id: 'seguranca',
    image: seguranca,
    eyebrow: 'Segurança',
    title: 'Segredos sempre cifrados',
    text: 'Variáveis sensíveis ficam cifradas e nunca aparecem nos registros de build.',
  },
]

export default function Autoplay() {
  return (
    // O primeiro controle é Pausar rotação; o hover pausa e o foco do teclado para a rotação.
    <Carousel label="Recursos da plataforma" autoplay={{ interval: 6000 }} loop style={{ maxWidth: 640 }}>
      {features.map((feature) => (
        <CarouselSlide key={feature.id} aria-labelledby={`recurso-${feature.id}`}>
          <Image src={feature.image} alt="" ratio="16/9" bordered />
          <div style={{ display: 'grid', gap: 4, marginTop: 16 }}>
            <Eyebrow>{feature.eyebrow}</Eyebrow>
            <Heading level={4} size="xl" id={`recurso-${feature.id}`}>
              {feature.title}
            </Heading>
            <Text tone="muted">{feature.text}</Text>
          </div>
        </CarouselSlide>
      ))}
    </Carousel>
  )
}
