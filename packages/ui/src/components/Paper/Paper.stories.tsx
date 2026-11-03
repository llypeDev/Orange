import type { Meta, StoryObj } from '@storybook/react-vite'
import { Paper } from './Paper'

const meta = {
  title: 'Componentes/Paper',
  component: Paper,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Superfície base: fundo, borda de 1px e espaçamento interno. É a base de cartões, painéis e seções. Polimórfica via `as`.',
      },
    },
  },
  argTypes: {
    as: { control: 'select', options: ['div', 'section', 'article', 'aside'] },
    padding: { control: 'select', options: [0, 1, 2, 3, 4, 5, 6, 8, 10, 12] },
    border: { control: 'inline-radio', options: ['none', 'default', 'strong', 'accent-top', 'accent-left'] },
    elevation: { control: 'inline-radio', options: ['flat', 'raised', 'overlay'] },
    tone: { control: 'inline-radio', options: ['default', 'subtle', 'inverse'] },
  },
  args: {
    padding: 6,
    border: 'default',
    elevation: 'flat',
    tone: 'default',
    children: (
      <>
        <p className="or-eyebrow" style={{ margin: 0 }}>
          Plano atual
        </p>
        <p style={{ margin: '8px 0 0' }}>Pro anual — renova em 12 de março de 2027.</p>
      </>
    ),
  },
} satisfies Meta<typeof Paper>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Borders: Story = {
  render: (args) => (
    <div style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))' }}>
      {(['none', 'default', 'strong', 'accent-top', 'accent-left'] as const).map((border) => (
        <Paper key={border} {...args} border={border} tone={border === 'none' ? 'subtle' : args.tone}>
          {border}
        </Paper>
      ))}
    </div>
  ),
}

export const Elevation: Story = {
  render: (args) => (
    <div style={{ display: 'grid', gap: 24, gridTemplateColumns: 'repeat(3, 1fr)', padding: 24 }}>
      {(['flat', 'raised', 'overlay'] as const).map((elevation) => (
        <Paper key={elevation} {...args} elevation={elevation}>
          {elevation}
        </Paper>
      ))}
    </div>
  ),
}

export const Tones: Story = {
  render: (args) => (
    <div style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(3, 1fr)' }}>
      {(['default', 'subtle', 'inverse'] as const).map((tone) => (
        <Paper key={tone} {...args} tone={tone}>
          {tone}
        </Paper>
      ))}
    </div>
  ),
}

export const AsSection: Story = {
  args: {
    as: 'section',
    'aria-label': 'Resumo da fatura',
    border: 'accent-top',
    children: 'Total de março: R$ 1.240,00',
  },
}
