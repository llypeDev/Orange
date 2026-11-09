import { Checkbox, Stack } from '@orangesys/ui'

export default function Basic() {
  return (
    <Stack gap={4}>
      <Checkbox label="Lembrar de mim neste dispositivo" defaultChecked />
      <Checkbox
        label="Receber o resumo semanal por e-mail"
        description="Um e-mail toda segunda-feira com a atividade dos seus projetos."
      />
    </Stack>
  )
}
