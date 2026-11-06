import { Blockquote, Prose } from '@orangesys/ui'

export default function InProse() {
  return (
    <Prose>
      <h3>7. Cancelamento</h3>
      <p>A cláusula que trata do cancelamento diz:</p>
      <Blockquote
        cite="https://exemplo.com.br/termos#cancelamento"
        source={
          <>
            Cláusula 7.2, <cite>Termos de uso</cite>
          </>
        }
      >
        <p>
          O cancelamento pode ser solicitado a qualquer momento, pelo painel ou pela central de
          ajuda.
        </p>
        <p>Os dados do espaço de trabalho ficam disponíveis para exportação por 30 dias.</p>
      </Blockquote>
      <p>Depois desse prazo, os dados são apagados de forma definitiva.</p>
    </Prose>
  )
}
