import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { Tag } from '../Tag'
import { Splitter, SplitterHandle, SplitterPanel } from './Splitter'

const frame = {
  height: 360,
  border: '1px solid var(--or-color-border)',
  background: 'var(--or-color-bg)',
} as const

const pane = { padding: 16, display: 'grid', gap: 8, alignContent: 'start' } as const

const orders = [
  { id: '#4821', store: 'Mercearia Bom Grão', total: 'R$ 1.240,00', status: 'Pago', tone: 'success' },
  { id: '#4820', store: 'Café Ponto Doce', total: 'R$ 318,90', status: 'Aguardando envio', tone: 'warning' },
  { id: '#4819', store: 'Ateliê Fio de Linha', total: 'R$ 96,50', status: 'Em separação', tone: 'info' },
] as const

const meta = {
  title: 'Componentes/Splitter',
  component: Splitter,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Painéis redimensionáveis (padrão Window Splitter do WAI-ARIA). Cada `SplitterHandle` é um separador focável: setas (2%), Shift + setas (10%), Home/End, Enter recolhe o painel recolhível e o clique duplo volta aos tamanhos padrão. Arraste com mouse, caneta ou toque.',
      },
    },
  },
  argTypes: {
    orientation: { control: 'inline-radio', options: ['horizontal', 'vertical'] },
    stackBelow: { control: 'inline-radio', options: [undefined, 'sm', 'md'] },
    step: { control: { type: 'number', min: 1, max: 20 } },
    shiftStep: { control: { type: 'number', min: 5, max: 50 } },
    onSizesChange: { action: 'sizesChange' },
    onResizeEnd: { action: 'resizeEnd' },
  },
  args: {
    orientation: 'horizontal',
    defaultSizes: [35, 65],
    label: 'Pedidos',
  },
} satisfies Meta<typeof Splitter>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => (
    <div style={frame}>
      <Splitter {...args}>
        <SplitterPanel label="Lista de pedidos" minSize={25} maxSize={60}>
          <ul style={{ ...pane, margin: 0, listStyle: 'none' }}>
            {orders.map((order) => (
              <li key={order.id}>
                <strong>{order.id}</strong> · {order.store}
              </li>
            ))}
          </ul>
        </SplitterPanel>
        <SplitterHandle />
        <SplitterPanel label="Detalhe do pedido" minSize={30}>
          <div style={pane}>
            <strong>Pedido #4821 · Mercearia Bom Grão</strong>
            <span>3 itens · R$ 1.240,00</span>
            <Tag tone="success">Pago</Tag>
          </div>
        </SplitterPanel>
      </Splitter>
    </div>
  ),
}

export const Vertical: Story = {
  args: { orientation: 'vertical', defaultSizes: [70, 30], label: 'Editor' },
  render: (args) => (
    <div style={frame}>
      <Splitter {...args}>
        <SplitterPanel label="Descrição do produto" minSize={30}>
          <div style={pane}>
            <strong>Café especial torra média — 250 g</strong>
            <span>Notas de chocolate e caramelo, colhido no sul de Minas.</span>
          </div>
        </SplitterPanel>
        <SplitterHandle />
        <SplitterPanel label="Console de logs" collapsible minSize={15}>
          <pre style={{ ...pane, margin: 0, fontFamily: 'var(--or-font-mono)', fontSize: 13 }}>
            {'12:04:01  Rascunho salvo\n12:04:07  Título com 38 caracteres\n12:04:09  Prévia atualizada'}
          </pre>
        </SplitterPanel>
      </Splitter>
    </div>
  ),
}

export const ThreePanels: Story = {
  args: { defaultSizes: [22, 48, 30], label: 'Catálogo' },
  render: (args) => (
    <div style={frame}>
      <Splitter {...args}>
        <SplitterPanel label="Filtros" collapsible minSize={18} maxSize={32}>
          <div style={pane}>
            <strong>Filtros</strong>
            <span>Bebidas · Mercearia · Hortifrúti</span>
          </div>
        </SplitterPanel>
        <SplitterHandle />
        <SplitterPanel label="Resultados" minSize={30}>
          <div style={pane}>
            <strong>48 produtos</strong>
            <span>Café especial 250 g · R$ 42,90</span>
          </div>
        </SplitterPanel>
        <SplitterHandle />
        <SplitterPanel label="Detalhes do produto" minSize={20} maxSize={40}>
          <div style={pane}>
            <strong>Café especial 250 g</strong>
            <span>Estoque: 132 unidades</span>
          </div>
        </SplitterPanel>
      </Splitter>
    </div>
  ),
}

export const Controlled: Story = {
  render: function Render(args) {
    const [sizes, setSizes] = useState([40, 60])
    return (
      <div style={{ display: 'grid', gap: 12 }}>
        <p style={{ margin: 0 }}>
          Tamanhos: <strong>{sizes.map((s) => `${Math.round(s)}%`).join(' · ')}</strong>
        </p>
        <div style={frame}>
          <Splitter {...args} sizes={sizes} onSizesChange={setSizes}>
            <SplitterPanel label="Lista de pedidos" minSize={25}>
              <div style={pane}>Lista</div>
            </SplitterPanel>
            <SplitterHandle />
            <SplitterPanel label="Detalhe do pedido" minSize={25}>
              <div style={pane}>Detalhe</div>
            </SplitterPanel>
          </Splitter>
        </div>
      </div>
    )
  },
}

export const Persisted: Story = {
  args: { storageKey: 'storybook-splitter', defaultSizes: [30, 70] },
  render: (args) => (
    <div style={frame}>
      <Splitter {...args}>
        <SplitterPanel label="Chamados" minSize={20}>
          <div style={pane}>Redimensione e recarregue: o tamanho volta igual.</div>
        </SplitterPanel>
        <SplitterHandle />
        <SplitterPanel label="Conversa" minSize={30}>
          <div style={pane}>Clique duas vezes no separador para voltar ao padrão.</div>
        </SplitterPanel>
      </Splitter>
    </div>
  ),
}

export const Stacked: Story = {
  args: { stackBelow: 'md' },
  parameters: {
    docs: {
      description: {
        story:
          'Abaixo de 768px (`md`) os painéis empilham na ordem do código, sem separadores — só CSS. Estreite a janela para ver.',
      },
    },
  },
  render: Default.render,
}
