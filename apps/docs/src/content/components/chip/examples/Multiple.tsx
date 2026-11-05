import { Chip, ChipGroup } from '@orangesys/ui'
import { useState } from 'react'

const categories = [
  { value: 'eletronicos', label: 'Eletrônicos', count: 128 },
  { value: 'casa', label: 'Casa e cozinha', count: 86 },
  { value: 'moda', label: 'Moda', count: 240 },
  { value: 'livros', label: 'Livros', count: 57 },
  { value: 'esporte', label: 'Esporte', count: 0 },
]

export default function Multiple() {
  const [selected, setSelected] = useState<string[]>(['casa', 'livros'])

  return (
    <div style={{ display: 'grid', gap: 12 }}>
      <ChipGroup label="Categorias" value={selected} onChange={setSelected}>
        {categories.map((category) => (
          <Chip key={category.value} value={category.value} count={category.count} disabled={category.count === 0}>
            {category.label}
          </Chip>
        ))}
      </ChipGroup>
      <p style={{ margin: 0, color: 'var(--or-color-text-subtle)', fontSize: 'var(--or-text-sm)' }}>
        Filtrando por: {selected.length ? selected.join(', ') : 'todas as categorias'}
      </p>
    </div>
  )
}
