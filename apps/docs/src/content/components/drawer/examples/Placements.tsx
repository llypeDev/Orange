import { Button, Drawer, type DrawerPlacement } from '@orange/ui'

const posicoes: { placement: DrawerPlacement; label: string; title: string }[] = [
  { placement: 'left', label: 'Esquerda', title: 'Painel à esquerda' },
  { placement: 'right', label: 'Direita', title: 'Painel à direita' },
  { placement: 'bottom', label: 'Inferior', title: 'Painel inferior' },
]

export default function Placements() {
  return (
    <>
      {posicoes.map(({ placement, label, title }) => (
        <Drawer
          key={placement}
          placement={placement}
          title={title}
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
