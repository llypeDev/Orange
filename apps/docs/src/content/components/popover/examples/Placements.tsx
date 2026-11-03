import { Button, Popover, type PopoverPlacement } from '@orange/ui'

const posicoes: { placement: PopoverPlacement; label: string }[] = [
  { placement: 'top', label: 'Acima' },
  { placement: 'right', label: 'À direita' },
  { placement: 'bottom', label: 'Abaixo' },
  { placement: 'left', label: 'À esquerda' },
]

export default function Placements() {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center', width: '100%', padding: '48px 0' }}>
      {posicoes.map(({ placement, label }) => (
        <Popover key={placement} placement={placement} arrow trigger={<Button variant="outline">{label}</Button>}>
          Sem espaço, o painel inverte e desliza sozinho para continuar visível.
        </Popover>
      ))}
    </div>
  )
}
