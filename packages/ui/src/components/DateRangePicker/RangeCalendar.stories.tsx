import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { RangeCalendar } from './RangeCalendar'
import type { DateRange } from './rangeUtils'

const meta = {
  title: 'Componentes/RangeCalendar',
  component: RangeCalendar,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Calendário de período (padrão "grid" do WAI-ARIA, `aria-multiselectable`): 1º clique/Enter marca o início, 2º marca o fim, com prévia da faixa no hover/foco. Setas, PageUp/PageDown, Shift+PageUp/PageDown, Home/End; Escape cancela o início pendente. Início e fim têm forma própria (cantos) e descrição acessível "início"/"fim". Usado dentro do `DateRangePicker` ou sozinho.',
      },
    },
  },
  argTypes: {
    visibleMonths: { control: 'inline-radio', options: [1, 2] },
    weekStartsOn: { control: 'inline-radio', options: [0, 1] },
    minLength: { control: 'number' },
    maxLength: { control: 'number' },
    onChange: { action: 'change' },
  },
  args: {
    defaultMonth: new Date(2026, 10, 1),
    weekStartsOn: 0,
    visibleMonths: 1,
  },
} satisfies Meta<typeof RangeCalendar>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const TwoMonths: Story = {
  args: { visibleMonths: 2 },
}

export const Controlled: Story = {
  render: function Render(args) {
    const [range, setRange] = useState<DateRange | null>({
      start: new Date(2026, 10, 9),
      end: new Date(2026, 10, 13),
    })
    return (
      <div style={{ display: 'grid', gap: 12, justifyItems: 'start' }}>
        <RangeCalendar {...args} value={range} onChange={setRange} />
        <small>
          {range?.start?.toLocaleDateString('pt-BR')} a {range?.end?.toLocaleDateString('pt-BR')}
        </small>
      </div>
    )
  },
}

export const LengthLimits: Story = {
  args: { minLength: 2, maxLength: 7, weekStartsOn: 1 },
  parameters: {
    docs: {
      description: {
        story:
          'Depois de marcar o início, só ficam ativas as datas entre 2 e 7 dias de distância.',
      },
    },
  },
}

export const DisabledDates: Story = {
  args: {
    min: new Date(2026, 10, 5),
    max: new Date(2026, 11, 20),
    isDateDisabled: (date: Date) => date.getDay() === 0 || date.getDay() === 6,
  },
}
