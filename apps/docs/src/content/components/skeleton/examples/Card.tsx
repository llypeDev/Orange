import { Skeleton, SkeletonText } from '@orangesys/ui'

export default function Card() {
  return (
    <div
      style={{
        display: 'grid',
        gap: 16,
        width: 320,
        padding: 20,
        border: '1px solid var(--or-color-border)',
      }}
    >
      <Skeleton variant="rect" height={160} />
      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <Skeleton variant="circle" width={40} />
        <div style={{ flex: 1 }}>
          <Skeleton width="60%" />
          <Skeleton width="35%" />
        </div>
      </div>
      <SkeletonText lines={2} />
    </div>
  )
}
