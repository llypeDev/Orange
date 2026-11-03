import { Breadcrumb, BreadcrumbItem, Icon } from '@orange/ui'

export default function Separator() {
  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <Breadcrumb separator={<Icon name="chevron-right" />} aria-label="Trilha do projeto">
        <BreadcrumbItem href="#workspace" icon={<Icon name="layers" />}>
          Orange Labs
        </BreadcrumbItem>
        <BreadcrumbItem href="#projetos">Projetos</BreadcrumbItem>
        <BreadcrumbItem href="#checkout">Checkout 2.0</BreadcrumbItem>
        <BreadcrumbItem>Configurações</BreadcrumbItem>
      </Breadcrumb>
      <Breadcrumb separator="→" aria-label="Trilha do arquivo">
        <BreadcrumbItem href="#drive" icon={<Icon name="folder" />}>
          Meu drive
        </BreadcrumbItem>
        <BreadcrumbItem href="#financeiro">Financeiro</BreadcrumbItem>
        <BreadcrumbItem>Notas fiscais 2026</BreadcrumbItem>
      </Breadcrumb>
    </div>
  )
}
