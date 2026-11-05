import { Button, Dropdown, DropdownItem, DropdownLabel, DropdownSeparator, Icon } from '@orangesys/ui'
import { useState } from 'react'

export default function Actions() {
  const [ultima, setUltima] = useState('nenhuma')

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
      <Dropdown
        trigger={
          <Button variant="outline" endIcon={<Icon name="chevron-down" />}>
            Ações
          </Button>
        }
      >
        <DropdownLabel>Projeto</DropdownLabel>
        <DropdownItem icon="edit" shortcut="F2" onSelect={() => setUltima('Renomear')}>
          Renomear
        </DropdownItem>
        <DropdownItem icon="copy" shortcut="Ctrl D" onSelect={() => setUltima('Duplicar')}>
          Duplicar
        </DropdownItem>
        <DropdownItem icon="folder" onSelect={() => setUltima('Mover para…')}>
          Mover para…
        </DropdownItem>
        <DropdownItem icon="download" disabled>
          Exportar (plano Pro)
        </DropdownItem>
        <DropdownSeparator />
        <DropdownItem icon="trash" tone="danger" onSelect={() => setUltima('Excluir')}>
          Excluir
        </DropdownItem>
      </Dropdown>
      <span>Última ação: {ultima}</span>
    </div>
  )
}
