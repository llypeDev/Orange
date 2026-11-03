import { Button, Card, CardBody, CardFooter, CardHeader, CardMedia, Icon } from '@orange/ui'
import cadeira from './media/cadeira.svg'

export default function Product() {
  return (
    <Card as="article" variant="raised" style={{ maxWidth: 320 }}>
      <CardMedia src={cadeira} alt="Cadeira ergonômica preta com braços laranja" ratio="4/3" />
      <CardHeader eyebrow="Escritório" title="Cadeira ergonômica Flex" headingLevel={4} />
      <CardBody>
        Encosto em tela, apoio lombar regulável e braços 3D.
        <p style={{ marginTop: 12, color: 'var(--or-color-text)', fontWeight: 600 }}>R$ 1.289,90 ou 10x sem juros</p>
      </CardBody>
      <CardFooter divider>
        <Button startIcon={<Icon name="plus" />} block>
          Adicionar ao carrinho
        </Button>
      </CardFooter>
    </Card>
  )
}
