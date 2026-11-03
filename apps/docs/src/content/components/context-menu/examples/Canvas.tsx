import { ContextMenu, DropdownCheckboxItem, DropdownItem, DropdownLabel, DropdownSeparator } from '@orange/ui'
import { useState } from 'react'

export default function Canvas() {
  const [notas, setNotas] = useState(1)
  const [grade, setGrade] = useState(true)

  return (
    <ContextMenu
      aria-label="Ações do quadro"
      content={
        <>
          <DropdownLabel>Quadro</DropdownLabel>
          <DropdownItem icon="plus" shortcut="N" onSelect={() => setNotas((n) => n + 1)}>
            Adicionar nota
          </DropdownItem>
          <DropdownItem icon="refresh" disabled={notas === 0} onSelect={() => setNotas(0)}>
            Limpar quadro
          </DropdownItem>
          <DropdownSeparator />
          <DropdownCheckboxItem checked={grade} onCheckedChange={setGrade}>
            Mostrar grade
          </DropdownCheckboxItem>
        </>
      }
    >
      <div
        tabIndex={0}
        role="region"
        aria-label={`Quadro com ${notas} nota${notas === 1 ? '' : 's'}`}
        style={{
          position: 'relative',
          display: 'flex',
          flexWrap: 'wrap',
          alignContent: 'flex-start',
          gap: 12,
          width: '100%',
          minHeight: 220,
          padding: 16,
          border: '1px dashed var(--or-color-border-strong)',
          backgroundImage: grade ? 'radial-gradient(var(--or-color-border-strong) 1px, transparent 1px)' : 'none',
          backgroundSize: '16px 16px',
        }}
      >
        {Array.from({ length: notas }, (_, i) => (
          <div
            key={i}
            style={{ width: 120, height: 80, padding: 8, background: 'var(--or-color-accent-subtle)', border: '1px solid var(--or-color-accent-border)', fontSize: 13 }}
          >
            Nota {i + 1}
          </div>
        ))}
        {notas === 0 && <span style={{ color: 'var(--or-color-text-subtle)' }}>Quadro vazio — clique com o botão direito.</span>}
      </div>
    </ContextMenu>
  )
}
