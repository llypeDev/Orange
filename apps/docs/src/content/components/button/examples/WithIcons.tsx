import { Button, Icon } from '@orangesys/ui'

export default function WithIcons() {
  return (
    <>
      <Button endIcon={<Icon name="arrow-right" />}>Agendar demo</Button>
      <Button variant="outline" startIcon={<Icon name="download" />}>
        Baixar relatório
      </Button>
      <Button variant="ghost" startIcon={<Icon name="plus" />}>
        Novo projeto
      </Button>
      <Button variant="outline" iconOnly aria-label="Buscar" startIcon={<Icon name="search" />} />
      <Button variant="ghost" iconOnly aria-label="Mais ações" startIcon={<Icon name="more-horizontal" />} />
    </>
  )
}
