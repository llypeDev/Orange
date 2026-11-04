import { Switch } from '@orange/ui'

export default function SizesStates() {
  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <Switch size="sm" label="Pequeno (sm)" defaultChecked />
      <Switch size="md" label="Médio (md)" defaultChecked />
      <Switch label="Desabilitado" disabled />
      <Switch label="Desabilitado e ligado" disabled defaultChecked />
    </div>
  )
}
