import { Button, ButtonGroup, Icon, IconButton } from '@orange/ui'
import { useState } from 'react'

export default function Attached() {
  const [zoom, setZoom] = useState(100)

  return (
    <>
      <ButtonGroup aria-label="Zoom" attached variant="outline">
        <IconButton
          icon="minus"
          label="Diminuir zoom"
          disabled={zoom <= 50}
          onClick={() => setZoom((z) => z - 25)}
        />
        <Button onClick={() => setZoom(100)} aria-label={`Zoom em ${zoom}%. Restaurar para 100%`}>
          {zoom}%
        </Button>
        <IconButton
          icon="plus"
          label="Aumentar zoom"
          disabled={zoom >= 200}
          onClick={() => setZoom((z) => z + 25)}
        />
      </ButtonGroup>

      <ButtonGroup aria-label="Navegar entre pedidos" attached variant="outline">
        <Button startIcon={<Icon name="chevron-left" />}>Anterior</Button>
        <Button endIcon={<Icon name="chevron-right" />}>Próximo</Button>
      </ButtonGroup>

      <ButtonGroup aria-label="Período do gráfico" attached variant="secondary" size="sm">
        <Button>24 h</Button>
        <Button>7 dias</Button>
        <Button>30 dias</Button>
      </ButtonGroup>
    </>
  )
}
