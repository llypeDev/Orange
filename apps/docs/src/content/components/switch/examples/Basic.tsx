import { Stack, Switch } from '@orangesys/ui'

export default function Basic() {
  return (
    <Stack gap={4}>
      <Switch label="Modo escuro" defaultChecked />
      <Switch label="Backup automático" description="Salvamos uma cópia dos seus arquivos todos os dias às 3h." />
    </Stack>
  )
}
