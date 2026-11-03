import type { Meta, StoryObj } from '@storybook/react-vite'
import { HoverCard } from './HoverCard'

const meta = {
  title: 'Componentes/HoverCard',
  component: HoverCard,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Cartão de pré-visualização exibido ao passar o ponteiro ou focar um link (com atrasos de abrir/fechar). Permanece aberto enquanto o ponteiro está sobre ele e fecha com Escape. O conteúdo é complementar: tudo nele também deve estar no destino do link.',
      },
    },
  },
  argTypes: {
    placement: { control: 'select', options: ['top', 'bottom', 'bottom-start', 'right', 'left'] },
    openDelay: { control: { type: 'number', min: 0, step: 100 } },
    closeDelay: { control: { type: 'number', min: 0, step: 50 } },
    arrow: { control: 'boolean' },
  },
  args: {
    trigger: <a href="#ana">@ana.souza</a>,
    placement: 'bottom-start',
    openDelay: 600,
    closeDelay: 300,
    arrow: false,
    children: null,
  },
} satisfies Meta<typeof HoverCard>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => (
    <p style={{ paddingBottom: 160 }}>
      Revisão solicitada por{' '}
      <HoverCard {...args}>
        <div style={{ display: 'grid', gap: 4 }}>
          <strong style={{ fontFamily: 'var(--or-font-display)', fontSize: 'var(--or-text-md)' }}>
            Ana Souza
          </strong>
          <span>Designer de produto · Time Pagamentos</span>
          <span style={{ color: 'var(--or-color-text-subtle)' }}>São Paulo · 14 projetos</span>
        </div>
      </HoverCard>{' '}
      há 2 horas.
    </p>
  ),
}
