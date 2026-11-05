import { Skeleton } from '@orangesys/ui'

export default function Variants() {
  return (
    <div style={{ display: 'grid', gap: 20, width: '100%', maxWidth: 420 }}>
      <Skeleton variant="text" />
      <Skeleton variant="rect" height={96} />
      <Skeleton variant="circle" width={48} />
    </div>
  )
}
