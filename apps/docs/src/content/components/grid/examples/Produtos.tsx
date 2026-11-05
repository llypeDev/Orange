import { Button, Card, CardBody, CardFooter, CardHeader, Grid, Icon, Text } from '@orange/ui'

const produtos = [
  { id: 'flex', categoria: 'Cadeiras', nome: 'Cadeira ergonômica Flex', preco: 'R$ 1.289,90' },
  { id: 'atlas', categoria: 'Mesas', nome: 'Mesa elevatória Atlas', preco: 'R$ 2.490,00' },
  { id: 'arco', categoria: 'Iluminação', nome: 'Luminária de mesa Arco', preco: 'R$ 349,90' },
  {
    id: 'modular',
    categoria: 'Armazenamento',
    nome: 'Estante Modular 4 nichos',
    preco: 'R$ 899,00',
  },
  {
    id: 'slim',
    categoria: 'Armazenamento',
    nome: 'Gaveteiro Slim com rodízios',
    preco: 'R$ 579,90',
  },
  { id: 'apoio', categoria: 'Ergonomia', nome: 'Apoio de pés regulável', preco: 'R$ 189,90' },
]

export default function Produtos() {
  return (
    // 1 coluna no celular, 2 a partir de 640px (sm), 3 a partir de 1024px (lg)
    <Grid as="ul" columns={{ base: 1, sm: 2, lg: 3 }} gap={4} aria-label="Produtos">
      {produtos.map((p) => (
        <Card as="li" key={p.id}>
          <CardHeader eyebrow={p.categoria} title={p.nome} headingLevel={4} />
          <CardBody>
            <Text weight="semibold">{p.preco}</Text>
          </CardBody>
          <CardFooter>
            <Button variant="outline" size="sm" startIcon={<Icon name="plus" />}>
              Adicionar
            </Button>
          </CardFooter>
        </Card>
      ))}
    </Grid>
  )
}
