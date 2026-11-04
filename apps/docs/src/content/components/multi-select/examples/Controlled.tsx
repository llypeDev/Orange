import { Button, MultiSelect } from '@orange/ui'
import { useState } from 'react'

const status = [
  { value: 'aguardando', label: 'Aguardando pagamento' },
  { value: 'aprovado', label: 'Pagamento aprovado' },
  { value: 'separacao', label: 'Em separação' },
  { value: 'transporte', label: 'Em transporte' },
  { value: 'entregue', label: 'Entregue' },
  { value: 'cancelado', label: 'Cancelado' },
]

const pedidos = [
  { id: '#10482', status: 'transporte' },
  { id: '#10483', status: 'aguardando' },
  { id: '#10484', status: 'entregue' },
  { id: '#10485', status: 'transporte' },
  { id: '#10486', status: 'cancelado' },
  { id: '#10487', status: 'separacao' },
]

export default function Controlled() {
  const [filtro, setFiltro] = useState<string[]>(['transporte', 'separacao'])
  const visiveis = filtro.length ? pedidos.filter((p) => filtro.includes(p.status)) : pedidos

  return (
    <div style={{ display: 'grid', gap: 12, width: '100%', maxWidth: 420 }}>
      <MultiSelect
        label="Status do pedido"
        placeholder="Todos os status"
        options={status}
        value={filtro}
        onChange={setFiltro}
      />
      <p
        style={{ margin: 0, fontSize: 13, color: 'var(--or-color-text-subtle)' }}
        aria-live="polite"
      >
        {visiveis.length} de {pedidos.length} pedidos: {visiveis.map((p) => p.id).join(', ')}
      </p>
      <div style={{ display: 'flex', gap: 8 }}>
        <Button size="sm" variant="outline" onClick={() => setFiltro(['aguardando', 'aprovado'])}>
          Só pagamentos
        </Button>
        <Button size="sm" variant="ghost" onClick={() => setFiltro([])}>
          Mostrar todos
        </Button>
      </div>
    </div>
  )
}
