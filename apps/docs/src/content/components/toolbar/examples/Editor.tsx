import {
  Icon,
  IconButton,
  ToggleButton,
  ToggleButtonGroup,
  Toolbar,
  ToolbarGroup,
  ToolbarSeparator,
} from '@orangesys/ui'
import { useState } from 'react'

type Align = 'left' | 'center' | 'right'

export default function Editor() {
  const [styles, setStyles] = useState<string[]>(['bold'])
  const [align, setAlign] = useState<Align>('left')

  return (
    <div style={{ width: '100%', maxWidth: 640 }}>
      <Toolbar aria-label="Formatação de texto" aria-controls="nota-reuniao" size="sm">
        <ToolbarGroup aria-label="Histórico">
          <IconButton icon="undo" label="Desfazer" />
          <IconButton icon="redo" label="Refazer" disabled />
        </ToolbarGroup>
        <ToolbarSeparator />
        <ToggleButtonGroup selectionMode="multiple" aria-label="Estilo" value={styles} onChange={setStyles}>
          <ToggleButton
            value="bold"
            iconOnly
            aria-label="Negrito"
            startIcon={<Icon name="bold" />}
          />
          <ToggleButton
            value="italic"
            iconOnly
            aria-label="Itálico"
            startIcon={<Icon name="italic" />}
          />
          <ToggleButton
            value="underline"
            iconOnly
            aria-label="Sublinhado"
            startIcon={<Icon name="underline" />}
          />
        </ToggleButtonGroup>
        <ToolbarSeparator />
        <ToggleButtonGroup
          selectionMode="single"
          aria-label="Alinhamento"
          value={align}
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
        <ToolbarSeparator />
        <IconButton icon="link" label="Inserir link" />
        <IconButton icon="image" label="Inserir imagem" />
      </Toolbar>
      <p
        id="nota-reuniao"
        style={{
          margin: 0,
          padding: 16,
          border: '1px solid var(--or-color-border)',
          borderTop: 0,
          textAlign: align,
          fontWeight: styles.includes('bold') ? 700 : 400,
          fontStyle: styles.includes('italic') ? 'italic' : 'normal',
          textDecoration: styles.includes('underline') ? 'underline' : 'none',
        }}
      >
        Reunião de planejamento: revisar as metas do trimestre e definir os responsáveis por cada
        entrega.
      </p>
    </div>
  )
}
