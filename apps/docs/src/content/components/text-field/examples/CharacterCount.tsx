import { Stack, TextField } from '@orangesys/ui'

export default function CharacterCount() {
  return (
    <Stack gap={5} style={{ width: '100%', maxWidth: 420 }}>
      <TextField
        label="Título do anúncio"
        description="Seja direto: tipo do imóvel, quartos e bairro."
        maxLength={60}
        showCount
        defaultValue="Apartamento com 2 quartos na Vila Madalena"
      />
    </Stack>
  )
}
