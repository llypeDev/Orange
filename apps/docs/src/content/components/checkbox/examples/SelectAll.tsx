import { Checkbox, CheckboxGroup } from '@orange/ui'
import { useState } from 'react'

const permissions = [
  { value: 'ver', label: 'Ver projetos' },
  { value: 'editar', label: 'Editar projetos' },
  { value: 'convidar', label: 'Convidar pessoas' },
  { value: 'faturamento', label: 'Gerenciar faturamento' },
]

export default function SelectAll() {
  const [selected, setSelected] = useState<string[]>(['ver', 'editar'])
  const all = selected.length === permissions.length

  return (
    <div style={{ display: 'grid', gap: 12 }}>
      <Checkbox
        label="Todas as permissões"
        checked={all}
        indeterminate={selected.length > 0 && !all}
        onCheckedChange={(checked) => setSelected(checked ? permissions.map((p) => p.value) : [])}
      />
      <div style={{ paddingLeft: 36 }}>
        <CheckboxGroup label="Permissões do papel Editor" hideLabel value={selected} onChange={setSelected} options={permissions} />
      </div>
    </div>
  )
}
