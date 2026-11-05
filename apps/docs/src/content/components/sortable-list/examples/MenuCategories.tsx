import { SortableList } from '@orange/ui'
import { useState } from 'react'

interface Category {
  id: string
  name: string
  products: number
  disabled?: boolean
}

const initial: Category[] = [
  { id: 'destaques', name: 'Destaques da semana', products: 6, disabled: true },
  { id: 'lanches', name: 'Lanches', products: 14 },
  { id: 'pizzas', name: 'Pizzas', products: 18 },
  { id: 'pratos', name: 'Pratos executivos', products: 9 },
  { id: 'saladas', name: 'Saladas', products: 7 },
  { id: 'combos', name: 'Combos', products: 5 },
  { id: 'bebidas', name: 'Bebidas', products: 22 },
  { id: 'sobremesas', name: 'Sobremesas', products: 11 },
]

export default function MenuCategories() {
  const [categories, setCategories] = useState(initial)

  return (
    <div style={{ width: '100%', maxWidth: 480 }}>
      <SortableList
        label="Ordem das categorias no cardápio"
        items={categories}
        onReorder={setCategories}
        getItemLabel={(category) => category.name}
        moveControls="menu"
        style={{ maxHeight: 300, overflowY: 'auto' }}
        renderItem={(category, { disabled }) => (
          <div style={{ display: 'grid', gap: 2 }}>
            <span style={{ fontWeight: 500 }}>{category.name}</span>
            <span style={{ fontSize: 'var(--or-text-xs)', color: 'var(--or-color-text-muted)' }}>
              {disabled ? 'Fixa no topo do cardápio' : `${category.products} produtos`}
            </span>
          </div>
        )}
      />
    </div>
  )
}
