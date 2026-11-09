import { Picker, Stack } from '@orangesys/ui'

const prioridades = [
  { value: 'urgente', label: 'Urgente', icon: 'zap' },
  { value: 'alta', label: 'Alta', icon: 'arrow-up' },
  { value: 'media', label: 'Média', icon: 'minus' },
  { value: 'baixa', label: 'Baixa', icon: 'arrow-down' },
]

export default function States() {
  return (
    <Stack gap={4} style={{ width: '100%', maxWidth: 380 }}>
      <Picker size="sm" label="Prioridade (sm)" options={prioridades} defaultValue="media" />
      <Picker label="Prioridade (md)" options={prioridades} defaultValue="alta" />
      <Picker size="lg" label="Prioridade (lg)" options={prioridades} defaultValue="urgente" />
      <Picker
        label="Prioridade"
        options={prioridades}
        required
        error="Defina a prioridade antes de publicar."
      />
      <Picker label="Prioridade" options={prioridades} defaultValue="baixa" disabled />
    </Stack>
  )
}
