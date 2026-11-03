import { TagInput } from '@orange/ui'

export default function Basic() {
  return (
    <div style={{ width: '100%', maxWidth: 440 }}>
      <TagInput
        label="Palavras-chave do artigo"
        description="Pressione Enter ou vírgula para adicionar."
        placeholder="Ex.: acessibilidade"
        defaultValue={['design system', 'react']}
        name="palavras-chave"
      />
    </div>
  )
}
