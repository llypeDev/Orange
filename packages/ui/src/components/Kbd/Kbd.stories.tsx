import type { Meta, StoryObj } from '@storybook/react-vite'
import { Kbd } from './Kbd'

const meta = {
  title: 'Componentes/Kbd',
  component: Kbd,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Representa teclas e atalhos com `<kbd>`. Use `keys` para combinações (com separador "+") e `symbols` para os símbolos do macOS, que ganham nomes acessíveis (⌘ → "Command").',
      },
    },
  },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md'] },
    symbols: { control: 'boolean' },
  },
  args: {
    keys: ['Ctrl', 'K'],
    size: 'md',
    symbols: false,
  },
} satisfies Meta<typeof Kbd>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const SingleKey: Story = {
  args: { keys: undefined, children: 'Esc' },
}

export const MacSymbols: Story = {
  args: { keys: ['Mod', 'Shift', 'P'], symbols: true, separator: '' },
}

export const Arrows: Story = {
  args: { keys: ['ArrowUp', 'ArrowDown'], separator: '/' },
}

export const InText: Story = {
  render: (args) => (
    <p style={{ margin: 0 }}>
      Pressione <Kbd {...args} keys={['Mod', 'K']} /> para abrir a busca ou <Kbd {...args} keys={undefined}>?</Kbd>{' '}
      para ver todos os atalhos.
    </p>
  ),
}

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
      <Kbd {...args} size="sm" />
      <Kbd {...args} size="md" />
    </div>
  ),
}
