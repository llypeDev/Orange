import { Skeleton, Stack } from '@orangesys/ui'

export default function Variants() {
  return (
    <Stack gap={5} style={{ width: '100%', maxWidth: 420 }}>
      <Skeleton variant="text" />
      <Skeleton variant="rect" height={96} />
      <Skeleton variant="circle" width={48} />
    </Stack>
  )
}
