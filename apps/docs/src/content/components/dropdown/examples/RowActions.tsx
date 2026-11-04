import { Button, Dropdown, DropdownItem, DropdownSeparator, Icon } from '@orange/ui'

const arquivos = [
  { nome: 'proposta-comercial.pdf', detalhe: '2,4 MB · editado hoje' },
  { nome: 'cronograma-q2.xlsx', detalhe: '880 KB · editado ontem' },
]

export default function RowActions() {
  return (
    <ul style={{ listStyle: 'none', margin: 0, padding: 0, width: '100%', maxWidth: 480 }}>
      {arquivos.map((arquivo) => (
        <li
          key={arquivo.nome}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            padding: '8px 8px 8px 12px',
            borderBottom: '1px solid var(--or-color-border)',
          }}
        >
          <Icon name="file" />
          <span style={{ flex: 1, display: 'grid' }}>
            <span>{arquivo.nome}</span>
            <span style={{ fontSize: 12, color: 'var(--or-color-text-subtle)' }}>
              {arquivo.detalhe}
            </span>
          </span>
          <Dropdown
            placement="bottom-end"
            trigger={
              <Button
                variant="ghost"
                size="sm"
                iconOnly
                aria-label={`Ações de ${arquivo.nome}`}
                startIcon={<Icon name="more-horizontal" />}
              />
            }
          >
            <DropdownItem icon="external-link">Abrir</DropdownItem>
            <DropdownItem icon="download">Baixar</DropdownItem>
            <DropdownItem icon="link">Copiar link</DropdownItem>
            <DropdownSeparator />
            <DropdownItem icon="trash" tone="danger">
              Excluir
            </DropdownItem>
          </Dropdown>
        </li>
      ))}
    </ul>
  )
}
