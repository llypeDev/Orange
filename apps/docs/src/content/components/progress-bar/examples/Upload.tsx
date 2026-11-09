import { Button, ProgressBar, Stack, VisuallyHidden } from '@orangesys/ui'
import { useEffect, useState } from 'react'

const TOTAL_MB = 2.8

export default function Upload() {
  const [progress, setProgress] = useState<number | null>(null)

  useEffect(() => {
    if (progress === null || progress >= 100) return
    const timer = setTimeout(() => setProgress((p) => Math.min(100, (p ?? 0) + 8)), 250)
    return () => clearTimeout(timer)
  }, [progress])

  const sent = (((progress ?? 0) / 100) * TOTAL_MB).toFixed(1).replace('.', ',')

  return (
    <Stack gap={4} style={{ width: '100%', maxWidth: 480 }}>
      <ProgressBar
        label="Enviando 3 arquivos"
        value={progress ?? 0}
        tone={progress === 100 ? 'success' : 'accent'}
        description={progress === 100 ? 'Envio concluído' : `${sent} MB de 2,8 MB`}
      />
      {/* a barra não anuncia cada mudança: avise a conclusão numa região de status */}
      <VisuallyHidden role="status">{progress === 100 ? 'Envio concluído' : ''}</VisuallyHidden>
      <div>
        <Button size="sm" variant="outline" onClick={() => setProgress(0)}>
          {progress === null ? 'Enviar arquivos' : 'Enviar novamente'}
        </Button>
      </div>
    </Stack>
  )
}
