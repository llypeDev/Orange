import { Button, CommandPalette, type CommandGroup } from '@orangesys/ui'
import { useState } from 'react'

const clientes = [
  'Açaí da Praça',
  'Café Santa Mônica',
  'Padaria São João',
  'Mercearia Três Irmãos',
  'Ótica Visão Clara',
]

export default function Navigation() {
  const [cliente, setCliente] = useState<string>()

  const grupos: CommandGroup[] = [
    {
      label: 'Clientes',
      items: clientes.map((nome) => ({
        id: nome,
        label: nome,
        icon: 'user',
        onSelect: () => setCliente(nome),
      })),
    },
  ]

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
      <CommandPalette
        groups={grupos}
        label="Ir para cliente"
        placeholder="Nome do cliente…"
        emptyMessage="Nenhum cliente com esse nome. Tente sem acentos: “otica”, “sao joao”."
        trigger={<Button variant="outline">Ir para cliente</Button>}
      />
      <span>
        {cliente ? `Abrindo ${cliente}` : 'Busque "sao joao" ou "acai": acentos são ignorados.'}
      </span>
    </div>
  )
}
