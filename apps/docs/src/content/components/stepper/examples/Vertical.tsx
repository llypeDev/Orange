import { Button, Stack, Stepper } from '@orangesys/ui'
import { useState } from 'react'

export default function Vertical() {
  const [active, setActive] = useState(1)
  const next = () => setActive((v) => v + 1)
  return (
    <Stepper
      orientation="vertical"
      step={active}
      aria-label="Configuração do workspace"
      steps={[
        { label: 'Criar workspace', description: 'Orange Labs' },
        {
          label: 'Convidar equipe',
          description: 'Até 10 pessoas no plano gratuito',
          content: (
            <Stack gap={2} direction="horizontal">
              <Button size="sm" onClick={next}>
                Enviar convites
              </Button>
              <Button size="sm" variant="ghost" onClick={next}>
                Fazer depois
              </Button>
            </Stack>
          ),
        },
        {
          label: 'Conectar repositório',
          description: 'GitHub, GitLab ou Bitbucket',
          content: (
            <Button size="sm" onClick={next}>
              Conectar GitHub
            </Button>
          ),
        },
        { label: 'Primeiro deploy', content: <Button size="sm" onClick={() => setActive(0)}>Recomeçar</Button> },
      ]}
    />
  )
}
