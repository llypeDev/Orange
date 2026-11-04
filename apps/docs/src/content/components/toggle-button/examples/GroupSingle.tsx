import { Icon, ToggleButton, ToggleButtonGroup } from '@orange/ui'
import { useState } from 'react'

type Align = 'left' | 'center' | 'right'

export default function GroupSingle() {
  const [align, setAlign] = useState<Align>('left')

  return (
    <div style={{ display: 'grid', gap: 16, width: '100%', maxWidth: 420 }}>
      <ToggleButtonGroup
        type="single"
        aria-label="Alinhamento do parágrafo"
        attached
        value={align}
        // Ignora `null` para que sempre haja um alinhamento ativo.
        onChange={(value) => value && setAlign(value as Align)}
      >
        <ToggleButton
          value="left"
          iconOnly
          aria-label="Alinhar à esquerda"
          startIcon={<Icon name="align-left" />}
        />
        <ToggleButton
          value="center"
          iconOnly
          aria-label="Centralizar"
          startIcon={<Icon name="align-center" />}
        />
        <ToggleButton
          value="right"
          iconOnly
          aria-label="Alinhar à direita"
          startIcon={<Icon name="align-right" />}
        />
      </ToggleButtonGroup>
      <p
        style={{
          margin: 0,
          textAlign: align,
          fontSize: 'var(--or-text-sm)',
          color: 'var(--or-color-text-muted)',
        }}
      >
        A entrega do novo painel de métricas está prevista para a próxima sprint, depois da revisão
        de acessibilidade.
      </p>
    </div>
  )
}
