import { Prose } from '@orangesys/ui'

const comandoWebhook = `curl -X POST https://api.exemplo.com.br/v2/webhooks -d '{"evento":"pedido.confirmado"}'`

export default function Overflow() {
  return (
    <div
      style={{ width: '100%', maxWidth: 320, outline: '1px dashed var(--or-color-border-strong)' }}
    >
      <Prose>
        <h3>Integração com o ERP</h3>
        <p>
          Configure o endereço{' '}
          <a href="#webhook">
            https://erp.empresa.com.br/integracoes/webhooks/pedidos-confirmados/v2
          </a>{' '}
          e ative <code>sincronizacaoAutomaticaDeEstoqueHabilitada</code>.
        </p>
        {/* tabIndex: a área rolável precisa ser alcançável pelo teclado. */}
        <pre tabIndex={0}>
          <code>{comandoWebhook}</code>
        </pre>
        <table tabIndex={0}>
          <caption>Eventos enviados</caption>
          <thead>
            <tr>
              <th scope="col">Evento</th>
              <th scope="col">Quando</th>
              <th scope="col">Tentativas</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <code>pedido.confirmado</code>
              </td>
              <td>Pagamento aprovado</td>
              <td>5</td>
            </tr>
            <tr>
              <td>
                <code>pedido.cancelado</code>
              </td>
              <td>Cancelamento pelo cliente ou pela loja</td>
              <td>5</td>
            </tr>
          </tbody>
        </table>
      </Prose>
    </div>
  )
}
