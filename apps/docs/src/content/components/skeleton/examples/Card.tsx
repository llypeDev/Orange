import { Skeleton, SkeletonText, Stack } from '@orangesys/ui'

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
      <Stack gap={3} direction="horizontal" align="center">
        <Skeleton variant="circle" width={40} />
        <div style={{ flex: 1 }}>
          <Skeleton width="60%" />
          <Skeleton width="35%" />
        </div>
      </Stack>
      <SkeletonText lines={2} />
    </div>
  )
}
