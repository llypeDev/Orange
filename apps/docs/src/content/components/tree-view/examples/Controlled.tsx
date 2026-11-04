import { Button, TreeView, type TreeViewItem } from '@orange/ui'
import { useState } from 'react'

const paginas: TreeViewItem[] = [
  {
    id: 'inicio',
    label: 'Início',
    children: [
      { id: 'sobre', label: 'Sobre nós', children: [{ id: 'equipe', label: 'Equipe' }, { id: 'carreiras', label: 'Carreiras' }] },
      { id: 'produtos', label: 'Produtos', children: [{ id: 'pro', label: 'Plano Pro' }, { id: 'empresa', label: 'Plano Empresa' }] },
      { id: 'blog', label: 'Blog' },
    ],
  },
  { id: 'ajuda', label: 'Central de ajuda', children: [{ id: 'faq', label: 'Perguntas frequentes' }] },
]

const pastas = ['inicio', 'sobre', 'produtos', 'ajuda']

export default function Controlled() {
  const [expandidos, setExpandidos] = useState<string[]>(['inicio'])

  return (
    <div style={{ display: 'grid', gap: 12, width: '100%', maxWidth: 320 }}>
      <div style={{ display: 'flex', gap: 8 }}>
        <Button size="sm" variant="outline" onClick={() => setExpandidos(pastas)}>
          Expandir tudo
        </Button>
        <Button size="sm" variant="ghost" onClick={() => setExpandidos([])}>
          Recolher tudo
        </Button>
      </div>
      <TreeView
        aria-label="Mapa do site"
        items={paginas}
        expanded={expandidos}
        onExpandedChange={setExpandidos}
        selectionMode="none"
        defaultIcons={false}
      />
    </div>
  )
}
