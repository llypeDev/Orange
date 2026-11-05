import type { Meta, StoryObj } from '@storybook/react-vite'
import { Paper } from '../Paper'
import { Container } from './Container'

const meta = {
  title: 'Componentes/Container',
  component: Container,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Centraliza o conteúdo com largura máxima e margens laterais que encolhem no celular (16px → 24px em md → 32px em lg). `xl` (padrão) usa `--or-layout-max-width` (1200px).',
      },
    },
  },
  argTypes: {
    as: { control: 'select', options: ['div', 'main', 'section', 'article', 'header', 'footer'] },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg', 'xl', 'full'] },
  },
  args: {
    size: 'xl',
  },
  render: (args) => (
    <Container {...args}>
      <Paper tone="subtle" padding={4}>
        Conteúdo da página: centralizado, com no máximo a largura do tamanho escolhido.
      </Paper>
    </Container>
  ),
} satisfies Meta<typeof Container>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'grid', gap: 12 }}>
      {(['sm', 'md', 'lg', 'xl', 'full'] as const).map((size) => (
        <Container key={size} {...args} size={size}>
          <Paper tone="subtle" padding={3}>
            size="{size}"
          </Paper>
        </Container>
      ))}
    </div>
  ),
}

export const AsMain: Story = {
  args: { as: 'main', size: 'sm' },
  render: (args) => (
    <Container {...args}>
      <h1 style={{ marginTop: 0 }}>Configurações da conta</h1>
      <p>Formulários e textos longos ficam mais legíveis em size="sm" (640px).</p>
    </Container>
  ),
}
