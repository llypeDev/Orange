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
    <form onSubmit={submit} style={{ display: 'grid', gap: 12, width: '100%' }}>
      {status === 'error' && (
        <Alert live tone="danger" title="Não foi possível salvar o cliente">
          O CNPJ informado já está cadastrado em outra conta.
        </Alert>
      )}
      {status === 'success' && (
        <Alert live tone="success" title="Cliente salvo">
          Os dados de Padaria Pão Dourado foram atualizados.
        </Alert>
      )}
      <div>
        <Button type="submit">Salvar cliente</Button>
      </div>
    </form>
  )
}
