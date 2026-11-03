import { Button, Table, type TableColumn } from '@orange/ui'
import { useState } from 'react'

interface Member {
  id: string
  name: string
  email: string
  role: string
  lastSeen: string
}

const members: Member[] = [
  { id: 'u1', name: 'Mariana Lopes', email: 'mariana@orange.dev', role: 'Administradora', lastSeen: 'Hoje, 09:42' },
  { id: 'u2', name: 'Rafael Costa', email: 'rafael@orange.dev', role: 'Editor', lastSeen: 'Ontem, 18:10' },
  { id: 'u3', name: 'Beatriz Nunes', email: 'beatriz@orange.dev', role: 'Leitora', lastSeen: '28/10/2026' },
  { id: 'u4', name: 'Diego Almeida', email: 'diego@orange.dev', role: 'Editor', lastSeen: '12/10/2026' },
]

const columns: TableColumn<Member>[] = [
  { key: 'name', header: 'Nome', rowHeader: true },
  { key: 'email', header: 'E-mail' },
  { key: 'role', header: 'Papel' },
  { key: 'lastSeen', header: 'Último acesso' },
]

export default function Selection() {
  const [selected, setSelected] = useState<string[]>(['u4'])

  return (
    <div style={{ display: 'grid', gap: 12 }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 12 }}>
        <p aria-live="polite" style={{ margin: 0, marginRight: 'auto' }}>
          {selected.length === 0 ? 'Nenhum membro selecionado' : `${selected.length} selecionado(s)`}
        </p>
        <Button variant="outline" size="sm" disabled={selected.length === 0}>
          Exportar CSV
        </Button>
        <Button variant="danger" size="sm" disabled={selected.length === 0}>
          Remover acesso
        </Button>
      </div>
      <Table
        caption="Membros da equipe"
        columns={columns}
        data={members}
        selectable
        selectedRows={selected}
        onSelectionChange={setSelected}
      />
    </div>
  )
}
