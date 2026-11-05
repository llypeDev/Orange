import { Button, Tag } from '@orangesys/ui'
import { useRef, useState } from 'react'

const initial = ['São Paulo', 'Até R$ 200', 'Frete grátis', 'Avaliação 4+']

export default function Removable() {
  const [filters, setFilters] = useState(initial)
  const listRef = useRef<HTMLUListElement>(null)
  const resetRef = useRef<HTMLButtonElement>(null)

  const remove = (index: number) => {
    const next = filters.filter((_, i) => i !== index)
    setFilters(next)
    // Leva o foco para a tag seguinte (ou anterior); sem tags, para o botão.
    requestAnimationFrame(() => {
      const buttons = listRef.current?.querySelectorAll<HTMLButtonElement>('button')
      const target = buttons?.[Math.min(index, next.length - 1)] ?? resetRef.current
      target?.focus()
    })
  }

  return (
    <div style={{ display: 'grid', gap: 12 }}>
      <ul
        ref={listRef}
        aria-label="Filtros aplicados"
        style={{ display: 'flex', flexWrap: 'wrap', gap: 8, margin: 0, padding: 0, listStyle: 'none' }}
      >
        {filters.map((filter, index) => (
          <li key={filter}>
            <Tag onRemove={() => remove(index)}>{filter}</Tag>
          </li>
        ))}
      </ul>
      <div>
        <Button ref={resetRef} variant="ghost" size="sm" onClick={() => setFilters(initial)}>
          Restaurar filtros
        </Button>
      </div>
    </div>
  )
}
