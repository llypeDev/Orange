import { TextField } from '@orange/ui'

export default function CharacterCount() {
  return (
    <div style={{ display: 'grid', gap: 20, width: '100%', maxWidth: 420 }}>
      <TextField
        label="Título do anúncio"
        description="Seja direto: tipo do imóvel, quartos e bairro."
        maxLength={60}
        showCount
        defaultValue="Apartamento com 2 quartos na Vila Madalena"
      />
    </div>
  )
}
