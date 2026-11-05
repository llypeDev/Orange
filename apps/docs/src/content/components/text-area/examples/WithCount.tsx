import { TextArea } from '@orangesys/ui'

export default function WithCount() {
  return (
    <div style={{ width: '100%', maxWidth: 480 }}>
      <TextArea
        label="Bio"
        description="Aparece no seu perfil público."
        maxLength={160}
        showCount
        defaultValue="Designer de produto em São Paulo. Escrevo sobre acessibilidade e sistemas de design."
      />
    </div>
  )
}
