import { Button, CodeBlock, Stack } from '@orangesys/ui'
import { useState } from 'react'

const code = `import { OrangeProvider, Button } from '@orangesys/ui'
import '@orangesys/ui/styles.css'

export function App() {
  return (
    <OrangeProvider locale="pt-BR">
      <Button>Criar conta</Button>
    </OrangeProvider>
  )
}`

const passos = [
  { rotulo: '1. Importe', linhas: [1, 2] },
  { rotulo: '2. Envolva no provider', linhas: [6, 8] },
  { rotulo: '3. Use os componentes', linhas: [7] },
]

export default function Steps() {
  const [passo, setPasso] = useState(0)

  return (
    <Stack gap={3} style={{ width: '100%' }}>
      <Stack role="group" aria-label="Passos da instalação" gap={2} direction="horizontal" wrap>
        {passos.map((p, i) => (
          <Button
            key={p.rotulo}
            size="sm"
            variant={passo === i ? 'secondary' : 'outline'}
            aria-pressed={passo === i}
            onClick={() => setPasso(i)}
          >
            {p.rotulo}
          </Button>
        ))}
      </Stack>
      <CodeBlock title="src/App.tsx" language="tsx" code={code} showLineNumbers highlightLines={passos[passo].linhas} />
    </Stack>
  )
}
