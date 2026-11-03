import type { Meta, StoryObj } from '@storybook/react-vite'
import { Icon } from '../../icons'
import { TreeView, type TreeViewItem } from './TreeView'

const files: TreeViewItem[] = [
  {
    id: 'src',
    label: 'src',
    children: [
      {
        id: 'components',
        label: 'components',
        children: [
          { id: 'button', label: 'Button.tsx' },
          { id: 'card', label: 'Card.tsx' },
          { id: 'modal', label: 'Modal.tsx' },
        ],
      },
      { id: 'hooks', label: 'hooks', children: [{ id: 'use-id', label: 'useId.ts' }] },
      { id: 'index', label: 'index.ts' },
    ],
  },
  {
    id: 'docs',
    label: 'docs',
    children: [
      { id: 'inicio', label: 'Guia de início.md' },
      { id: 'tokens', label: 'Tokens.md' },
    ],
  },
  { id: 'readme', label: 'README.md' },
  { id: 'license', label: 'LICENSE', disabled: true },
]

const meta = {
  title: 'Componentes/TreeView',
  component: TreeView,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Árvore hierárquica no padrão "tree view" do WAI-ARIA: setas navegam, → expande, ← recolhe, `*` expande irmãos, digitação busca itens. Seleção única ou múltipla.',
      },
    },
  },
  argTypes: {
    selectionMode: { control: 'inline-radio', options: ['single', 'multiple', 'none'] },
    size: { control: 'inline-radio', options: ['sm', 'md'] },
    expandOnClick: { control: 'boolean' },
    defaultIcons: { control: 'boolean' },
    onSelectedChange: { action: 'selectedChange' },
    onExpandedChange: { action: 'expandedChange' },
    onAction: { action: 'action' },
  },
  args: {
    'aria-label': 'Arquivos do projeto',
    items: files,
    defaultExpanded: ['src', 'components'],
    defaultSelected: ['card'],
    selectionMode: 'single',
    size: 'md',
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 320 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof TreeView>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const MultipleSelection: Story = {
  args: { selectionMode: 'multiple', defaultSelected: ['button', 'modal'] },
}

export const NavigationOnly: Story = {
  args: { selectionMode: 'none', defaultSelected: [], expandOnClick: true },
}

export const CustomIcons: Story = {
  args: {
    'aria-label': 'Categorias',
    defaultExpanded: ['eletronicos'],
    defaultSelected: [],
    size: 'sm',
    items: [
      {
        id: 'eletronicos',
        label: 'Eletrônicos',
        icon: <Icon name="zap" size="sm" />,
        children: [
          { id: 'notebooks', label: 'Notebooks', icon: <Icon name="layout" size="sm" /> },
          { id: 'fones', label: 'Fones de ouvido', icon: <Icon name="heart" size="sm" /> },
        ],
      },
      { id: 'casa', label: 'Casa e cozinha', icon: <Icon name="home" size="sm" />, children: [] },
      { id: 'livros', label: 'Livros', icon: <Icon name="book" size="sm" /> },
    ],
  },
}
