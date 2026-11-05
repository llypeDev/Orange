import { Kbd } from '@orangesys/ui'
import { useState, type KeyboardEvent } from 'react'

export default function Pressed() {
  const [down, setDown] = useState<string[]>([])
  const press = (event: KeyboardEvent) => setDown((keys) => Array.from(new Set([...keys, event.key.toLowerCase()])))
  const release = (event: KeyboardEvent) => setDown((keys) => keys.filter((k) => k !== event.key.toLowerCase()))
  const done = down.includes('shift') && down.includes('n')

  return (
    <div style={{ display: 'grid', gap: 12, width: '100%', maxWidth: 420 }}>
      <input
        readOnly
        aria-label="Campo de treino de atalho"
        placeholder="Clique aqui e pressione Shift + N"
        onKeyDown={press}
        onKeyUp={release}
        onBlur={() => setDown([])}
        style={{
          padding: '10px 12px',
          border: '1px solid var(--or-color-border-strong)',
          background: 'var(--or-color-surface)',
          color: 'var(--or-color-text)',
        }}
      />
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <Kbd keys={['Shift', 'N']} pressed={down} />
        <span role="status" style={{ fontSize: 'var(--or-text-sm)', color: 'var(--or-color-text-subtle)' }}>
          {done ? 'Novo pedido criado!' : 'Novo pedido'}
        </span>
      </div>
      <p style={{ margin: 0, display: 'flex', gap: 12, alignItems: 'center' }}>
        <Kbd pressed>Esc</Kbd>
        <span style={{ fontSize: 'var(--or-text-sm)', color: 'var(--or-color-text-subtle)' }}>pressed fixo</span>
      </p>
    </div>
  )
}
