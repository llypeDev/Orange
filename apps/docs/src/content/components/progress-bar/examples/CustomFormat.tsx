import { ProgressBar, Stack } from '@orangesys/ui'

export default function CustomFormat() {
  return (
    <Stack gap={6} style={{ width: '100%', maxWidth: 480 }}>
      <ProgressBar
        label="Importando contatos"
        value={320}
        max={800}
        formatValue={(value, { max }) => `${value} de ${max} contatos`}
      />
      <ProgressBar
        label="Configuração da conta"
        value={2}
        min={0}
        max={5}
        size="sm"
        formatValue={(value, { max }) => `Etapa ${value} de ${max}`}
      />
    </Stack>
  )
}
