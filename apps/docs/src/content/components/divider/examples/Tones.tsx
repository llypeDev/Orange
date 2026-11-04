import { Divider } from '@orange/ui'

export default function Tones() {
  return (
    <div style={{ width: '100%', maxWidth: 520 }}>
      <Divider tone="subtle" label="subtle" labelPosition="start" />
      <Divider tone="default" label="default" labelPosition="start" />
      <Divider tone="strong" label="strong" labelPosition="start" />
      <Divider tone="accent" label="accent" labelPosition="start" />
      <Divider tone="strong" thickness="thick" label="thick" labelPosition="start" />
    </div>
  )
}
