import { Button, Checkbox, CheckboxGroup } from '@orange/ui'
import { useState, type FormEvent } from 'react'

export default function Validation() {
  const [accepted, setAccepted] = useState(false)
  const [topics, setTopics] = useState<string[]>([])
  const [submitted, setSubmitted] = useState(false)

  const onSubmit = (event: FormEvent) => {
    event.preventDefault()
    setSubmitted(true)
  }

  return (
    <form onSubmit={onSubmit} noValidate style={{ display: 'grid', gap: 24 }}>
      <CheckboxGroup
        label="Assuntos de interesse"
        required
        value={topics}
        onChange={setTopics}
        error={submitted && topics.length === 0 ? 'Escolha pelo menos um assunto.' : undefined}
        options={[
          { value: 'design', label: 'Design' },
          { value: 'engenharia', label: 'Engenharia' },
          { value: 'produto', label: 'Produto' },
        ]}
      />
      <Checkbox
        label="Li e aceito os Termos de uso"
        required
        checked={accepted}
        onCheckedChange={setAccepted}
        error={submitted && !accepted ? 'Você precisa aceitar os termos para continuar.' : undefined}
      />
      <Checkbox label="Opção indisponível" disabled />
      <div>
        <Button type="submit">Criar conta</Button>
      </div>
    </form>
  )
}
