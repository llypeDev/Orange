import { Banner, Button, Icon } from '@orange/ui'

export default function Accent() {
  return (
    <div style={{ width: '100%' }}>
      <Banner
        variant="accent"
        headingLevel={2}
        title="Leve o Orange para o seu time"
        action={
          <>
            <Button endIcon={<Icon name="arrow-right" />}>Começar agora</Button>
            <Button variant="outline">Falar com vendas</Button>
          </>
        }
      >
        Componentes acessíveis, tokens e documentação bilíngue — prontos para produção.
      </Banner>
    </div>
  )
}
