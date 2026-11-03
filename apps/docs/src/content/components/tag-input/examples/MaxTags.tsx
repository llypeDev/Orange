import { TagInput } from '@orange/ui'

export default function MaxTags() {
  return (
    <div style={{ width: '100%', maxWidth: 440 }}>
      <TagInput
        label="Interesses do perfil"
        description="Até 5 interesses. O contador fica ao lado do rótulo."
        maxTags={5}
        defaultValue={['fotografia', 'ciclismo', 'café']}
      />
    </div>
  )
}
