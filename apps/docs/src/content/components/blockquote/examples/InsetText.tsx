import { Blockquote, Text } from '@orangesys/ui'

export default function InsetText() {
  return (
    <div style={{ display: 'grid', gap: 16, maxWidth: 560 }}>
      <Text>Você pode emitir notas fiscais a qualquer hora pelo painel ou pela API.</Text>
      {/* Não é citação de outra fonte: as="div", sem cite. */}
      <Blockquote as="div">
        A emissão fica indisponível no domingo, 15 de novembro, das 2h às 6h, para manutenção
        programada.
      </Blockquote>
      <Text>Notas emitidas antes da manutenção continuam válidas.</Text>
    </div>
  )
}
