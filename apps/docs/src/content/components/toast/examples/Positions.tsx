import { Button, Stack, ToastProvider, useToast, type ToastPosition } from '@orangesys/ui'
import { useState } from 'react'

const positions: ToastPosition[] = [
  'top-left',
  'top-center',
  'top-right',
  'bottom-left',
  'bottom-center',
  'bottom-right',
]

function Trigger({ position }: { position: ToastPosition }) {
  const { toast } = useToast()
  return (
    <Button
      onClick={() =>
        toast({ title: 'Contato salvo', description: `Posição: ${position}`, tone: 'success' })
      }
    >
      Mostrar toast
    </Button>
  )
}

// Um provider próprio só para a demonstração; na aplicação, use um único provider.
export default function Positions() {
  const [position, setPosition] = useState<ToastPosition>('top-center')

  return (
    <Stack gap={4}>
      <Stack role="group" aria-label="Posição" gap={2} direction="horizontal" wrap>
        {positions.map((p) => (
          <Button
            key={p}
            size="sm"
            variant={p === position ? 'secondary' : 'outline'}
            aria-pressed={p === position}
            onClick={() => setPosition(p)}
          >
            {p}
          </Button>
        ))}
      </Stack>
      <ToastProvider position={position} limit={3}>
        <div>
          <Trigger position={position} />
        </div>
      </ToastProvider>
    </Stack>
  )
}
