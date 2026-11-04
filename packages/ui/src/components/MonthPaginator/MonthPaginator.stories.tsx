import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { OrangeProvider } from '../../providers'
import { MonthPaginator, type YearMonth } from './MonthPaginator'

const meta = {
  title: 'Componentes/MonthPaginator',
  component: MonthPaginator,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Controle "‹ Março de 2026 ›" para navegar entre meses em extratos, agendas e relatórios. O rótulo central fica numa região `aria-live` e os limites `min`/`max` usam `aria-disabled` para não perder o foco.',
      },
    },
  },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    monthFormat: { control: 'inline-radio', options: ['long', 'short'] },
    onChange: { action: 'change' },
  },
  args: {
    defaultValue: { year: 2026, month: 2 },
    size: 'md',
  },
} satisfies Meta<typeof MonthPaginator>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Controlled: Story = {
  render: function Render(args) {
    const [month, setMonth] = useState<YearMonth>({ year: 2026, month: 10 })
    return (
      <div style={{ display: 'grid', gap: 12, justifyItems: 'start' }}>
        <MonthPaginator {...args} value={month} onChange={setMonth} />
        <small>
          Valor: {'{'} year: {month.year}, month: {month.month} {'}'}
        </small>
      </div>
    )
  },
}

export const WithLimits: Story = {
  args: {
    defaultValue: { year: 2026, month: 0 },
    min: { year: 2026, month: 0 },
    max: { year: 2026, month: 11 },
    'aria-label': 'Mês do extrato',
  },
}

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'grid', gap: 16, justifyItems: 'start' }}>
      <MonthPaginator {...args} size="sm" />
      <MonthPaginator {...args} size="md" />
      <MonthPaginator {...args} size="lg" />
    </div>
  ),
}

export const ShortFormat: Story = {
  args: { monthFormat: 'short' },
}

export const Disabled: Story = {
  args: { disabled: true },
}

export const EnglishLocale: Story = {
  render: (args) => (
    <OrangeProvider locale="en-US" themeTarget="scoped">
      <MonthPaginator {...args} />
    </OrangeProvider>
  ),
}
