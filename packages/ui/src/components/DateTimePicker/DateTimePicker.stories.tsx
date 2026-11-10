import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { OrangeProvider } from '../../providers'
import { DateTimePicker } from './DateTimePicker'

// Datas fixas em novembro de 2026 (o mês fixado nas stories de data e na regressão visual).
const reuniao = new Date(2026, 10, 13, 14, 30)

const meta = {
  title: 'Componentes/DateTimePicker',
  component: DateTimePicker,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Campo de data e hora num só controle (grupo rotulado pelo label): a data com máscara conforme o idioma e calendário em diálogo, como no `DatePicker`, e a hora em segmentos (hora, minuto, segundo, AM/PM), como no `TimeField` — igual em todos os navegadores, no relógio de 12 ou 24 horas do idioma do `OrangeProvider`. Valor `Date | null` em hora local; escolher um dia mantém a hora (ou usa `defaultTime`) e editar a hora mantém o dia. `min`/`max` valem para data e hora, e as setas da hora respeitam `step` e param no limite do dia. Com `name`, envia `aaaa-mm-ddTHH:mm`.',
      },
    },
  },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    weekStartsOn: { control: 'inline-radio', options: [0, 1] },
    step: { control: 'number' },
    defaultTime: { control: 'text' },
    onChange: { action: 'change' },
  },
  args: {
    label: 'Data e hora da reunião',
    description: 'Horário de Brasília (UTC−3).',
    size: 'md',
  },
} satisfies Meta<typeof DateTimePicker>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: { defaultValue: reuniao },
}

export const Empty: Story = {
  args: { label: 'Agendar publicação', description: 'Digite a data e a hora ou use o calendário.' },
}

/** `step` de 15 minutos: as setas da hora andam de 15 em 15, a partir da meia-noite. */
export const DefaultTime: Story = {
  args: {
    label: 'Agendar publicação',
    description: 'Ao escolher o dia no calendário, a hora começa em 09:00.',
    defaultTime: '09:00',
    step: 900,
  },
}

export const MinMaxAndDisabledDates: Story = {
  args: {
    label: 'Entrega agendada',
    description: 'Dias úteis entre 16/11 às 08:00 e 11/12 às 18:00.',
    min: new Date(2026, 10, 16, 8, 0),
    max: new Date(2026, 11, 11, 18, 0),
    isDateDisabled: (date: Date) => date.getDay() === 0 || date.getDay() === 6,
    weekStartsOn: 1,
  },
}

/** No dia de `min` (16/11) e no de `max` (11/12), as setas da hora param no horário-limite. */
export const TimeLimits: Story = {
  args: {
    label: 'Entrega agendada',
    description: 'A partir de 16/11 às 08:00 e até 11/12 às 18:00.',
    min: new Date(2026, 10, 16, 8, 0),
    max: new Date(2026, 11, 11, 18, 0),
    defaultValue: new Date(2026, 10, 16, 9, 30),
  },
}

export const Controlled: Story = {
  render: function Render(args) {
    const [value, setValue] = useState<Date | null>(reuniao)
    return (
      <div style={{ display: 'grid', gap: 12 }}>
        <DateTimePicker {...args} value={value} onChange={setValue} />
        <small>
          Valor:{' '}
          {value
            ? value.toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })
            : 'nenhum'}
        </small>
      </div>
    )
  },
}

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'grid', gap: 16 }}>
      <DateTimePicker {...args} size="sm" label="Pequeno" defaultValue={reuniao} />
      <DateTimePicker {...args} size="md" label="Médio" defaultValue={reuniao} />
      <DateTimePicker {...args} size="lg" label="Grande" defaultValue={reuniao} />
    </div>
  ),
}

export const States: Story = {
  render: (args) => (
    <div style={{ display: 'grid', gap: 16 }}>
      <DateTimePicker {...args} label="Obrigatório" required />
      <DateTimePicker
        {...args}
        label="Com erro"
        defaultValue={reuniao}
        error="A sala já está reservada neste horário."
      />
      <DateTimePicker {...args} label="Desabilitado" disabled defaultValue={reuniao} />
      <DateTimePicker {...args} label="Somente leitura" readOnly defaultValue={reuniao} />
    </div>
  ),
}

export const WithSeconds: Story = {
  args: {
    label: 'Largada da prova',
    description: 'Com step abaixo de 60, a hora ganha o segmento dos segundos.',
    step: 1,
    defaultValue: new Date(2026, 10, 15, 7, 30, 15),
  },
}

/** O relógio segue o idioma do provider, como a data: 12 horas com AM/PM em inglês americano. */
export const EnglishLocale: Story = {
  render: (args) => (
    <OrangeProvider locale="en-US" themeTarget="scoped">
      <DateTimePicker
        {...args}
        label="Meeting date and time"
        description="Format mm/dd/yyyy, 12-hour clock."
        defaultValue={reuniao}
      />
    </OrangeProvider>
  ),
}
