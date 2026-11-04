import type { Meta, StoryObj } from '@storybook/react-vite'
import { useRef } from 'react'
import { BackToTop } from './BackToTop'

const meta = {
  title: 'Componentes/BackToTop',
  component: BackToTop,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Botão "Voltar ao topo" para páginas longas. Aparece depois de `threshold` px rolados, rola suavemente (instantâneo com movimento reduzido) e move o foco para o início do conteúdo.',
      },
    },
  },
  argTypes: {
    threshold: { control: { type: 'number', step: 50 } },
    position: { control: 'inline-radio', options: ['fixed', 'sticky'] },
    showLabel: { control: 'boolean' },
  },
  args: {
    threshold: 200,
    showLabel: false,
  },
} satisfies Meta<typeof BackToTop>

export default meta
type Story = StoryObj<typeof meta>

const paragraphs = Array.from({ length: 24 }, (_, i) => `Movimentação ${i + 1} · Pagamento aprovado · R$ ${(i * 37.5 + 120).toFixed(2)}`)

function ScrollPanel(args: Story['args']) {
  const ref = useRef<HTMLDivElement>(null)
  return (
    <div ref={ref} tabIndex={0} aria-label="Extrato" style={{ height: 320, overflow: 'auto', padding: 16, border: '1px solid var(--or-color-border)' }}>
      <h3 style={{ marginTop: 0 }}>Extrato de outubro</h3>
      {paragraphs.map((text) => (
        <p key={text}>{text}</p>
      ))}
      <BackToTop {...args} scrollContainer={ref} position="sticky" />
    </div>
  )
}

export const InScrollContainer: Story = {
  render: (args) => <ScrollPanel {...args} />,
}

export const WithLabel: Story = {
  args: { showLabel: true },
  render: (args) => <ScrollPanel {...args} />,
}

export const FixedOnPage: Story = {
  args: { threshold: 100 },
  render: (args) => (
    <div>
      <p>Role a página do Storybook: o botão aparece no canto inferior direito.</p>
      <div style={{ height: 1600 }} />
      <BackToTop {...args} />
    </div>
  ),
}
