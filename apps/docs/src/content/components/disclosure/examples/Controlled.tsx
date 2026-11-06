import { Button, Disclosure, Stack, TextField } from '@orangesys/ui'
import { useState, type FormEvent } from 'react'

export default function Controlled() {
  const [open, setOpen] = useState(false)
  const [error, setError] = useState<string>()

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const domain = String(new FormData(event.currentTarget).get('dominio') ?? '').trim()
    if (domain && !/^[a-z0-9-]+(\.[a-z0-9-]+)+$/i.test(domain)) {
      setError('Informe um domínio válido, como loja.suaempresa.com.br.')
      // o erro está dentro da área: abra-a para a pessoa ver e corrigir
      setOpen(true)
    } else {
      setError(undefined)
    }
  }

  return (
    <form style={{ width: '100%', maxWidth: 420 }} onSubmit={handleSubmit} noValidate>
      <Stack gap={5}>
        <TextField label="Nome da loja" defaultValue="Café Serra Azul" />
        <Disclosure label="Opções avançadas" open={open} onOpenChange={setOpen}>
          <TextField
            label="Domínio personalizado"
            name="dominio"
            defaultValue="loja serra azul"
            description="Deixe em branco para usar o endereço padrão."
            error={error}
          />
        </Disclosure>
        <div>
          <Button type="submit">Salvar</Button>
        </div>
      </Stack>
    </form>
  )
}
