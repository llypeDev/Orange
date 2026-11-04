import type { Meta, StoryObj } from '@storybook/react-vite'
import { RelativeTime } from './RelativeTime'

const ago = (ms: number) => new Date(Date.now() - ms)
const MIN = 60_000
const DAY = 86_400_000

const meta = {
  title: 'Componentes/RelativeTime',
  component: RelativeTime,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Data relativa ("há 5 minutos", "em 3 dias") via `Intl.RelativeTimeFormat` no idioma do provider. Renderiza `<time dateTime>`, mostra a data completa no `title` e se atualiza periodicamente.',
      },
    },
  },
  argTypes: {
    format: { control: 'inline-radio', options: ['auto', 'relative', 'absolute'] },
    numeric: { control: 'inline-radio', options: ['auto', 'always'] },
    relativeStyle: { control: 'inline-radio', options: ['long', 'short', 'narrow'] },
    threshold: { control: 'number' },
    showTitle: { control: 'boolean' },
    date: { control: 'date' },
  },
  args: {
    date: ago(5 * MIN),
    format: 'auto',
    numeric: 'auto',
    relativeStyle: 'long',
    threshold: 7,
  },
} satisfies Meta<typeof RelativeTime>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Scale: Story = {
  render: (args) => (
    <ul style={{ display: 'grid', gap: 8, margin: 0, paddingLeft: 18 }}>
      {[10_000, 5 * MIN, 3 * 60 * MIN, DAY, 3 * DAY, 20 * DAY, 90 * DAY, -2 * DAY].map((ms) => (
        <li key={ms}>
          <RelativeTime {...args} date={ago(ms)} format="relative" />
        </li>
      ))}
    </ul>
  ),
}

export const AutoThreshold: Story = {
  args: { date: ago(12 * DAY), format: 'auto', threshold: 7 },
}

export const Absolute: Story = {
  args: { format: 'absolute', absoluteFormat: { dateStyle: 'long', timeStyle: 'short' } },
}

export const Short: Story = {
  args: { relativeStyle: 'short', date: ago(42 * MIN) },
}
