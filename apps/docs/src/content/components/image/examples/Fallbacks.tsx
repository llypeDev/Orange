import { Eyebrow, Icon, Image, Text } from '@orange/ui'
import reserva from './media/reserva.svg'

export default function Fallbacks() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 16, width: '100%' }}>
      <div style={{ display: 'grid', gap: 8, alignContent: 'start' }}>
        {/* 1. A foto falha e o Image tenta o fallbackSrc uma vez. */}
        <Image
          src="/produtos/mochila-inexistente.jpg"
          fallbackSrc={reserva}
          alt="Mochila Urbana 22 L"
          ratio="4/3"
          bordered
        />
        <Eyebrow>fallbackSrc</Eyebrow>
      </div>
      <div style={{ display: 'grid', gap: 8, alignContent: 'start' }}>
        {/* 2. Sem alternativa: superfície neutra com ícone e o alt em texto oculto. */}
        <Image src="/produtos/tenis-inexistente.jpg" alt="Tênis Pace Leve" ratio="4/3" bordered />
        <Eyebrow>Padrão</Eyebrow>
      </div>
      <div style={{ display: 'grid', gap: 8, alignContent: 'start' }}>
        {/* 3. Substituto próprio. */}
        <Image
          src="/mapas/loja-centro-inexistente.png"
          alt="Mapa da loja do centro"
          ratio="4/3"
          bordered
          fallback={
            <div style={{ display: 'grid', justifyItems: 'center', gap: 8 }}>
              <Icon name="globe" size="lg" />
              <Text size="sm">Mapa indisponível no momento.</Text>
            </div>
          }
        />
        <Eyebrow>fallback</Eyebrow>
      </div>
    </div>
  )
}
