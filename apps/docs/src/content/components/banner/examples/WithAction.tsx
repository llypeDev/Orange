import { Banner, Button } from '@orangesys/ui'

export default function WithAction() {
  return (
    <div style={{ display: 'grid', gap: 12, width: '100%' }}>
      <Banner
        tone="warning"
        title="Instabilidade no Pix"
        action={<a href="#status">Acompanhar status</a>}
        dismissible
      >
        Alguns pagamentos podem levar até 30 minutos para compensar.
      </Banner>
      <Banner
        tone="info"
        title="Seu teste termina em 2 dias"
        action={
          <Button size="sm" variant="secondary">
            Ver planos
          </Button>
        }
        dismissible
      >
        Escolha um plano para manter seus 4 projetos.
      </Banner>
    </div>
  )
}
