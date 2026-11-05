import { Switch } from '@orangesys/ui'

export default function Basic() {
  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <Switch label="Modo escuro" defaultChecked />
      <Switch label="Backup automático" description="Salvamos uma cópia dos seus arquivos todos os dias às 3h." />
    </div>
  )
}
