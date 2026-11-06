import { ActionBar, Button, CheckboxGroup, Icon } from '@orangesys/ui'
import { useState } from 'react'

const initialNotifications = [
  { value: 'envio', label: 'Pedido #4821 saiu para entrega' },
  { value: 'comentario', label: 'Novo comentário em "Proposta comercial"' },
  { value: 'vencida', label: 'A fatura FAT-1044 venceu ontem' },
  { value: 'relatorio', label: 'Relatório semanal de vendas disponível' },
]

export default function Viewport() {
  const [notifications, setNotifications] = useState(initialNotifications)
  const [selected, setSelected] = useState<string[]>([])

  const archive = () => {
    setNotifications((current) => current.filter((item) => !selected.includes(item.value)))
    setSelected([])
  }

  return (
    <>
      <CheckboxGroup
        label="Notificações"
        description="Selecione uma ou mais: a barra aparece no rodapé da janela."
        value={selected}
        onChange={setSelected}
        options={notifications}
      />
      {notifications.length === 0 && (
        <Button variant="outline" size="sm" onClick={() => setNotifications(initialNotifications)}>
          Restaurar notificações
        </Button>
      )}
      {/* Padrão (portal): fixa na janela, centralizada, acima do conteúdo e da safe area. */}
      <ActionBar
        open={selected.length > 0}
        count={selected.length}
        onDismiss={() => setSelected([])}
      >
        <Button startIcon={<Icon name="check" />} onClick={() => setSelected([])}>
          Marcar como lidas
        </Button>
        <Button startIcon={<Icon name="folder" />} onClick={archive}>
          Arquivar
        </Button>
      </ActionBar>
    </>
  )
}
