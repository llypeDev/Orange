import { Button, ExpandableText, Stack } from '@orangesys/ui'
import { useState } from 'react'

export default function Controlled() {
  const [aberto, setAberto] = useState(false)

  return (
    <Stack gap={3} style={{ maxWidth: 440 }}>
      <ExpandableText lines={2} expanded={aberto} onExpandedChange={setAberto}>
        Ao assinar, você concorda com a renovação automática do plano ao final de cada período. É possível cancelar a qualquer
        momento pelo painel de cobrança, e o acesso continua disponível até o fim do período já pago. Valores promocionais
        valem apenas para o primeiro ano.
      </ExpandableText>
      <div>
        <Button size="sm" variant="outline" onClick={() => setAberto(true)} disabled={aberto}>
          Ler termos completos
        </Button>
      </div>
    </Stack>
  )
}
