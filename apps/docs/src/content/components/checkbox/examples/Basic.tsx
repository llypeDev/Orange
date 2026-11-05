import { Checkbox } from '@orangesys/ui'

export default function Basic() {
  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <Checkbox label="Lembrar de mim neste dispositivo" defaultChecked />
      <Checkbox
        label="Receber o resumo semanal por e-mail"
        description="Um e-mail toda segunda-feira com a atividade dos seus projetos."
      />
    </div>
  )
}
