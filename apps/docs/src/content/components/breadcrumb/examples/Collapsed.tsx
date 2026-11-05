import { Breadcrumb, Icon } from '@orangesys/ui'

const path = [
  { label: 'Início', href: '#inicio', icon: <Icon name="home" /> },
  { label: 'Loja', href: '#loja' },
  { label: 'Eletrônicos', href: '#eletronicos' },
  { label: 'Notebooks', href: '#notebooks' },
  { label: 'Ultrafinos', href: '#ultrafinos' },
  { label: 'Orange Book Air 14" — 16 GB' },
]

export default function Collapsed() {
  return (
    <Breadcrumb
      aria-label="Trilha do produto"
      items={path}
      maxItems={4}
      itemsBeforeCollapse={1}
      itemsAfterCollapse={2}
    />
  )
}
