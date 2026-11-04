import { Banner } from '@orange/ui'

export default function Tones() {
  return (
    <div style={{ display: 'grid', gap: 12, width: '100%' }}>
      <Banner tone="neutral" title="Modo somente leitura">
        Você está vendo a versão publicada em 12/10.
      </Banner>
      <Banner tone="info" title="Manutenção programada">
        Domingo, das 2h às 4h (horário de Brasília), o painel ficará indisponível.
      </Banner>
      <Banner tone="success" title="Integração concluída">
        Seus pedidos já estão sincronizando com o ERP.
      </Banner>
      <Banner tone="warning" title="Instabilidade no Pix">
        Alguns pagamentos podem levar até 30 minutos para compensar.
      </Banner>
      <Banner tone="danger" title="Falha na emissão de notas">
        Nenhuma NF-e foi emitida desde 14h. Nossa equipe já está atuando.
      </Banner>
    </div>
  )
}
