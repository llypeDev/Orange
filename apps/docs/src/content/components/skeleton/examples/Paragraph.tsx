import { SkeletonText, Stack } from '@orangesys/ui'

export default function Paragraph() {
  return (
    <Stack gap={6} style={{ width: '100%', maxWidth: 480 }}>
      <SkeletonText lines={3} />
      <SkeletonText lines={5} lastLineWidth="35%" />
    </Stack>
  )
}
