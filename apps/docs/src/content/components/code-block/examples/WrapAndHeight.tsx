import { CodeBlock } from '@orangesys/ui'

const log = `{
  "id": "evt_01J9Z4",
  "tipo": "pedido.atualizado",
  "criadoEm": "2026-11-03T14:05:12-03:00",
  "mensagem": "O pedido 4821 foi atualizado para 'em separação' pelo centro de distribuição de Cajamar após a confirmação do estoque.",
  "origem": "api",
  "tentativas": 1,
  "versao": "2026-10-01"
}`

export default function WrapAndHeight() {
  return (
    <CodeBlock
      title="webhook-payload.json"
      language="json"
      code={log}
      wrap
      maxHeight={180}
      style={{ width: '100%', maxWidth: 520 }}
    />
  )
}
