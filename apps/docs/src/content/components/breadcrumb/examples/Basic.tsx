import { Breadcrumb } from '@orange/ui'

export default function Basic() {
  return (
    <Breadcrumb
      items={[
        { label: 'Início', href: '#inicio' },
        { label: 'Central de ajuda', href: '#ajuda' },
        { label: 'Pedidos', href: '#pedidos' },
        { label: 'Trocas e devoluções' },
      ]}
    />
  )
}
