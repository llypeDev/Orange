import { Badge, Button, Drawer, Icon, ListView, ListViewItem, type IconName } from '@orangesys/ui'
import { useState } from 'react'

interface Integracao {
  id: string
  nome: string
  descricao: string
  icone: IconName
  conectada: boolean
  permissoes: string
}

const integracoes: Integracao[] = [
  {
    id: 'slack',
    nome: 'Slack',
    descricao: 'Avisos de deploy e incidentes no canal #engenharia',
    icone: 'send',
    conectada: true,
    permissoes: 'Publicar mensagens em canais escolhidos pela equipe.',
  },
  {
    id: 'github',
    nome: 'GitHub',
    descricao: 'Vincula pull requests às tarefas do projeto',
    icone: 'code',
    conectada: true,
    permissoes: 'Ler repositórios e status de pull requests.',
  },
  {
    id: 'drive',
    nome: 'Google Drive',
    descricao: 'Anexa documentos e planilhas às tarefas',
    icone: 'folder',
    conectada: false,
    permissoes: 'Ler os arquivos que você escolher ao anexar.',
  },
  {
    id: 'agenda',
    nome: 'Agenda',
    descricao: 'Cria eventos a partir dos prazos das entregas',
    icone: 'calendar',
    conectada: false,
    permissoes: 'Criar e editar eventos na agenda da equipe.',
  },
]

export default function Integrations() {
  const [aberta, setAberta] = useState(false)
  const [atual, setAtual] = useState(integracoes[0])

  return (
    <div style={{ width: '100%', maxWidth: 560 }}>
      <ListView
        aria-label="Integrações"
        onAction={(id) => {
          setAtual(integracoes.find((item) => item.id === id) ?? integracoes[0])
          setAberta(true)
        }}
      >
        {integracoes.map((item) => (
          <ListViewItem
            key={item.id}
            id={item.id}
            icon={<Icon name={item.icone} />}
            description={item.descricao}
            actions={
              <Badge tone={item.conectada ? 'success' : 'neutral'}>
                {item.conectada ? 'Conectada' : 'Desconectada'}
              </Badge>
            }
          >
            {item.nome}
          </ListViewItem>
        ))}
      </ListView>
      <Drawer
        open={aberta}
        onOpenChange={setAberta}
        title={atual.nome}
        description={atual.descricao}
        footer={({ close }) => (
          <>
            <Button variant="outline" onClick={close}>
              Fechar
            </Button>
            <Button onClick={close}>{atual.conectada ? 'Desconectar' : 'Conectar'}</Button>
          </>
        )}
      >
        <p style={{ marginTop: 0 }}>
          <strong>Status:</strong> {atual.conectada ? 'conectada' : 'desconectada'}
        </p>
        <p style={{ marginBottom: 0 }}>
          <strong>Permissões:</strong> {atual.permissoes}
        </p>
      </Drawer>
    </div>
  )
}
