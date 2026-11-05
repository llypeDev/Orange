import { Icon, TreeView, type TreeViewItem } from '@orangesys/ui'

const categorias: TreeViewItem[] = [
  {
    id: 'eletronicos',
    label: 'Eletrônicos',
    icon: <Icon name="zap" size="sm" />,
    children: [
      { id: 'notebooks', label: 'Notebooks', icon: <Icon name="layout" size="sm" /> },
      { id: 'monitores', label: 'Monitores', icon: <Icon name="image" size="sm" /> },
      { id: 'teclados', label: 'Teclados', icon: <Icon name="keyboard" size="sm" /> },
    ],
  },
  {
    id: 'escritorio',
    label: 'Escritório',
    icon: <Icon name="inbox" size="sm" />,
    children: [{ id: 'cadeiras', label: 'Cadeiras', icon: <Icon name="user" size="sm" /> }],
  },
  { id: 'livros', label: 'Livros', icon: <Icon name="book" size="sm" /> },
]

export default function CustomIcons() {
  return (
    <div style={{ width: '100%', maxWidth: 280 }}>
      <TreeView
        aria-label="Categorias"
        items={categorias}
        size="sm"
        defaultExpanded={['eletronicos']}
        defaultSelected={['teclados']}
      />
    </div>
  )
}
