import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { OrangeProvider } from '../../providers'
import { DatePicker } from './DatePicker'

const meta = {
  title: 'Componentes/DatePicker',
  component: DatePicker,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Campo de data com máscara conforme o idioma (dd/mm/aaaa em pt-BR, mm/dd/yyyy em en-US) e calendário em diálogo modal, seguindo o padrão "Date Picker Dialog" do WAI-ARIA. Exporta também o `Calendar` standalone.',
      },
    },
  },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    weekStartsOn: { control: 'inline-radio', options: [0, 1] },
    onChange: { action: 'change' },
  },
  args: {
    label: 'Data de entrega',
    description: 'Escolha um dia útil.',
    size: 'md',
  },
} satisfies Meta<typeof DatePicker>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithValue: Story = {
  args: { defaultValue: new Date(2026, 2, 15) },
}

export const Controlled: Story = {
  render: function Render(args) {
    const [date, setDate] = useState<Date | null>(new Date(2026, 10, 3))
    return (
      <div style={{ display: 'grid', gap: 12 }}>
        <DatePicker {...args} value={date} onChange={setDate} />
        <small>Valor: {date ? date.toLocaleDateString('pt-BR') : 'nenhum'}</small>
      </div>
    )
  },
}

export const MinMaxAndDisabledDates: Story = {
  args: {
    label: 'Agendar visita',
    description: 'Próximos 30 dias, exceto fins de semana.',
    min: new Date(2026, 10, 3),
    max: new Date(2026, 11, 3),
    isDateDisabled: (date: Date) => date.getDay() === 0 || date.getDay() === 6,
  },
}

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'grid', gap: 16 }}>
      <DatePicker {...args} size="sm" label="Pequeno" />
      <DatePicker {...args} size="md" label="Médio" />
      <DatePicker {...args} size="lg" label="Grande" />
    </div>
  ),
}

export const States: Story = {
  render: (args) => (
    <div style={{ display: 'grid', gap: 16 }}>
      <DatePicker {...args} label="Obrigatório" required />
      <DatePicker {...args} label="Com erro" error="Informe a data de vencimento" />
      <DatePicker {...args} label="Desabilitado" disabled defaultValue={new Date(2026, 0, 10)} />
      <DatePicker {...args} label="Somente leitura" readOnly defaultValue={new Date(2026, 0, 10)} />
    </div>
  ),
}

export const EnglishLocale: Story = {
  render: (args) => (
    <OrangeProvider locale="en-US" themeTarget="scoped">
      <DatePicker {...args} label="Due date" description="Format mm/dd/yyyy" weekStartsOn={0} />
    </OrangeProvider>
  ),
}
