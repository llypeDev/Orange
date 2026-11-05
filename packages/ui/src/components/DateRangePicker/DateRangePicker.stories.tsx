import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { OrangeProvider } from '../../providers'
import { DateRangePicker } from './DateRangePicker'
import type { DateRange } from './rangeUtils'

const hoje = new Date()
const amanha = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate() + 1)

const meta = {
  title: 'Componentes/DateRangePicker',
  component: DateRangePicker,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Campo de período: duas datas com máscara conforme o idioma num só controle (grupo rotulado pelo label), calendário de período em diálogo — dois meses em telas largas, um no celular — e atalhos opcionais. O 1º clique/Enter marca o início, o 2º marca o fim (trocando se vier antes), com prévia da faixa no hover/foco. Envia `name[start]` e `name[end]` em ISO. Exporta também o `RangeCalendar` standalone.',
      },
    },
  },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    visibleMonths: { control: 'inline-radio', options: [1, 2] },
    weekStartsOn: { control: 'inline-radio', options: [0, 1] },
    minLength: { control: 'number' },
    maxLength: { control: 'number' },
    onChange: { action: 'change' },
  },
  args: {
    label: 'Período do relatório',
    description: 'Digite as datas ou escolha no calendário.',
    size: 'md',
    visibleMonths: 2,
  },
} satisfies Meta<typeof DateRangePicker>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithValue: Story = {
  args: { defaultValue: { start: new Date(2026, 2, 10), end: new Date(2026, 2, 24) } },
}

export const WithPresets: Story = {
  args: {
    label: 'Vendas no período',
    max: hoje,
    presets: ['today', 'last7Days', 'last30Days', 'thisMonth', 'lastMonth', 'thisYear'],
  },
}

export const Booking: Story = {
  args: {
    label: 'Check-in e check-out',
    description: 'Mínimo de 1 noite, máximo de 14.',
    min: hoje,
    minLength: 1,
    maxLength: 14,
    weekStartsOn: 1,
  },
}

export const Controlled: Story = {
  render: function Render(args) {
    const [range, setRange] = useState<DateRange>({ start: hoje, end: amanha })
    return (
      <div style={{ display: 'grid', gap: 12 }}>
        <DateRangePicker {...args} value={range} onChange={setRange} />
        <small>
          Valor: {range.start ? range.start.toLocaleDateString('pt-BR') : '—'} a{' '}
          {range.end ? range.end.toLocaleDateString('pt-BR') : '—'}
        </small>
      </div>
    )
  },
}

export const OneMonth: Story = {
  args: { visibleMonths: 1, label: 'Período da campanha' },
}

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'grid', gap: 16 }}>
      <DateRangePicker {...args} size="sm" label="Pequeno" />
      <DateRangePicker {...args} size="md" label="Médio" />
      <DateRangePicker {...args} size="lg" label="Grande" />
    </div>
  ),
}

export const States: Story = {
  render: (args) => (
    <div style={{ display: 'grid', gap: 16 }}>
      <DateRangePicker {...args} label="Obrigatório" required />
      <DateRangePicker {...args} label="Com erro" error="Informe a vigência do contrato" />
      <DateRangePicker
        {...args}
        label="Desabilitado"
        disabled
        defaultValue={{ start: new Date(2026, 0, 5), end: new Date(2026, 0, 9) }}
      />
      <DateRangePicker
        {...args}
        label="Somente leitura"
        readOnly
        defaultValue={{ start: new Date(2026, 0, 5), end: new Date(2026, 0, 9) }}
      />
    </div>
  ),
}

export const EnglishLocale: Story = {
  render: (args) => (
    <OrangeProvider locale="en-US" themeTarget="scoped">
      <DateRangePicker
        {...args}
        label="Billing period"
        description="Format mm/dd/yyyy"
        presets={['last7Days', 'thisMonth', 'lastMonth']}
      />
    </OrangeProvider>
  ),
}
