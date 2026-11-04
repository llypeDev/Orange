import type { Meta, StoryObj } from '@storybook/react-vite'
import { Reveal } from './Reveal'

const meta = {
  title: 'Componentes/Reveal',
  component: Reveal,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Revela o conteúdo ao entrar na viewport (sobe 24px em 600ms, `--or-ease-out`). `stagger` escalona os filhos em 80ms. Conteúdo acima da dobra não pisca e o movimento reduzido mostra tudo imediatamente.',
      },
    },
  },
  argTypes: {
    variant: { control: 'inline-radio', options: ['up', 'fade', 'scale'] },
  },
  args: { variant: 'up', children: 'Conteúdo revelado' },
} satisfies Meta<typeof Reveal>

export default meta
type Story = StoryObj<typeof meta>

const box = {
  padding: 24,
  border: '1px solid var(--or-color-border-strong)',
  fontFamily: 'var(--or-font-display)',
} as const

export const AoRolar: Story = {
  name: 'Ao rolar',
  render: (args) => (
    // Região rolável focável: quem usa teclado também consegue rolar (WCAG 2.1.1).
    <div
      role="region"
      aria-label="Área rolável de demonstração"
      tabIndex={0}
      style={{ height: 420, overflow: 'auto', border: '1px dashed var(--or-color-border)' }}
    >
      <p style={{ padding: 16, color: 'var(--or-color-text-muted)' }}>Role para baixo ↓</p>
      <div style={{ height: 520 }} />
      <Reveal {...args} style={box}>
        Entrou na viewport.
      </Reveal>
      <div style={{ height: 120 }} />
    </div>
  ),
}

export const Escalonado: Story = {
  name: 'Escalonado (stagger)',
  render: () => (
    <Reveal stagger style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
      {['01 Tokens', '02 Fundamentos', '03 Componentes', '04 Storybook'].map((item) => (
        <div key={item} style={box}>
          {item}
        </div>
      ))}
    </Reveal>
  ),
}
