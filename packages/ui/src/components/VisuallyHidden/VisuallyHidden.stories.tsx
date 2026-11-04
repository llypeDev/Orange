import type { Meta, StoryObj } from '@storybook/react-vite'
import { Icon } from '../../icons'
import { VisuallyHidden } from './VisuallyHidden'

const meta = {
  title: 'Componentes/VisuallyHidden',
  component: VisuallyHidden,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Esconde conteúdo visualmente mantendo-o disponível para leitores de tela. Use `focusable` para conteúdo que deve aparecer ao receber foco (ex.: link de atalho).',
      },
    },
  },
  args: { children: 'Texto apenas para leitores de tela' },
} satisfies Meta<typeof VisuallyHidden>

export default meta
type Story = StoryObj<typeof meta>

export const IconLabel: Story = {
  render: () => (
    <button type="button" className="or-button or-button--outline or-button--md or-button--icon-only">
      <Icon name="search" />
      <VisuallyHidden>Buscar</VisuallyHidden>
    </button>
  ),
}

export const Focusable: Story = {
  render: () => (
    <VisuallyHidden as="a" focusable href="#conteudo" style={{ padding: 8, background: 'var(--or-color-accent)', color: 'var(--or-color-text-on-accent)' }}>
      Pular para o conteúdo (pressione Tab)
    </VisuallyHidden>
  ),
}
