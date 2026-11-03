import { Alert } from '@orange/ui'

export default function Tones() {
  return (
    <div style={{ display: 'grid', gap: 12, width: '100%' }}>
      <Alert tone="neutral" title="Rascunho">
        Este documento ainda não foi publicado.
      </Alert>
      <Alert tone="info" title="Manutenção programada">
        O painel ficará indisponível no sábado, das 2h às 4h.
      </Alert>
      <Alert tone="success" title="Pagamento confirmado">
        O recibo foi enviado para financeiro@empresa.com.br.
      </Alert>
      <Alert tone="warning" title="Seu certificado digital vence em 5 dias">
        Renove para continuar emitindo notas fiscais.
      </Alert>
      <Alert tone="danger" title="Não foi possível importar a planilha">
        A coluna “CNPJ” está vazia em 14 linhas.
      </Alert>
    </div>
  )
}
