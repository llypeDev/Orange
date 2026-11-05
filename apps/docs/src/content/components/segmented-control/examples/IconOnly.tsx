import { SegmentedControl } from '@orangesys/ui'
import { useState } from 'react'

const projects = ['Portal do cliente', 'App de entregas', 'Painel financeiro', 'Site institucional']

export default function IconOnly() {
  const [view, setView] = useState('grid')

  return (
    <div style={{ display: 'grid', gap: 16, width: '100%' }}>
      <div
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}
      >
        <strong style={{ fontFamily: 'var(--or-font-display)' }}>Projetos</strong>
        {/* O rótulo do grupo e das opções continua disponível para leitores de tela. */}
        <SegmentedControl
          label="Visualização dos projetos"
          hideLabel
          iconOnly
          size="sm"
          value={view}
          onChange={setView}
          options={[
            { value: 'list', label: 'Lista', icon: 'list' },
            { value: 'grid', label: 'Grade', icon: 'grid' },
          ]}
        />
      </div>
      <ul
        style={{
          display: 'grid',
          gridTemplateColumns: view === 'grid' ? 'repeat(auto-fill, minmax(160px, 1fr))' : '1fr',
          gap: 8,
          margin: 0,
          padding: 0,
          listStyle: 'none',
        }}
      >
        {projects.map((name) => (
          <li
            key={name}
            style={{
              padding: view === 'grid' ? '24px 16px' : '10px 16px',
              border: '1px solid var(--or-color-border)',
              fontSize: 'var(--or-text-sm)',
            }}
          >
            {name}
          </li>
        ))}
      </ul>
    </div>
  )
}
