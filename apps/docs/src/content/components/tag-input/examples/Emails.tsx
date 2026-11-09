import { Button, Stack, TagInput } from '@orangesys/ui'
import { useState } from 'react'

const emailValido = (texto: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(texto)

export default function Emails() {
  const [convidados, setConvidados] = useState<string[]>([])

  return (
    <Stack gap={3} style={{ width: '100%', maxWidth: 440 }}>
      <TagInput
        label="Convidar pessoas"
        description="Cole uma lista de e-mails separados por vírgula ou digite um por vez."
        placeholder="nome@empresa.com"
        separators={['Enter', ',', 'Tab', ' ']}
        addOnBlur
        validate={(email) => (emailValido(email) ? true : `“${email}” não é um e-mail válido`)}
        value={convidados}
        onChange={setConvidados}
      />
      <div>
        <Button disabled={convidados.length === 0}>
          {convidados.length === 0
            ? 'Enviar convites'
            : `Enviar ${convidados.length} ${convidados.length === 1 ? 'convite' : 'convites'}`}
        </Button>
      </div>
    </Stack>
  )
}
