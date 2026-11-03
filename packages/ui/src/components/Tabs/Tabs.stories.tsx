import type { Meta, StoryObj } from '@storybook/react-vite'
import { Icon } from '../../icons'
import { Tab, TabList, TabPanel, Tabs } from './Tabs'

const meta = {
  title: 'Componentes/Tabs',
  component: Tabs,
  subcomponents: { TabList, Tab, TabPanel } as Record<string, React.ComponentType<unknown>>,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Abas organizam conteúdo relacionado em painéis, um por vez. Padrão Tabs do WAI-ARIA: setas movem entre abas (←/→ ou ↑/↓), Home/End vão às extremidades, abas desabilitadas são puladas. Ativação automática (padrão) ou manual.',
      },
    },
  },
  argTypes: {
    variant: { control: 'inline-radio', options: ['line', 'enclosed'] },
    orientation: { control: 'inline-radio', options: ['horizontal', 'vertical'] },
    activation: { control: 'inline-radio', options: ['automatic', 'manual'] },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    fitted: { control: 'boolean' },
    onChange: { action: 'change' },
  },
  args: {
    defaultValue: 'geral',
    variant: 'line',
    orientation: 'horizontal',
    activation: 'automatic',
    size: 'md',
    fitted: false,
  },
  render: (args) => (
    <Tabs {...args}>
      <TabList aria-label="Configurações do projeto">
        <Tab value="geral">Visão geral</Tab>
        <Tab value="membros" badge={8}>
          Membros
        </Tab>
        <Tab value="integracoes">Integrações</Tab>
        <Tab value="faturamento" disabled>
          Faturamento
        </Tab>
      </TabList>
      <TabPanel value="geral">Resumo do projeto, metas do trimestre e atividade recente.</TabPanel>
      <TabPanel value="membros">8 pessoas têm acesso a este projeto.</TabPanel>
      <TabPanel value="integracoes">Conecte Slack, GitHub e Figma.</TabPanel>
      <TabPanel value="faturamento">Disponível no plano Pro.</TabPanel>
    </Tabs>
  ),
} satisfies Meta<typeof Tabs>

export default meta
type Story = StoryObj<typeof meta>

export const Line: Story = {}

export const Enclosed: Story = {
  args: { variant: 'enclosed' },
}

export const Vertical: Story = {
  args: { orientation: 'vertical' },
}

export const ManualActivation: Story = {
  args: { activation: 'manual' },
}

export const Fitted: Story = {
  args: { fitted: true },
}

export const WithIcons: Story = {
  render: (args) => (
    <Tabs {...args} defaultValue="todos">
      <TabList aria-label="Pedidos">
        <Tab value="todos" icon={<Icon name="inbox" />} badge={128}>
          Todos
        </Tab>
        <Tab value="pendentes" icon={<Icon name="clock" />} badge={12}>
          Pendentes
        </Tab>
        <Tab value="enviados" icon={<Icon name="send" />}>
          Enviados
        </Tab>
      </TabList>
      <TabPanel value="todos">128 pedidos.</TabPanel>
      <TabPanel value="pendentes">12 pedidos aguardando pagamento.</TabPanel>
      <TabPanel value="enviados">Pedidos a caminho.</TabPanel>
    </Tabs>
  ),
}

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'grid', gap: 24 }}>
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <Tabs key={size} {...args} size={size} defaultValue="a">
          <TabList aria-label={`Tamanho ${size}`}>
            <Tab value="a">Resumo</Tab>
            <Tab value="b">Detalhes</Tab>
            <Tab value="c">Histórico</Tab>
          </TabList>
        </Tabs>
      ))}
    </div>
  ),
}
