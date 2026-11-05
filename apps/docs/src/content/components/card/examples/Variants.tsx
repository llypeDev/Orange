import { Card, CardBody, CardHeader } from '@orangesys/ui'

export default function Variants() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, width: '100%' }}>
      <Card variant="outline">
        <CardHeader eyebrow="outline" title="Backups diários" headingLevel={4} />
        <CardBody>Cópias automáticas às 3h, mantidas por 30 dias.</CardBody>
      </Card>
      <Card variant="raised">
        <CardHeader eyebrow="raised" title="Domínio próprio" headingLevel={4} />
        <CardBody>Use loja.suaempresa.com.br com SSL incluso.</CardBody>
      </Card>
      <Card variant="accent">
        <CardHeader eyebrow="accent" title="Novo: relatórios" headingLevel={4} />
        <CardBody>Exporte vendas por canal em PDF ou CSV.</CardBody>
      </Card>
    </div>
  )
}
