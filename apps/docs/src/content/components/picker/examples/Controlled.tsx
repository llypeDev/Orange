import { Button, Picker, type PickerOption } from '@orangesys/ui'
import { useState } from 'react'

const status: PickerOption[] = [
  { value: 'a-fazer', label: 'A fazer', icon: 'circle' },
  { value: 'andamento', label: 'Em andamento', icon: 'clock' },
  { value: 'revisao', label: 'Em revisão', icon: 'eye' },
  { value: 'concluida', label: 'Concluída', icon: 'check-circle' },
  { value: 'arquivada', label: 'Arquivada', icon: 'folder', disabled: true },
]

export default function Controlled() {
  const [valor, setValor] = useState<string | null>('andamento')
  const [aberta, setAberta] = useState(false)

  return (
    <div style={{ display: 'grid', gap: 12, width: '100%', maxWidth: 320 }}>
      <Picker
        label="Status da tarefa"
        options={status}
        value={valor}
        onChange={setValor}
        open={aberta}
        onOpenChange={setAberta}
      />
      <p style={{ margin: 0, fontSize: 13, color: 'var(--or-color-text-subtle)' }}>
        Valor salvo: <code>{valor ?? 'nenhum'}</code> · lista {aberta ? 'aberta' : 'fechada'}
      </p>
      <div>
        <Button size="sm" variant="outline" onClick={() => setValor('concluida')}>
          Marcar como concluída
        </Button>
      </div>
    </div>
  )
}
