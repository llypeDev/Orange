import { Button, ConsentBanner, Stack, type ConsentBannerPlacement } from '@orangesys/ui'
import { useState } from 'react'

const categories = [
  { id: 'necessarios', label: 'Necessários', required: true },
  { id: 'desempenho', label: 'Desempenho e analytics' },
  { id: 'publicidade', label: 'Publicidade' },
]

export default function Viewport() {
  const [placement, setPlacement] = useState<ConsentBannerPlacement | null>(null)

  return (
    <>
      <Stack gap={3} direction="horizontal" wrap>
        <Button variant="outline" onClick={() => setPlacement('bottom')}>
          Mostrar no rodapé
        </Button>
        <Button variant="outline" onClick={() => setPlacement('top')}>
          Mostrar no topo
        </Button>
      </Stack>
      {/* Fixo, o banner vai para o início do <body> (portal): primeiro na leitura e no Tab. */}
      <ConsentBanner
        placement={placement ?? 'bottom'}
        open={placement !== null}
        onOpenChange={(open) => !open && setPlacement(null)}
        categories={categories}
        policyHref="#politica-de-cookies"
      />
    </>
  )
}
