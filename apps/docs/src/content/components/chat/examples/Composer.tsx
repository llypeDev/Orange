import { ChatComposer, IconButton, Stack } from '@orangesys/ui'
import { useState } from 'react'

export default function Composer() {
  const [text, setText] = useState('')
  const [sent, setSent] = useState<string | null>(null)

  return (
    <Stack gap={3} style={{ width: '100%', maxWidth: 560 }}>
      <ChatComposer
        label="Mensagem para o cliente"
        hideLabel={false}
        placeholder="Escreva uma resposta…"
        value={text}
        onChange={setText}
        onSubmit={(value) => {
          setSent(value)
          setText('') // controlado: quem limpa é você
        }}
        maxLength={500}
        showCount
        actions={
          <>
            <IconButton icon="upload" label="Anexar arquivo" size="sm" />
            <IconButton icon="image" label="Inserir imagem" size="sm" />
          </>
        }
      />
      <p style={{ margin: 0, color: 'var(--or-color-text-muted)', overflowWrap: 'anywhere' }}>
        {sent ? `Enviado: ${sent}` : 'Nenhuma mensagem enviada ainda.'}
      </p>
    </Stack>
  )
}
