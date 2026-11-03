import { Button, Icon, useDisclosure } from '@orange/ui'

export default function FiltrosAvancados() {
  const filtros = useDisclosure()
  return (
    <div className="guide-stack">
      <div>
        <Button
          variant="outline"
          aria-expanded={filtros.isOpen}
          aria-controls="filtros-avancados"
          onClick={filtros.toggle}
          endIcon={<Icon name={filtros.isOpen ? 'chevron-up' : 'chevron-down'} size="sm" />}
        >
          Filtros avançados
        </Button>
      </div>
      <div id="filtros-avancados" hidden={!filtros.isOpen} className="guide-panel">
        <p>Status, período e forma de pagamento aparecem aqui.</p>
        <Button size="sm" variant="ghost" onClick={filtros.close}>
          Fechar filtros
        </Button>
      </div>
    </div>
  )
}
