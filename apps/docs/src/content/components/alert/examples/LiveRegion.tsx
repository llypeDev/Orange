import { Alert, Button } from '@orange/ui'
import { useState, type FormEvent } from 'react'

export default function LiveRegion() {
  const [status, setStatus] = useState<'idle' | 'error' | 'success'>('idle')

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    // simula uma resposta do servidor alternando entre erro e sucesso
    setStatus((current) => (current === 'error' ? 'success' : 'error'))
  }

  return (
    <form onSubmit={submit} style={{ width: '100%' }}>
      {/* open em vez de {cond && <Alert />}: um sai recolhendo enquanto o outro entra.
          A margem fica no próprio Alert para recolher junto com ele. */}
      <Alert
        live
        open={status === 'error'}
        tone="danger"
        title="Não foi possível salvar o cliente"
        style={{ marginBottom: 12 }}
      >
        O CNPJ informado já está cadastrado em outra conta.
      </Alert>
      <Alert
        live
        open={status === 'success'}
        tone="success"
        title="Cliente salvo"
        style={{ marginBottom: 12 }}
      >
        Os dados de Padaria Pão Dourado foram atualizados.
      </Alert>
      <Button type="submit">Salvar cliente</Button>
    </form>
  )
}
