import { SortableList } from '@orange/ui'
import { useState } from 'react'

export default function Horizontal() {
  const [tabs, setTabs] = useState(['Visão geral', 'Pedidos', 'Estoque', 'Relatórios'])

  return (
    <div style={{ width: '100%', overflowX: 'auto', paddingBlock: 8 }}>
      <SortableList
        label="Ordem das abas do painel"
        orientation="horizontal"
        moveControls="menu"
        items={tabs}
        onReorder={setTabs}
        renderItem={(tab) => <span style={{ whiteSpace: 'nowrap', fontWeight: 500 }}>{tab}</span>}
      />
    </div>
  )
}
