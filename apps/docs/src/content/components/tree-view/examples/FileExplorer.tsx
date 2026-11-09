import { Stack, TreeView, type TreeViewItem } from '@orangesys/ui'
import { useState } from 'react'

const arquivos: TreeViewItem[] = [
  {
    id: 'src',
    label: 'src',
    children: [
      {
        id: 'components',
        label: 'components',
        children: [
          { id: 'button', label: 'Button.tsx' },
          { id: 'card', label: 'Card.tsx' },
          { id: 'modal', label: 'Modal.tsx' },
        ],
      },
      { id: 'hooks', label: 'hooks', children: [{ id: 'use-media', label: 'useMediaQuery.ts' }] },
      { id: 'index', label: 'index.ts' },
    ],
  },
  { id: 'docs', label: 'docs', children: [{ id: 'inicio', label: 'Guia de início.md' }] },
  { id: 'package', label: 'package.json' },
  { id: 'readme', label: 'README.md' },
]

export default function FileExplorer() {
  const [aberto, setAberto] = useState('Card.tsx')

  return (
    // Árvore (220–280px) e painel lado a lado; sem espaço para os dois, o painel desce.
    <Stack gap={6} direction="horizontal" align="start" wrap style={{ width: '100%' }}>
      <TreeView
        style={{ flex: '1 1 220px', maxWidth: 280 }}
        aria-label="Arquivos do projeto"
        items={arquivos}
        defaultExpanded={['src', 'components']}
        defaultSelected={['card']}
        onAction={(item) => {
          if (!item.children) setAberto(String(item.label))
        }}
      />
      <p style={{ flex: '1 1 200px', margin: 0, color: 'var(--or-color-text-muted)' }}>
        Arquivo aberto: <strong style={{ color: 'var(--or-color-text)' }}>{aberto}</strong>
      </p>
    </Stack>
  )
}
