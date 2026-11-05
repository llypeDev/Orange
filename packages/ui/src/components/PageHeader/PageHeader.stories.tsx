import type { Meta, StoryObj } from '@storybook/react-vite'
import { Icon } from '../../icons'
import { Breadcrumb } from '../Breadcrumb'
import { Button } from '../Button'
import { IconButton } from '../IconButton'
import { Tab, TabList, TabPanel, Tabs } from '../Tabs'
import { Tag } from '../Tag'
import { PageHeader } from './PageHeader'

const meta = {
  title: 'Componentes/PageHeader',
  component: PageHeader,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Topo de uma página da aplicação: trilha ou link de volta, eyebrow, título (`h1` por padrão), descrição, selos, ações à direita (quebram para baixo em telas estreitas) e navegação local (abas). `reveal` faz a entrada em sequência com os tokens de motion.',
      },
    },
  },
  argTypes: {
    headingLevel: { control: 'inline-radio', options: [1, 2, 3] },
    divider: { control: 'boolean' },
    reveal: { control: 'boolean' },
  },
  args: {
    eyebrow: 'Vendas',
    title: 'Pedidos',
    description: 'Acompanhe pagamentos, envios e devoluções de todas as lojas.',
    divider: true,
    actions: (
      <>
        <Button variant="outline" startIcon={<Icon name="download" />}>
          Exportar
        </Button>
        <Button startIcon={<Icon name="plus" />}>Novo pedido</Button>
      </>
    ),
  },
} satisfies Meta<typeof PageHeader>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithBreadcrumbs: Story = {
  args: {
    eyebrow: undefined,
    title: 'Pedido #4821',
    description: 'Criado em 12 de março às 14:32 · Loja Aurora Centro',
    breadcrumbs: (
      <Breadcrumb
        items={[
          { label: 'Início', href: '#inicio' },
          { label: 'Pedidos', href: '#pedidos' },
          { label: 'Pedido #4821' },
        ]}
      />
    ),
    meta: (
      <>
        <Tag tone="success">Pago</Tag>
        <Tag tone="warning">Aguardando envio</Tag>
      </>
    ),
    actions: (
      <>
        <IconButton icon="more-horizontal" label="Mais ações" variant="outline" />
        <Button variant="outline">Imprimir etiqueta</Button>
        <Button>Marcar como enviado</Button>
      </>
    ),
  },
}

export const WithBackLink: Story = {
  args: {
    eyebrow: undefined,
    title: 'Devolução #219',
    back: { href: '#devolucoes', label: 'Devoluções' },
    description: 'Solicitada pelo cliente em 3 de abril.',
    meta: <Tag tone="info">Em análise</Tag>,
    actions: <Button>Aprovar devolução</Button>,
  },
}

export const WithTabs: Story = {
  render: (args) => (
    <Tabs defaultValue="geral">
      <PageHeader
        {...args}
        navigation={
          <TabList aria-label="Seções das configurações">
            <Tab value="geral">Geral</Tab>
            <Tab value="faturamento">Faturamento</Tab>
            <Tab value="equipe">Equipe</Tab>
            <Tab value="integracoes">Integrações</Tab>
          </TabList>
        }
      />
      <TabPanel value="geral">Nome da loja, fuso horário e moeda.</TabPanel>
      <TabPanel value="faturamento">Plano atual e histórico de faturas.</TabPanel>
      <TabPanel value="equipe">Pessoas com acesso ao painel.</TabPanel>
      <TabPanel value="integracoes">Marketplaces e meios de pagamento conectados.</TabPanel>
    </Tabs>
  ),
  args: {
    eyebrow: 'Configurações',
    title: 'Loja Aurora',
    description: 'Ajustes que valem para todas as unidades da loja.',
    actions: <Button>Salvar alterações</Button>,
  },
}

export const Reveal: Story = {
  args: {
    reveal: true,
    eyebrow: 'Relatórios',
    title: 'Vendas do trimestre',
    description: 'Receita, ticket médio e conversão por canal, atualizados a cada hora.',
  },
}

export const HeadingLevels: Story = {
  render: (args) => (
    <div style={{ display: 'grid', gap: 32 }}>
      <PageHeader {...args} headingLevel={1} title="Configurações" actions={undefined} />
      <PageHeader {...args} headingLevel={2} title="Notificações" actions={undefined} />
      <PageHeader {...args} headingLevel={3} title="E-mails de pedido" actions={undefined} />
    </div>
  ),
  args: { eyebrow: undefined, description: undefined },
}
