import { Button, Carousel, CarouselSlide, Eyebrow, Heading, Image, Text } from '@orange/ui'
import bone from './media/bone.svg'
import caneca from './media/caneca.svg'
import fone from './media/fone.svg'
import garrafa from './media/garrafa.svg'
import luminaria from './media/luminaria.svg'
import mochila from './media/mochila.svg'
import relogio from './media/relogio.svg'
import tenis from './media/tenis.svg'

const products = [
  { id: 'mochila', image: mochila, category: 'Viagem', name: 'Mochila Urbana 22 L', price: 'R$ 289,90', alt: 'Mochila grafite com alças laranja' },
  { id: 'tenis', image: tenis, category: 'Corrida', name: 'Tênis Pace Leve', price: 'R$ 459,00', alt: 'Tênis preto com solado laranja' },
  { id: 'garrafa', image: garrafa, category: 'Esporte', name: 'Garrafa Térmica 750 ml', price: 'R$ 119,90', alt: 'Garrafa térmica laranja com faixa grafite' },
  { id: 'fone', image: fone, category: 'Áudio', name: 'Fone Over-ear Studio', price: 'R$ 699,00', alt: 'Fone de ouvido grafite com conchas laranja' },
  { id: 'relogio', image: relogio, category: 'Acessórios', name: 'Relógio Minimal', price: 'R$ 349,90', alt: 'Relógio de pulseira grafite com mostrador claro' },
  { id: 'luminaria', image: luminaria, category: 'Casa', name: 'Luminária Articulada', price: 'R$ 229,00', alt: 'Luminária de mesa com cúpula laranja' },
  { id: 'caneca', image: caneca, category: 'Cozinha', name: 'Caneca Esmaltada', price: 'R$ 59,90', alt: 'Caneca grafite com faixa laranja' },
  { id: 'bone', image: bone, category: 'Acessórios', name: 'Boné Aba Curva', price: 'R$ 89,90', alt: 'Boné grafite com aba laranja' },
]

export default function ProductRail() {
  return (
    <div style={{ display: 'grid', gap: 12, minWidth: 0 }}>
      <Heading level={4} size="lg">
        Mais vendidos da semana
      </Heading>
      {/* Frações deixam o próximo produto "espiando": sinal visual de que há mais. */}
      <Carousel
        label="Mais vendidos da semana"
        slidesPerView={{ base: 1.4, sm: 2.4, lg: 3.2 }}
        gap={4}
        controls="top"
        picker="counter"
      >
        {products.map((product) => (
          <CarouselSlide key={product.id} aria-labelledby={`produto-${product.id}`}>
            <article style={{ display: 'grid', gap: 8 }}>
              <Image src={product.image} alt={product.alt} ratio="1/1" bordered />
              <Eyebrow>{product.category}</Eyebrow>
              <Heading level={5} size="md" id={`produto-${product.id}`}>
                {product.name}
              </Heading>
              <Text weight="semibold">{product.price}</Text>
              <Button variant="outline" size="sm" aria-label={`Adicionar ${product.name} ao carrinho`}>
                Adicionar
              </Button>
            </article>
          </CarouselSlide>
        ))}
      </Carousel>
    </div>
  )
}
