import { SegmentedControl } from '@orangesys/ui'

export default function WithIcons() {
  return (
    <SegmentedControl
      label="Tema da interface"
      defaultValue="system"
      options={[
        { value: 'light', label: 'Claro', icon: 'sun' },
        { value: 'dark', label: 'Escuro', icon: 'moon' },
        { value: 'system', label: 'Sistema', icon: 'monitor' },
      ]}
    />
  )
}
