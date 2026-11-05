import { Button, Tooltip, type TooltipPlacement } from '@orangesys/ui'

const posicoes: { placement: TooltipPlacement; label: string }[] = [
  { placement: 'top', label: 'Acima' },
  { placement: 'right', label: 'À direita' },
  { placement: 'bottom', label: 'Abaixo' },
  { placement: 'left', label: 'À esquerda' },
]

export default function Placements() {
  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 12,
        justifyContent: 'center',
        width: '100%',
        padding: '32px 0',
      }}
    >
      {posicoes.map(({ placement, label }) => (
        <Tooltip key={placement} placement={placement} content={`Tooltip ${label.toLowerCase()}`}>
          <Button variant="outline">{label}</Button>
        </Tooltip>
      ))}
    </div>
  )
}
