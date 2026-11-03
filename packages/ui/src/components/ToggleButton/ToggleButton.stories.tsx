import type { Meta, StoryObj } from '@storybook/react-vite'
import { Icon } from '../../icons'
import { ToggleButton } from './ToggleButton'

const meta = {
  title: 'Componentes/ToggleButton',
  component: ToggleButton,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Botão de alternância com `aria-pressed`. Pressionado, ganha fundo e borda laranjas, barra inferior e ícone de check — o estado não depende só da cor. O rótulo não muda entre os estados.',
      },
    },
  },
  argTypes: {
    variant: { control: 'inline-radio', options: ['outline', 'ghost'] },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    pressed: { control: 'boolean' },
    onPressedChange: { action: 'pressedChange' },
  },
  args: {
    children: 'Somente remotas',
    variant: 'outline',
    size: 'md',
  },
} satisfies Meta<typeof ToggleButton>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Pressed: Story = {
  args: { defaultPressed: true },
}

export const Ghost: Story = {
  args: { variant: 'ghost', defaultPressed: true },
}

export const IconOnly: Story = {
  args: {
    children: undefined,
    iconOnly: true,
    'aria-label': 'Negrito',
    startIcon: <Icon name="bold" />,
    defaultPressed: true,
  },
}

export const WithIcon: Story = {
  args: { children: 'Seguir', startIcon: <Icon name="bell" /> },
}

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
      <ToggleButton {...args} size="sm" defaultPressed>
        Small
      </ToggleButton>
      <ToggleButton {...args} size="md" defaultPressed>
        Medium
      </ToggleButton>
      <ToggleButton {...args} size="lg" defaultPressed>
        Large
      </ToggleButton>
    </div>
  ),
}

export const Disabled: Story = {
  args: { disabled: true, defaultPressed: true },
}
