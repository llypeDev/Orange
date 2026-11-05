import { Button, ConfirmDialog, Dropdown, DropdownItem, DropdownSeparator, Icon } from '@orangesys/ui'
import { useState } from 'react'

export default function WithConfirm() {
  const [confirmar, setConfirmar] = useState(false)
  const [ativo, setAtivo] = useState(true)

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
      <span>Webhook de pedidos: {ativo ? 'ativo' : 'removido'}</span>
      {!ativo && (
        <Button variant="ghost" size="sm" onClick={() => setAtivo(true)}>
          Recriar
        </Button>
      )}
      <Dropdown
        trigger={
          <Button variant="outline" size="sm" endIcon={<Icon name="chevron-down" />}>
            Gerenciar
          </Button>
        }
      >
        <DropdownItem icon="refresh" disabled={!ativo}>
          Reenviar último evento
        </DropdownItem>
        <DropdownItem icon="edit" disabled={!ativo}>
          Editar URL
        </DropdownItem>
        <DropdownSeparator />
        <DropdownItem
          icon="trash"
          tone="danger"
          disabled={!ativo}
          onSelect={() => setConfirmar(true)}
        >
          Remover webhook…
        </DropdownItem>
      </Dropdown>
      <ConfirmDialog
        open={confirmar}
        onOpenChange={setConfirmar}
        tone="danger"
        title="Remover o webhook de pedidos?"
        description="Seu sistema deixa de receber notificações de novos pedidos."
        confirmLabel="Remover webhook"
        onConfirm={() => setAtivo(false)}
      />
    </div>
  )
}
