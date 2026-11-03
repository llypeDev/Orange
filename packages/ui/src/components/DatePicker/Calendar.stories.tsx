import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { Calendar } from './Calendar'

const meta = {
  title: 'Componentes/Calendar',
  component: Calendar,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Grade mensal de datas (padrão "grid" do WAI-ARIA) com roving tabindex: setas, PageUp/PageDown, Shift+PageUp/PageDown, Home/End, Enter/Espaço. Usada dentro do `DatePicker` ou sozinha em painéis de agenda.',
      },
    },
  },
  argTypes: {
    weekStartsOn: { control: 'inline-radio', options: [0, 1] },
    showTodayButton: { control: 'boolean' },
    onChange: { action: 'change' },
  },
  args: {
    defaultMonth: new Date(2026, 10, 1),
    weekStartsOn: 0,
  },
} satisfies Meta<typeof Calendar>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Controlled: Story = {
  render: function Render(args) {
    const [date, setDate] = useState<Date | null>(new Date(2026, 10, 18))
    return <Calendar {...args} value={date} onChange={setDate} showTodayButton />
  },
}

export const WeekStartsOnMonday: Story = {
  args: { weekStartsOn: 1 },
}

export const DisabledDates: Story = {
  args: {
    min: new Date(2026, 10, 5),
    max: new Date(2026, 10, 27),
    isDateDisabled: (date: Date) => date.getDay() === 0 || date.getDay() === 6,
  },
}
