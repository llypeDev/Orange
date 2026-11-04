import { Button, CopyButton, Icon, SplitButton, Toolbar, ToolbarSeparator } from '@orange/ui'

export default function Actions() {
  return (
    <Toolbar aria-label="Ações da tabela de clientes" bordered={false}>
      {/* Buttons filhos diretos entram no roving tabindex e ficam ghost automaticamente. */}
      <Button startIcon={<Icon name="filter" />}>Filtrar</Button>
      <Button startIcon={<Icon name="arrows-up-down" />}>Ordenar</Button>
      <Button startIcon={<Icon name="layout" />}>Colunas</Button>
      <ToolbarSeparator />
      <CopyButton value="https://app.orange.dev/clientes?visao=ativos" copiedLabel="Link copiado">
        Copiar link da visão
      </CopyButton>
      <SplitButton
        variant="outline"
        startIcon={<Icon name="download" />}
        actions={[
          { label: 'Exportar como XLSX', icon: 'file', onSelect: () => {} },
          { label: 'Exportar como PDF', icon: 'file', onSelect: () => {} },
        ]}
      >
        Exportar CSV
      </SplitButton>
    </Toolbar>
  )
}
