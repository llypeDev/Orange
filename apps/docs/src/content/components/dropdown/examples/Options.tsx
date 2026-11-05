import {
  Button,
  Dropdown,
  DropdownCheckboxItem,
  DropdownRadioGroup,
  DropdownRadioItem,
  DropdownSeparator,
  Icon,
} from '@orangesys/ui'
import { useState } from 'react'

const rotulos: Record<string, string> = { recentes: 'mais recentes', prazo: 'prazo', nome: 'nome' }

export default function Options() {
  const [concluidas, setConcluidas] = useState(true)
  const [arquivadas, setArquivadas] = useState(false)
  const [ordem, setOrdem] = useState('recentes')

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
      <Dropdown
        trigger={
          <Button variant="outline" startIcon={<Icon name="sliders" />}>
            Exibir
          </Button>
        }
      >
        <DropdownCheckboxItem checked={concluidas} onCheckedChange={setConcluidas}>
          Tarefas concluídas
        </DropdownCheckboxItem>
        <DropdownCheckboxItem checked={arquivadas} onCheckedChange={setArquivadas}>
          Tarefas arquivadas
        </DropdownCheckboxItem>
        <DropdownSeparator />
        <DropdownRadioGroup label="Ordenar por" value={ordem} onValueChange={setOrdem}>
          <DropdownRadioItem value="recentes">Mais recentes</DropdownRadioItem>
          <DropdownRadioItem value="prazo">Prazo</DropdownRadioItem>
          <DropdownRadioItem value="nome">Nome</DropdownRadioItem>
        </DropdownRadioGroup>
      </Dropdown>
      <span>
        {[concluidas && 'concluídas', arquivadas && 'arquivadas'].filter(Boolean).join(' e ') ||
          'só abertas'}
        , por {rotulos[ordem]}
      </span>
    </div>
  )
}
