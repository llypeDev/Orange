import { Paginator } from '@orange/ui'
import { useState } from 'react'

export default function Basic() {
  const [page, setPage] = useState(6)
  return (
    <div style={{ display: 'grid', gap: 12 }}>
      <Paginator totalPages={12} page={page} onPageChange={setPage} />
      <small style={{ color: 'var(--or-color-text-subtle)' }}>Exibindo resultados da página {page}</small>
    </div>
  )
}
