import { Button, Drawer, type DrawerPlacement } from '@orange/ui'

const posicoes: { placement: DrawerPlacement; label: string }[] = [
  { placement: 'left', label: 'Esquerda' },
  { placement: 'right', label: 'Direita' },
  { placement: 'bottom', label: 'Inferior' },
]

export default function Placements() {
  return (
    <>
      {posicoes.map(({ placement, label }) => (
        <Drawer
          key={placement}
          placement={placement}
          title={`Painel à ${label.toLowerCase()}`}
          trigger={<Button variant="outline">{label}</Button>}
        >
          <p style={{ margin: 0 }}>
            Laterais funcionam bem para navegação (esquerda) e detalhes ou edição (direita). O
            inferior é natural em telas pequenas, como uma folha que sobe.
          </p>
        </Drawer>
      ))}
    </>
  )
}
