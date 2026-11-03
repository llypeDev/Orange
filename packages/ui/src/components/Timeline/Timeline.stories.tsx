import type { Meta, StoryObj } from '@storybook/react-vite'
import { Icon } from '../../icons'
import { Timeline, TimelineItem } from './Timeline'

const meta = {
  title: 'Componentes/Timeline',
  component: Timeline,
  subcomponents: { TimelineItem },
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Sequência cronológica de eventos em um `<ol>`, com datas em `<time dateTime>` formatadas no idioma do provider, marcadores quadrados por tom e destaque do evento atual (`aria-current="step"`).',
      },
    },
  },
  argTypes: {
    variant: { control: 'inline-radio', options: ['default', 'alternate'] },
  },
  args: {
    variant: 'default',
  },
  render: (args) => (
    <Timeline {...args} aria-label="Histórico do pedido">
      <TimelineItem date="2026-03-02" title="Pedido realizado" tone="success" description="Pagamento aprovado via Pix." />
      <TimelineItem date="2026-03-03" title="Nota fiscal emitida" tone="success" />
      <TimelineItem
        date="2026-03-05"
        title="Saiu para entrega"
        current
        description="O entregador está a caminho do endereço cadastrado."
      />
      <TimelineItem dateLabel="Previsto para 06/03" title="Entregue" />
    </Timeline>
  ),
} satisfies Meta<typeof Timeline>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Alternate: Story = {
  args: { variant: 'alternate' },
}

export const Tones: Story = {
  render: (args) => (
    <Timeline {...args}>
      <TimelineItem title="Neutral" tone="neutral" />
      <TimelineItem title="Accent" tone="accent" />
      <TimelineItem title="Success" tone="success" />
      <TimelineItem title="Warning" tone="warning" />
      <TimelineItem title="Danger" tone="danger" />
      <TimelineItem title="Info" tone="info" />
    </Timeline>
  ),
}

export const WithIcons: Story = {
  render: (args) => (
    <Timeline {...args} dateFormat={{ dateStyle: 'medium', timeStyle: 'short' }}>
      <TimelineItem
        date={new Date(2026, 9, 28, 14, 5)}
        title="v3.2.0 publicada"
        tone="accent"
        icon={<Icon name="rocket" />}
        description="Novo componente TreeView e melhorias de acessibilidade."
      />
      <TimelineItem date={new Date(2026, 9, 27, 18, 40)} title="Testes aprovados" tone="success" icon={<Icon name="check" />} />
      <TimelineItem date={new Date(2026, 9, 27, 9, 12)} title="Revisão solicitada" icon={<Icon name="users" />} />
    </Timeline>
  ),
}
