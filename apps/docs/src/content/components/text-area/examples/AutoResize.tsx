import { Button, TextArea } from '@orange/ui'
import { useState } from 'react'

export default function AutoResize() {
  const [message, setMessage] = useState('')

  return (
    <form
      style={{ display: 'grid', gap: 12, width: '100%', maxWidth: 480 }}
      onSubmit={(event) => {
        event.preventDefault()
        setMessage('')
      }}
    >
      <TextArea
        label="Responder ao chamado #4821"
        placeholder="Escreva sua resposta…"
        rows={2}
        autoResize
        maxRows={8}
        value={message}
        onValueChange={setMessage}
      />
      <div>
        <Button type="submit" size="sm" disabled={!message.trim()}>
          Enviar resposta
        </Button>
      </div>
    </form>
  )
}
