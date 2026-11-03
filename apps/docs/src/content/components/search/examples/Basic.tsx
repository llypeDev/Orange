import { Search } from '@orange/ui'
import { useState } from 'react'

export default function Basic() {
  const [ultimaBusca, setUltimaBusca] = useState<string>()

  return (
    <div style={{ display: 'grid', gap: 12, width: '100%', maxWidth: 420 }}>
      <Search
        label="Buscar na loja"
        placeholder="Buscar produtos, marcas e categorias"
        onSearch={setUltimaBusca}
      />
      <p style={{ margin: 0, fontSize: 13, color: 'var(--or-color-text-subtle)' }}>
        {ultimaBusca === undefined
          ? 'Digite e pressione Enter.'
          : `Você buscou por “${ultimaBusca}”.`}
      </p>
    </div>
  )
}
