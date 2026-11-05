import { Button, Listbox, ListboxGroup, ListboxOption } from '@orange/ui'
import { useState } from 'react'

const grupos = [
  {
    titulo: 'Alimentos',
    categorias: [
      { value: 'hortifruti', nome: 'Hortifrúti' },
      { value: 'padaria', nome: 'Padaria' },
      { value: 'laticinios', nome: 'Laticínios' },
      { value: 'carnes', nome: 'Carnes e peixes' },
      { value: 'congelados', nome: 'Congelados' },
    ],
  },
  {
    titulo: 'Bebidas',
    categorias: [
      { value: 'cafes', nome: 'Cafés e chás' },
      { value: 'sucos', nome: 'Sucos' },
      { value: 'vinhos', nome: 'Vinhos e espumantes' },
    ],
  },
  {
    titulo: 'Casa',
    categorias: [
      { value: 'limpeza', nome: 'Limpeza' },
      { value: 'higiene', nome: 'Higiene pessoal' },
      { value: 'utilidades', nome: 'Utilidades domésticas' },
    ],
  },
]

export default function StoreFilter() {
  const [categorias, setCategorias] = useState<string[]>(['padaria', 'cafes'])

  return (
    <div style={{ display: 'grid', gap: 12, width: '100%', maxWidth: 360 }}>
      <Listbox
        label="Categorias"
        description="Clique para marcar. Shift+clique ou Shift+↓ marcam em sequência; Ctrl+A marca todas."
        selectionMode="multiple"
        value={categorias}
        onChange={setCategorias}
        maxHeight={320}
      >
        {grupos.map((grupo) => (
          <ListboxGroup key={grupo.titulo} label={grupo.titulo}>
            {grupo.categorias.map((c) => (
              <ListboxOption key={c.value} value={c.value}>
                {c.nome}
              </ListboxOption>
            ))}
          </ListboxGroup>
        ))}
      </Listbox>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
        <span style={{ fontSize: 13, color: 'var(--or-color-text-subtle)' }} aria-live="polite">
          {categorias.length === 0
            ? 'Todas as categorias'
            : categorias.length === 1
              ? '1 categoria no filtro'
              : `${categorias.length} categorias no filtro`}
        </span>
        <Button size="sm" variant="ghost" onClick={() => setCategorias([])} disabled={categorias.length === 0}>
          Limpar filtro
        </Button>
      </div>
    </div>
  )
}
