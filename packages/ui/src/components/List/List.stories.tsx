import type { Meta, StoryObj } from '@storybook/react-vite'
import { Icon } from '../../icons'
import { List, ListItem } from './List'

const meta = {
  title: 'Componentes/List',
  component: List,
  subcomponents: { ListItem },
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Listas com os marcadores do Orange: quadrado laranja (`bullet`), numeração "01" em Space Grotesk (`numbered`), ícones, divisórias ou itens em linha. `ListItem` aceita uma descrição secundária.',
      },
    },
  },
  argTypes: {
    variant: { control: 'inline-radio', options: ['bullet', 'numbered', 'icon', 'divided', 'inline', 'plain'] },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    as: { control: 'inline-radio', options: ['ul', 'ol'] },
    start: { control: 'number' },
  },
  args: {
    variant: 'bullet',
    size: 'md',
  },
  render: (args) => (
    <List {...args}>
      <ListItem>Faturas em PDF e XML</ListItem>
      <ListItem>Conciliação bancária automática</ListItem>
      <ListItem>Suporte em português de segunda a sábado</ListItem>
    </List>
  ),
} satisfies Meta<typeof List>

export default meta
type Story = StoryObj<typeof meta>

export const Bullet: Story = {}

export const Numbered: Story = {
  args: { variant: 'numbered' },
  render: (args) => (
    <List {...args}>
      <ListItem description="Use o e-mail corporativo da sua empresa.">Crie sua conta</ListItem>
      <ListItem description="Adicione as pessoas que vão aprovar pagamentos.">Convide a equipe</ListItem>
      <ListItem description="Conecte sua conta bancária em menos de 2 minutos.">Integre o banco</ListItem>
    </List>
  ),
}

export const WithIcons: Story = {
  args: { variant: 'icon', icon: <Icon name="check" /> },
  render: (args) => (
    <List {...args}>
      <ListItem>Backups diários</ListItem>
      <ListItem>Login com SSO</ListItem>
      <ListItem icon={<Icon name="lock" />}>Dados criptografados em repouso</ListItem>
    </List>
  ),
}

export const Divided: Story = {
  args: { variant: 'divided' },
  render: (args) => (
    <List {...args} style={{ maxWidth: 420 }}>
      <ListItem description="Administradora · último acesso há 2 horas">Ana Souza</ListItem>
      <ListItem description="Financeiro · último acesso ontem">Bruno Lima</ListItem>
      <ListItem description="Leitura · convite pendente">Carla Mendes</ListItem>
    </List>
  ),
}

export const Inline: Story = {
  args: { variant: 'inline', size: 'sm' },
  render: (args) => (
    <List {...args}>
      <ListItem>Termos de uso</ListItem>
      <ListItem>Privacidade</ListItem>
      <ListItem>Cookies</ListItem>
      <ListItem>Status</ListItem>
    </List>
  ),
}

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'grid', gap: 24, gridTemplateColumns: 'repeat(3, 1fr)' }}>
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <List key={size} {...args} size={size}>
          <ListItem>Tamanho {size}</ListItem>
          <ListItem>Segundo item</ListItem>
        </List>
      ))}
    </div>
  ),
}
