import { TreeView, type TreeViewItem } from '@orange/ui'
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
    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(220px, 280px) 1fr', gap: 24, width: '100%' }}>
      <TreeView
        aria-label="Arquivos do projeto"
        items={arquivos}
        defaultExpanded={['src', 'components']}
        defaultSelected={['card']}
        onAction={(item) => {
          if (!item.children) setAberto(String(item.label))
        }}
      />
      <p style={{ margin: 0, color: 'var(--or-color-text-muted)' }}>
        Arquivo aberto: <strong style={{ color: 'var(--or-color-text)' }}>{aberto}</strong>
      </p>
    </div>
  )
}
