import { TreeView, type TreeViewItem } from '@orangesys/ui'
import { useState } from 'react'

const pastas: TreeViewItem[] = [
  {
    id: 'financeiro',
    label: 'Financeiro',
    children: [
      { id: 'notas', label: 'Notas fiscais' },
      { id: 'contratos', label: 'Contratos' },
      { id: 'relatorios', label: 'Relatórios mensais' },
    ],
  },
  {
    id: 'marketing',
    label: 'Marketing',
    children: [
      { id: 'campanhas', label: 'Campanhas 2026' },
      { id: 'marca', label: 'Manual da marca' },
    ],
  },
  { id: 'rh', label: 'Pessoas', children: [{ id: 'politicas', label: 'Políticas internas' }] },
  { id: 'arquivo-morto', label: 'Arquivo morto', disabled: true },
]

export default function MultipleSelection() {
  const [selecionadas, setSelecionadas] = useState<string[]>(['notas', 'campanhas'])

  return (
    <div style={{ display: 'grid', gap: 12, width: '100%', maxWidth: 320 }}>
      <p id="sync-label" style={{ margin: 0, fontWeight: 600 }}>
        Pastas sincronizadas no computador
      </p>
      <TreeView
        aria-labelledby="sync-label"
        items={pastas}
        selectionMode="multiple"
        selected={selecionadas}
        onSelectedChange={setSelecionadas}
        defaultExpanded={['financeiro', 'marketing']}
        expandOnClick={false}
      />
      <p style={{ margin: 0, fontSize: 13, color: 'var(--or-color-text-muted)' }}>
        {selecionadas.length} {selecionadas.length === 1 ? 'pasta selecionada' : 'pastas selecionadas'}
      </p>
    </div>
  )
}
