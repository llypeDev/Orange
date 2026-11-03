import type { Meta, StoryObj } from '@storybook/react-vite'
import { CopyButton } from './CopyButton'

const meta = {
  title: 'Componentes/CopyButton',
  component: CopyButton,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Copia `value` para a área de transferência. O ícone vira um check e "Copiado!" é anunciado numa região `aria-live="polite"`. Sem `children`, mostra só o ícone com o nome "Copiar para a área de transferência".',
      },
    },
  },
  argTypes: {
    variant: { control: 'inline-radio', options: ['primary', 'secondary', 'outline', 'ghost'] },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    timeout: { control: { type: 'number', step: 500 } },
    onCopy: { action: 'copy' },
  },
  args: {
    value: 'pnpm add @orange/ui',
  },
} satisfies Meta<typeof CopyButton>

export default meta
type Story = StoryObj<typeof meta>

export const IconOnly: Story = {}

export const WithLabel: Story = {
  args: { children: 'Copiar link', value: 'https://orange.dev/convite/equipe-produto' },
}

export const CustomConfirmation: Story = {
  args: {
    children: 'Copiar cupom',
    copiedLabel: 'Cupom copiado',
    value: 'BEMVINDO15',
    variant: 'primary',
  },
}

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
      <CopyButton {...args} size="sm" variant="outline" />
      <CopyButton {...args} size="md" variant="outline" />
      <CopyButton {...args} size="lg" variant="outline" />
    </div>
  ),
}

export const Disabled: Story = {
  args: { disabled: true, children: 'Copiar' },
}
