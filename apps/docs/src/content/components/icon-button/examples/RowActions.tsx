import { IconButton } from '@orangesys/ui'

const files = [
  { name: 'Contrato de prestação.pdf', size: '284 KB' },
  { name: 'Proposta comercial v3.pdf', size: '1,2 MB' },
  { name: 'Cronograma do projeto.xlsx', size: '96 KB' },
]

export default function RowActions() {
  return (
    <ul style={{ listStyle: 'none', margin: 0, padding: 0, width: '100%', maxWidth: 520 }}>
      {files.map((file) => (
        <li
          key={file.name}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '8px 0 8px 12px',
            borderBottom: '1px solid var(--or-color-border)',
          }}
        >
          <span style={{ flex: 1, minWidth: 0 }}>
            <strong style={{ display: 'block', fontSize: 'var(--or-text-sm)' }}>{file.name}</strong>
            <span style={{ fontSize: 'var(--or-text-xs)', color: 'var(--or-color-text-subtle)' }}>
              {file.size}
            </span>
          </span>
          {/* O rótulo inclui o nome do arquivo: cada botão é único para leitores de tela. */}
          <IconButton icon="download" label={`Baixar ${file.name}`} size="sm" />
          <IconButton icon="edit" label={`Renomear ${file.name}`} size="sm" />
          <IconButton icon="trash" label={`Excluir ${file.name}`} size="sm" />
        </li>
      ))}
    </ul>
  )
}
