import { Button, Icon, Stack, useConfirm } from '@orangesys/ui'
import { useState } from 'react'

const membrosIniciais = ['Ana Souza', 'Bruno Lima', 'Carla Mendes']

export default function UseConfirm() {
  const [membros, setMembros] = useState(membrosIniciais)
  const [confirm, confirmDialog] = useConfirm()

  const remover = async (nome: string) => {
    const ok = await confirm({
      tone: 'danger',
      title: `Remover ${nome} da equipe?`,
      description: 'A pessoa perde o acesso aos projetos da equipe imediatamente.',
      confirmLabel: 'Remover',
    })
    if (ok) setMembros((lista) => lista.filter((m) => m !== nome))
  }

  return (
    <Stack gap={2} style={{ width: '100%', maxWidth: 420 }}>
      {membros.map((nome) => (
        <div
          key={nome}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '8px 12px',
            border: '1px solid var(--or-color-border)',
          }}
        >
          <span>{nome}</span>
          <Button
            size="sm"
            variant="ghost"
            startIcon={<Icon name="trash" />}
            aria-label={`Remover ${nome}`}
            onClick={() => remover(nome)}
          >
            Remover
          </Button>
        </div>
      ))}
      {membros.length === 0 && (
        <Button variant="outline" onClick={() => setMembros(membrosIniciais)}>
          Restaurar equipe
        </Button>
      )}
      {confirmDialog}
    </Stack>
  )
}
