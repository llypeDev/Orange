import { SkeletonText } from '@orangesys/ui'

export default function Paragraph() {
  return (
    <div style={{ display: 'grid', gap: 24, width: '100%', maxWidth: 480 }}>
      <SkeletonText lines={3} />
      <SkeletonText lines={5} lastLineWidth="35%" />
    </div>
  )
}
