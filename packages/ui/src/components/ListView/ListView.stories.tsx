import type { Meta, StoryObj } from '@storybook/react-vite'
import { Icon } from '../../icons'
import { Avatar } from '../Avatar'
import { Badge } from '../Badge'
import { Button } from '../Button'
import { Dropdown, DropdownItem, DropdownSeparator } from '../Dropdown'
import { EmptyState } from '../EmptyState'
import { IconButton } from '../IconButton'
import { ListView, ListViewItem } from './ListView'

const team = [
  { id: 'ana', name: 'Ana Souza', role: 'Administradora · Financeiro' },
  { id: 'bruno', name: 'Bruno Lima', role: 'Editor · Marketing' },
  { id: 'carla', name: 'Carla Dias', role: 'Leitora · Jurídico' },
  { id: 'diego', name: 'Diego Alves', role: 'Convite pendente', pending: true },
  { id: 'elisa', name: 'Elisa Moraes', role: 'Editora · Produto' },
]

const integrations = [
  {
    id: 'slack',
    name: 'Slack',
    description: 'Avisos de deploy no canal #engenharia',
    icon: 'send',
    connected: true,
  },
  {
    id: 'github',
    name: 'GitHub',
    description: 'Sincroniza issues e pull requests',
    icon: 'code',
    connected: true,
  },
  {
    id: 'drive',
    name: 'Google Drive',
    description: 'Anexa arquivos a projetos',
    icon: 'folder',
    connected: false,
  },
  {
    id: 'calendar',
    name: 'Agenda',
    description: 'Cria eventos a partir de prazos',
    icon: 'calendar',
    connected: false,
  },
] as const

const memberActions = (name: string, disabled?: boolean) => (
  <Dropdown
    trigger={
      <IconButton size="sm" icon="more-horizontal" label={`Ações de ${name}`} disabled={disabled} />
    }
  >
    <DropdownItem icon="user">Ver perfil</DropdownItem>
    <DropdownItem icon="edit">Alterar função</DropdownItem>
    <DropdownSeparator />
    <DropdownItem icon="trash" tone="danger">
      Remover da equipe
    </DropdownItem>
  </Dropdown>
)

const meta = {
  title: 'Componentes/ListView',
  component: ListView,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Lista interativa no padrão Grid do WAI-ARIA (uma coluna): linhas com visual, título, descrição e ações. Uma só parada de Tab; ↑/↓ navegam, → / ← entram nas ações, Espaço seleciona, Enter dispara `onAction`, Ctrl + A seleciona tudo e letras buscam linhas.',
      },
    },
  },
  argTypes: {
    selectionMode: { control: 'inline-radio', options: ['none', 'single', 'multiple'] },
    size: { control: 'inline-radio', options: ['sm', 'md'] },
    onSelectedChange: { action: 'selectedChange' },
    onAction: { action: 'action' },
  },
  args: {
    'aria-label': 'Membros da equipe',
    selectionMode: 'multiple',
    size: 'md',
    defaultSelected: ['bruno'],
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 560 }}>
        <Story />
      </div>
    ),
  ],
  render: (args) => (
    <ListView {...args}>
      {team.map((member) => (
        <ListViewItem
          key={member.id}
          id={member.id}
          icon={<Avatar name={member.name} size={args.size === 'sm' ? 'xs' : 'sm'} alt="" />}
          description={member.role}
          disabled={member.pending}
          actions={memberActions(member.name, member.pending)}
        >
          {member.name}
        </ListViewItem>
      ))}
    </ListView>
  ),
} satisfies Meta<typeof ListView>

export default meta
type Story = StoryObj<typeof meta>

/**
 * Membros da equipe com seleção múltipla, avatares e menu de ações. A linha com convite pendente
 * está desabilitada: recebe foco (como no Listbox e no TreeView), mas não seleção nem ação.
 */
export const Default: Story = {}

/** Seleção única: selecionar outra linha substitui a seleção; a linha selecionada não desmarca. */
export const SingleSelection: Story = {
  args: { selectionMode: 'single', defaultSelected: ['carla'] },
}

/** `onAction` abre os detalhes (Enter ou clique na linha); sem seleção, a lista é só navegação + ação. */
export const WithAction: Story = {
  args: { 'aria-label': 'Integrações', selectionMode: 'none', defaultSelected: [] },
  render: (args) => (
    <ListView {...args}>
      {integrations.map((item) => (
        <ListViewItem
          key={item.id}
          id={item.id}
          icon={<Icon name={item.icon} />}
          description={item.description}
          actions={
            <Badge tone={item.connected ? 'success' : 'neutral'}>
              {item.connected ? 'Conectado' : 'Desconectado'}
            </Badge>
          }
        >
          {item.name}
        </ListViewItem>
      ))}
    </ListView>
  ),
}

export const Small: Story = {
  args: { size: 'sm' },
}

export const Empty: Story = {
  args: { 'aria-label': 'Integrações', selectionMode: 'none', defaultSelected: [] },
  render: (args) => (
    <ListView
      {...args}
      emptyState={
        <EmptyState
          variant="compact"
          icon="layers"
          title="Nenhuma integração conectada"
          description="Conecte ferramentas para receber avisos e sincronizar dados."
          action={<Button size="sm">Conectar integração</Button>}
        />
      }
    >
      {[]}
    </ListView>
  ),
}
