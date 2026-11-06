import { Blockquote } from '@orangesys/ui'

export default function WithSource() {
  return (
    <Blockquote
      cite="https://exemplo.com.br/relatorios/atendimento-2026"
      source={
        <>
          Ana Lima, diretora de Atendimento — <cite>Relatório de Atendimento 2026</cite>
        </>
      }
      style={{ maxWidth: 560 }}
    >
      Automatizar a triagem dos chamados liberou a equipe para os casos que exigem conversa. O
      primeiro contato agora acontece no mesmo dia.
    </Blockquote>
  )
}
