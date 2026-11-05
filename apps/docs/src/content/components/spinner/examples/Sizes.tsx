import { Spinner } from '@orangesys/ui'

export default function Sizes() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
      <Spinner size="sm" />
      <Spinner size="md" />
      <Spinner size="lg" />
    </div>
  )
}
