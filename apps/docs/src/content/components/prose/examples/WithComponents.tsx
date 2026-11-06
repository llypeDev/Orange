import { Alert, Blockquote, Button, Prose } from '@orangesys/ui'

export default function WithComponents() {
  return (
    <Prose>
      <h2>Antes de cancelar a assinatura</h2>
      <p>Os componentes do Orange dentro do Prose mantêm o próprio estilo.</p>
      <Alert tone="warning" title="Os dados são apagados em 30 dias">
        Exporte seus relatórios antes de cancelar.
      </Alert>
      <p>O que nossos clientes dizem sobre a migração:</p>
      <Blockquote
        source={
          <>
            Marina Costa, <cite>Loja Ateliê Verde</cite>
          </>
        }
      >
        Levamos uma tarde para importar dois anos de pedidos.
      </Blockquote>
      {/* Fora da tipografia do Prose: margens e layout ficam com a aplicação. */}
      <div
        className="or-not-prose"
        style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 24 }}
      >
        <Button variant="outline">Manter assinatura</Button>
        <Button variant="danger">Cancelar assinatura</Button>
      </div>
    </Prose>
  )
}
