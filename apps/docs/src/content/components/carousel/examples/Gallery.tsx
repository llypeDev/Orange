import { useState } from 'react'
import { Carousel, CarouselSlide, Image, Stack, Text } from '@orangesys/ui'
import fone from './media/fone.svg'
import garrafa from './media/garrafa.svg'
import mochila from './media/mochila.svg'
import tenis from './media/tenis.svg'

const photos = [
  { id: 'mochila', src: mochila, alt: 'Mochila Urbana: vista frontal com alças laranja' },
  { id: 'tenis', src: tenis, alt: 'Tênis Pace Leve: vista lateral' },
  { id: 'garrafa', src: garrafa, alt: 'Garrafa Térmica: vista frontal' },
  { id: 'fone', src: fone, alt: 'Fone Studio: conchas laranja' },
]

export default function Gallery() {
  // Controlado: a posição vive no estado do pai e as miniaturas também a alteram.
  const [index, setIndex] = useState(0)

  return (
    <Stack gap={3} style={{ maxWidth: 360, width: '100%' }}>
      <Carousel label="Fotos do produto" index={index} onIndexChange={setIndex} picker="none" loop>
        {photos.map((photo) => (
          <CarouselSlide key={photo.id}>
            <Image src={photo.src} alt={photo.alt} ratio="1/1" bordered />
          </CarouselSlide>
        ))}
      </Carousel>
      <Stack gap={2} direction="horizontal">
        {photos.map((photo, i) => (
          <button
            key={photo.id}
            type="button"
            aria-label={`Ver foto ${i + 1}`}
            aria-pressed={i === index}
            onClick={() => setIndex(i)}
            style={{
              width: 56,
              padding: 0,
              border: `2px solid ${i === index ? 'var(--or-color-accent)' : 'transparent'}`,
              background: 'none',
              cursor: 'pointer',
            }}
          >
            <Image src={photo.src} alt="" ratio="1/1" />
          </button>
        ))}
      </Stack>
      <Text size="sm" tone="muted">
        Foto {index + 1} de {photos.length}
      </Text>
    </Stack>
  )
}
