import { Paginator } from '@orange/ui'

export default function Compact() {
  return (
    <div style={{ display: 'grid', gap: 24 }}>
      <Paginator variant="compact" totalPages={12} defaultPage={3} />
      <Paginator variant="compact" totalPages={48} defaultPage={1} showFirstLast size="sm" aria-label="Paginação de notificações" />
    </div>
  )
}
