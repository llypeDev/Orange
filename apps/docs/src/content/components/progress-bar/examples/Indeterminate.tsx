import { ProgressBar } from '@orange/ui'

export default function Indeterminate() {
  return (
    <div style={{ width: '100%', maxWidth: 480 }}>
      <ProgressBar label="Preparando exportação" description="Isso pode levar alguns minutos." />
    </div>
  )
}
