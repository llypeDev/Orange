import { Button, Rating } from '@orangesys/ui'
import { useState, type FormEvent } from 'react'

const rotulos = ['Péssima', 'Ruim', 'Regular', 'Boa', 'Excelente']

export default function Survey() {
  const [nota, setNota] = useState<number | null>(null)
  const [enviado, setEnviado] = useState(false)

  const enviar = (event: FormEvent) => {
    event.preventDefault()
    setEnviado(true)
  }

  return (
    <form onSubmit={enviar} noValidate style={{ display: 'grid', gap: 16, justifyItems: 'start' }}>
      <Rating
        label="Como foi a entrega do seu pedido?"
        description="Sua resposta é anônima."
        labels={rotulos}
        value={nota}
        onChange={setNota}
        required
        error={enviado && !nota ? 'Escolha uma nota de 1 a 5 estrelas.' : undefined}
      />
      <Button type="submit">Enviar avaliação</Button>
    </form>
  )
}
