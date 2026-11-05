import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState, type ReactElement } from 'react'
import { SortableList, type SortableItemState, type SortableListProps } from './SortableList'

interface Task {
  id: string
  title: string
  points: number
  disabled?: boolean
}

const sprint: Task[] = [
  { id: 'checkout', title: 'Revisar fluxo de checkout', points: 5 },
  { id: 'busca', title: 'Corrigir filtro de busca por categoria', points: 3 },
  { id: 'cupom', title: 'Aplicar cupom no carrinho', points: 8 },
  { id: 'deps', title: 'Atualizar dependências do app', points: 2 },
  { id: 'api', title: 'Documentar API de pedidos', points: 3 },
]

const renderTask = (task: Task, { index }: SortableItemState) => (
  <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
    <span
      style={{
        minWidth: '2ch',
        fontFamily: 'var(--or-font-display)',
        fontWeight: 600,
        fontVariantNumeric: 'tabular-nums',
        color: 'var(--or-color-accent-text)',
      }}
    >
      {String(index + 1).padStart(2, '0')}
    </span>
    <span style={{ flex: 1, minWidth: 0 }}>{task.title}</span>
    <span style={{ color: 'var(--or-color-text-muted)', whiteSpace: 'nowrap' }}>{task.points} pts</span>
  </div>
)

/** Aplica `onReorder` no estado local, como numa tela real. */
function Controlled<T>(args: SortableListProps<T>) {
  const [items, setItems] = useState(args.items ?? [])
  return (
    <SortableList
      {...args}
      items={items}
      onReorder={(next, details) => {
        setItems(next)
        args.onReorder?.(next, details)
      }}
    />
  )
}

const meta: Meta<SortableListProps<Task>> = {
  title: 'Componentes/SortableList',
  component: SortableList as (props: SortableListProps<Task>) => ReactElement | null,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Lista reordenável: arraste pela alça (mouse, caneta ou toque), use o teclado na alça (Espaço levanta, setas movem, Espaço solta, Esc cancela) ou os botões/menu de mover — a alternativa de clique único da WCAG 2.5.7. Cada movimento é anunciado em uma região `aria-live`.',
      },
    },
  },
  argTypes: {
    orientation: { control: 'inline-radio', options: ['vertical', 'horizontal'] },
    moveControls: { control: 'inline-radio', options: ['buttons', 'menu', 'none'] },
    disabled: { control: 'boolean' },
    label: { control: 'text' },
    onReorder: { action: 'reorder' },
  },
  args: {
    label: 'Prioridades da sprint',
    items: sprint,
    renderItem: renderTask,
    orientation: 'vertical',
    moveControls: 'buttons',
    disabled: false,
  },
  render: (args) => (
    <div style={{ maxWidth: 520 }}>
      <Controlled {...args} />
    </div>
  ),
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const MenuControls: Story = {
  name: 'Menu de mover',
  args: { moveControls: 'menu' },
}

export const WithDisabledItems: Story = {
  name: 'Itens desabilitados',
  args: {
    items: [
      { id: 'hotfix', title: 'Hotfix do pagamento (fixo no topo)', points: 1, disabled: true },
      ...sprint.slice(0, 3),
      { id: 'retro', title: 'Retrospectiva da sprint (fixa no fim)', points: 1, disabled: true },
    ],
  },
}

export const Scrollable: Story = {
  name: 'Contêiner rolável',
  parameters: {
    docs: {
      description: {
        story: 'Ao arrastar perto da borda de cima ou de baixo, a lista rola sozinha.',
      },
    },
  },
  args: {
    items: Array.from({ length: 14 }, (_, i) => ({
      id: `t${i + 1}`,
      title: `Tarefa ${i + 1} do backlog`,
      points: (i % 5) + 1,
    })),
    style: { maxHeight: 280, overflowY: 'auto' },
  },
}

export const Horizontal: Story = {
  render: () => (
    <div style={{ maxWidth: '100%', overflowX: 'auto' }}>
      <Controlled
        label="Ordem das abas do painel"
        orientation="horizontal"
        moveControls="menu"
        items={['Visão geral', 'Pedidos', 'Estoque', 'Relatórios']}
        renderItem={(tab) => <span style={{ whiteSpace: 'nowrap' }}>{tab}</span>}
      />
    </div>
  ),
}

export const Disabled: Story = {
  args: { disabled: true },
}

export const CustomAnnouncements: Story = {
  name: 'Anúncios personalizados',
  args: {
    announcements: {
      dropped: ({ label, position, initialPosition }) =>
        `${label} saiu da prioridade ${initialPosition} para a ${position}.`,
    },
  },
}
