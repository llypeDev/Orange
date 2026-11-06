import { Chip, ChipGroup, Kbd, Table, type TableColumn } from '@orangesys/ui'
import { useState } from 'react'

interface Shortcut {
  id: string
  action: string
  keys: string[]
  /** Teclas alternativas (ex.: ↑ ou ↓) usam "/" em vez de "+". */
  alternatives?: boolean
}

const shortcuts: Shortcut[] = [
  { id: 'busca', action: 'Abrir a busca', keys: ['Mod', 'K'] },
  { id: 'novo', action: 'Novo pedido', keys: ['Mod', 'Shift', 'N'] },
  { id: 'salvar', action: 'Salvar rascunho', keys: ['Mod', 'S'] },
  { id: 'enviar', action: 'Enviar comentário', keys: ['Mod', 'Enter'] },
  { id: 'navegar', action: 'Navegar na lista', keys: ['ArrowUp', 'ArrowDown'], alternatives: true },
  { id: 'fechar', action: 'Fechar painel', keys: ['Esc'] },
]

export default function ShortcutList() {
  const [platform, setPlatform] = useState<string | null>('windows')
  const mac = platform === 'mac'

  const columns: TableColumn<Shortcut>[] = [
    { key: 'action', header: 'Ação', rowHeader: true },
    {
      key: 'keys',
      header: 'Atalho',
      align: 'end',
      render: (s) => <Kbd keys={s.keys} symbols={mac} separator={s.alternatives ? '/' : mac ? '' : '+'} />,
    },
  ]

  return (
    <div style={{ display: 'grid', gap: 16, width: '100%', maxWidth: 520 }}>
      <ChipGroup selectionMode="single" label="Sistema" value={platform} onChange={(v) => v && setPlatform(v)} size="sm">
        <Chip value="windows">Windows e Linux</Chip>
        <Chip value="mac">macOS</Chip>
      </ChipGroup>
      <Table caption="Atalhos de teclado" hideCaption columns={columns} data={shortcuts} density="compact" />
    </div>
  )
}
