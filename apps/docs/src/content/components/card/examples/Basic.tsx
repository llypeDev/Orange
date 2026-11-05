import { Button, Card, CardBody, CardFooter, CardHeader } from '@orangesys/ui'

const price = {
  fontFamily: 'var(--or-font-display)',
  fontSize: 28,
  letterSpacing: '-0.03em',
  color: 'var(--or-color-text)',
}

export default function Basic() {
  return (
    <Card style={{ maxWidth: 360 }}>
      <CardHeader eyebrow="Plano" title="Profissional" headingLevel={4} description="Para equipes em crescimento" />
      <CardBody>
        <p>
          <strong style={price}>R$ 89</strong> por usuário/mês
        </p>
        <p>Até 20 usuários, 100 GB de armazenamento e suporte prioritário por chat.</p>
      </CardBody>
      <CardFooter>
        <Button>Assinar plano</Button>
        <Button variant="ghost">Comparar planos</Button>
      </CardFooter>
    </Card>
  )
}
