import {
  Avatar,
  Button,
  Dropdown,
  DropdownItem,
  DropdownSeparator,
  IconButton,
  ListView,
  ListViewItem,
} from '@orangesys/ui'
import { useState } from 'react'

const equipeInicial = [
  { id: 'ana', nome: 'Ana Souza', funcao: 'Administradora · Financeiro' },
  { id: 'bruno', nome: 'Bruno Lima', funcao: 'Editor · Marketing' },
  { id: 'carla', nome: 'Carla Dias', funcao: 'Leitora · Jurídico' },
  { id: 'diego', nome: 'Diego Alves', funcao: 'Convite expirado', expirado: true },
  { id: 'elisa', nome: 'Elisa Moraes', funcao: 'Editora · Produto' },
]

export default function TeamMembers() {
  const [equipe, setEquipe] = useState(equipeInicial)
  const [selecionados, setSelecionados] = useState<string[]>(['bruno'])

  const remover = (ids: string[]) => {
    setEquipe((atual) => atual.filter((membro) => !ids.includes(membro.id)))
    setSelecionados((atual) => atual.filter((id) => !ids.includes(id)))
  }

  return (
    <div style={{ display: 'grid', gap: 12, width: '100%', maxWidth: 560 }}>
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
        }}
      >
        <p id="membros-titulo" style={{ margin: 0, fontWeight: 600 }}>
          Membros da equipe
        </p>
        <Button
          size="sm"
          variant="outline"
          disabled={selecionados.length === 0}
          onClick={() => remover(selecionados)}
        >
          Remover selecionados ({selecionados.length})
        </Button>
      </div>
      <ListView
        aria-labelledby="membros-titulo"
        selectionMode="multiple"
        selected={selecionados}
        onSelectedChange={setSelecionados}
      >
        {equipe.map((membro) => (
          <ListViewItem
            key={membro.id}
            id={membro.id}
            icon={<Avatar name={membro.nome} size="sm" alt="" />}
            description={membro.funcao}
            disabled={membro.expirado}
            actions={
              <Dropdown
                trigger={
                  <IconButton
                    size="sm"
                    icon="more-horizontal"
                    label={`Ações de ${membro.nome}`}
                    disabled={membro.expirado}
                  />
                }
              >
                <DropdownItem icon="user">Ver perfil</DropdownItem>
                <DropdownItem icon="edit">Alterar função</DropdownItem>
                <DropdownSeparator />
                <DropdownItem icon="trash" tone="danger" onSelect={() => remover([membro.id])}>
                  Remover da equipe
                </DropdownItem>
              </Dropdown>
            }
          >
            {membro.nome}
          </ListViewItem>
        ))}
      </ListView>
    </div>
  )
}
