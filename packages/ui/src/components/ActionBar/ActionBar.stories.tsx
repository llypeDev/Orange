import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState, type CSSProperties, type ReactNode } from 'react'
import { Icon } from '../../icons'
import { Button } from '../Button'
import { Dropdown, DropdownItem, DropdownSeparator } from '../Dropdown'
import { IconButton } from '../IconButton'
import { Table, type TableColumn } from '../Table'
import { ActionBar } from './ActionBar'

const meta = {
  title: 'Componentes/ActionBar',
  component: ActionBar,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Barra flutuante de ações em lote para uma seleção (Table, TreeView, CheckboxGroup, SortableList). Controle a visibilidade pela seleção — `open={selecionados.length > 0}` —, passe `count` para o texto "N selecionados" (anunciado numa região viva educada) e `onDismiss` para o botão "Limpar seleção" e a tecla Escape. É um `role="toolbar"` com roving tabindex; aparecer não rouba o foco. Por padrão fica fixa na viewport (portal); `portal={false}` a posiciona dentro do contêiner posicionado mais próximo.',
      },
    },
  },
  argTypes: {
    open: { control: 'boolean' },
    count: { control: { type: 'number', min: 0 } },
    label: { control: 'text' },
    placement: { control: 'inline-radio', options: ['bottom', 'top'] },
    portal: { control: 'boolean' },
    onDismiss: { action: 'dismiss' },
  },
  args: {
    open: true,
    count: 3,
    placement: 'bottom',
    portal: false,
  },
} satisfies Meta<typeof ActionBar>

export default meta
type Story = StoryObj<typeof meta>

const frameStyle: CSSProperties = {
  position: 'relative',
  width: '100%',
  maxWidth: 760,
  minHeight: 180,
  padding: 16,
  border: '1px dashed var(--or-color-border-strong)',
  background: 'var(--or-color-bg-subtle)',
  color: 'var(--or-color-text-muted)',
}

function Frame({ children, width }: { children: ReactNode; width?: number }) {
  return (
    <div style={{ ...frameStyle, maxWidth: width ?? frameStyle.maxWidth }}>
      <p style={{ margin: 0 }}>Pedidos de novembro</p>
      {children}
    </div>
  )
}

// Array (não um componente): os Buttons continuam filhos diretos e herdam ghost/sm da barra.
const actions = [
  <Button key="exportar" startIcon={<Icon name="download" />}>
    Exportar
  </Button>,
  <Button key="atribuir" startIcon={<Icon name="user" />}>
    Atribuir
  </Button>,
  <Button key="excluir" startIcon={<Icon name="trash" />}>
    Excluir
  </Button>,
  <Dropdown key="mais" trigger={<IconButton icon="more-horizontal" label="Mais ações" />}>
    <DropdownItem icon="tag">Adicionar etiqueta</DropdownItem>
    <DropdownItem icon="folder">Mover para arquivo</DropdownItem>
    <DropdownSeparator />
    <DropdownItem icon="mail">Reenviar confirmação</DropdownItem>
  </Dropdown>,
]

/** Aberta, dentro de um contêiner (portal={false}) — determinística para a regressão visual. */
export const Default: Story = {
  render: (args) => (
    <Frame>
      <ActionBar {...args}>{actions}</ActionBar>
    </Frame>
  ),
}

export const Top: Story = {
  args: { placement: 'top' },
  render: Default.render,
}

export const CustomLabel: Story = {
  args: { count: 2, label: '2 pedidos · R$ 1.840,00' },
  render: (args) => (
    <Frame>
      <ActionBar {...args}>
        <Button startIcon={<Icon name="send" />}>Faturar</Button>
        <Button startIcon={<Icon name="download" />}>Exportar</Button>
      </ActionBar>
    </Frame>
  ),
}

/** Faixa estreita (≤ 32rem): a barra ocupa a largura toda e empilha contagem e ações. */
export const Narrow: Story = {
  args: { count: 12 },
  render: (args) => (
    <Frame width={320}>
      <ActionBar {...args}>{actions}</ActionBar>
    </Frame>
  ),
}

interface Order {
  id: string
  number: string
  customer: string
  status: string
  total: string
}

const orders: Order[] = [
  { id: 'p1', number: '#4821', customer: 'Padaria Aurora', status: 'Pago', total: 'R$ 1.280,00' },
  { id: 'p2', number: '#4822', customer: 'Studio Lume', status: 'Aguardando', total: 'R$ 640,00' },
  { id: 'p3', number: '#4823', customer: 'Café Tropeiro', status: 'Pago', total: 'R$ 2.115,50' },
  {
    id: 'p4',
    number: '#4824',
    customer: 'Ateliê Ponto Cruz',
    status: 'Atrasado',
    total: 'R$ 389,90',
  },
]

const columns: TableColumn<Order>[] = [
  { key: 'number', header: 'Pedido', rowHeader: true },
  { key: 'customer', header: 'Cliente' },
  { key: 'status', header: 'Situação' },
  { key: 'total', header: 'Total', align: 'end' },
]

function OrdersTable({ portal }: { portal?: boolean }) {
  const [rows, setRows] = useState(orders)
  const [selected, setSelected] = useState<string[]>([])
  return (
    <div style={{ position: 'relative', paddingBottom: portal ? 0 : 88, maxWidth: 760 }}>
      <Table
        caption="Pedidos de novembro"
        columns={columns}
        data={rows}
        selectable
        selectedRows={selected}
        onSelectedRowsChange={setSelected}
        getRowLabel={(row) => `pedido ${row.number}`}
      />
      <ActionBar
        open={selected.length > 0}
        count={selected.length}
        onDismiss={() => setSelected([])}
        portal={portal}
      >
        <Button startIcon={<Icon name="download" />} onClick={() => setSelected([])}>
          Exportar
        </Button>
        <Button
          startIcon={<Icon name="trash" />}
          onClick={() => {
            setRows((current) => current.filter((row) => !selected.includes(row.id)))
            setSelected([])
          }}
        >
          Excluir
        </Button>
      </ActionBar>
    </div>
  )
}

/** Integração com Table: selecione linhas para a barra aparecer. */
export const WithTable: Story = {
  render: () => <OrdersTable portal={false} />,
}

/** Padrão (portal): fixa na viewport, centralizada, respeitando a safe area. */
export const FixedToViewport: Story = {
  render: () => <OrdersTable portal />,
}
