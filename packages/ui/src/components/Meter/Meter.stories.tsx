import type { Meta, StoryObj } from '@storybook/react-vite'
import { Meter } from './Meter'

const meta = {
  title: 'Componentes/Meter',
  component: Meter,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Medidor de um valor escalar dentro de uma faixa conhecida (`role="meter"`). Com `low`, `high` e `optimum`, a cor muda como no `<meter>` nativo: ótimo → success, subótimo → warning, crítico → danger.',
      },
    },
  },
  argTypes: {
    value: { control: { type: 'range', min: 0, max: 128, step: 1 } },
    tone: {
      control: 'select',
      options: [undefined, 'accent', 'neutral', 'info', 'success', 'warning', 'danger'],
    },
    size: { control: 'inline-radio', options: ['sm', 'md'] },
    showValue: { control: 'boolean' },
    showThresholds: { control: 'boolean' },
  },
  args: {
    label: 'Armazenamento',
    value: 72,
    max: 128,
    low: 90,
    high: 115,
    optimum: 0,
    formatValue: (value: number, { max }: { max: number }) => `${value} GB de ${max} GB`,
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 480 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Meter>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Levels: Story = {
  render: (args) => (
    <div style={{ display: 'grid', gap: 24 }}>
      <Meter {...args} value={48} description="Ótimo — bastante espaço livre" />
      <Meter {...args} value={102} description="Subótimo — considere liberar espaço" />
      <Meter {...args} value={124} description="Crítico — novos uploads serão bloqueados" />
    </div>
  ),
}

export const HighIsGood: Story = {
  args: {
    label: 'Bateria do leitor',
    value: 35,
    max: 100,
    low: 20,
    high: 50,
    optimum: 100,
    formatValue: undefined,
  },
}

export const Neutral: Story = {
  args: {
    label: 'Cota de API usada',
    value: 6400,
    max: 10000,
    low: undefined,
    high: undefined,
    optimum: undefined,
    formatValue: (value: number) => `${value.toLocaleString('pt-BR')} de 10.000`,
    description: 'Renova em 3 dias',
  },
}

export const Small: Story = {
  args: { size: 'sm' },
}
