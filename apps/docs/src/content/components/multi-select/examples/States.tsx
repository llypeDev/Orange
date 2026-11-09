import { MultiSelect, Stack } from '@orangesys/ui'

const idiomas = [
  { value: 'pt', label: 'Português' },
  { value: 'en', label: 'Inglês' },
  { value: 'es', label: 'Espanhol' },
  { value: 'fr', label: 'Francês' },
  { value: 'de', label: 'Alemão' },
]

export default function States() {
  return (
    <Stack gap={4} style={{ width: '100%', maxWidth: 420 }}>
      <MultiSelect size="sm" label="Idiomas (sm)" options={idiomas} defaultValue={['pt', 'en']} />
      <MultiSelect
        label="Idiomas do atendimento"
        options={idiomas}
        required
        error="Escolha ao menos um idioma."
      />
      <MultiSelect
        size="lg"
        label="Idiomas (lg, desabilitado)"
        options={idiomas}
        defaultValue={['es']}
        disabled
      />
    </Stack>
  )
}
