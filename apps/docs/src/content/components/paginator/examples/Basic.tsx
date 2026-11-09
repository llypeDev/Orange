import { Paginator, Stack } from '@orangesys/ui'
import { useState } from 'react'

export default function Basic() {
  const [page, setPage] = useState(6)
  return (
    <Stack gap={3}>
      <Paginator totalPages={12} page={page} onPageChange={setPage} />
      <small style={{ color: 'var(--or-color-text-subtle)' }}>Exibindo resultados da página {page}</small>
    </Stack>
  )
}
