import { Button, ConsentBanner, type ConsentBannerPlacement } from '@orangesys/ui'
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
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
        <Button variant="outline" onClick={() => setPlacement('bottom')}>
          Mostrar no rodapé
        </Button>
        <Button variant="outline" onClick={() => setPlacement('top')}>
          Mostrar no topo
        </Button>
      </div>
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
