import { Blockquote, Stack } from '@orangesys/ui'

export default function Sizes() {
  return (
    <Stack gap={8} style={{ maxWidth: 560 }}>
      <Blockquote size="sm" source="Equipe de Suporte">
        Responda primeiro o que a pessoa perguntou; o contexto vem depois.
      </Blockquote>
      <Blockquote source="Guia de estilo, seção Voz e tom">
        Escreva como quem explica para um colega: frases curtas, verbos no imperativo, sem jargão.
      </Blockquote>
      <Blockquote
        size="lg"
        source={
          <>
            Marina Costa, <cite>Loja Ateliê Verde</cite>
          </>
        }
      >
        Levamos uma tarde para importar dois anos de pedidos.
      </Blockquote>
    </Stack>
  )
}
