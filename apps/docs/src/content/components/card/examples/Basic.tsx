import { Button, Card, CardBody, CardFooter, CardHeader } from '@orange/ui'

export default function Basic() {
  return (
    <Card style={{ maxWidth: 360 }}>
      <CardHeader eyebrow="Plano" title="Profissional" headingLevel={4} description="Para equipes em crescimento" />
      <CardBody>
        <p>
          <strong style={{ fontSize: 28, color: 'var(--or-color-text)' }}>R$ 89</strong> por usuário/mês
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
