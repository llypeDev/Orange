import { Eyebrow, Icon, Image, Stack, Text } from '@orangesys/ui'
import reserva from './media/reserva.svg'

export default function Fallbacks() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 16, width: '100%' }}>
      <Stack gap={2}>
        {/* 1. A foto falha e o Image tenta o fallbackSrc uma vez. */}
        <Image
          src="/produtos/mochila-inexistente.jpg"
          fallbackSrc={reserva}
          alt="Mochila Urbana 22 L"
          ratio="4/3"
          bordered
        />
        <Eyebrow>fallbackSrc</Eyebrow>
      </Stack>
      <Stack gap={2}>
        {/* 2. Sem alternativa: superfície neutra com ícone e o alt em texto oculto. */}
        <Image src="/produtos/tenis-inexistente.jpg" alt="Tênis Pace Leve" ratio="4/3" bordered />
        <Eyebrow>Padrão</Eyebrow>
      </Stack>
      <Stack gap={2}>
        {/* 3. Substituto próprio. */}
        <Image
          src="/mapas/loja-centro-inexistente.png"
          alt="Mapa da loja do centro"
          ratio="4/3"
          bordered
          fallback={
            <Stack gap={2} align="center">
              <Icon name="globe" size="lg" />
              <Text size="sm">Mapa indisponível no momento.</Text>
            </Stack>
          }
        />
        <Eyebrow>fallback</Eyebrow>
      </Stack>
    </div>
  )
}
