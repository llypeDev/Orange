import { Button, Select } from '@orange/ui'
import { useState, type FormEvent } from 'react'

export default function Validation() {
  const [motivo, setMotivo] = useState('')
  const [enviado, setEnviado] = useState(false)
  const erro = enviado && !motivo ? 'Selecione um motivo para continuar.' : undefined

  const enviar = (event: FormEvent) => {
    event.preventDefault()
    setEnviado(true)
  }

  return (
    <form
      noValidate
      onSubmit={enviar}
      style={{ display: 'grid', gap: 16, width: '100%', maxWidth: 360 }}
    >
      <Select
        label="Motivo do cancelamento"
        placeholder="Selecione"
        required
        value={motivo}
        onChange={(event) => setMotivo(event.target.value)}
        error={erro}
        options={[
          { value: 'preco', label: 'O preço ficou alto' },
          { value: 'uso', label: 'Não uso mais o serviço' },
          { value: 'concorrente', label: 'Mudei para outra empresa' },
          { value: 'outro', label: 'Outro motivo' },
        ]}
      />
      <Select
        label="Conta"
        options={[{ value: 'pj', label: 'Empresa — CNPJ final 0001' }]}
        disabled
      />
      <div>
        <Button type="submit">Continuar</Button>
      </div>
    </form>
  )
}
