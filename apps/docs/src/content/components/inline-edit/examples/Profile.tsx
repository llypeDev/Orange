import { InlineEdit } from '@orangesys/ui'

const campos = [
  { label: 'Nome completo', valor: 'Ana Beatriz Costa' },
  { label: 'Cargo', valor: 'Designer de produto' },
  { label: 'Telefone comercial', valor: '' },
  { label: 'Cidade', valor: 'Recife, PE' },
]

export default function Profile() {
  return (
    <dl
      style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(140px, auto) 1fr',
        alignItems: 'center',
        gap: '4px 24px',
        margin: 0,
        width: '100%',
        maxWidth: 560,
      }}
    >
      {campos.map((campo) => (
        <div key={campo.label} style={{ display: 'contents' }}>
          <dt className="or-eyebrow">{campo.label}</dt>
          <dd style={{ margin: 0 }}>
            <InlineEdit
              label={campo.label}
              defaultValue={campo.valor}
              placeholder="Adicionar"
              size="sm"
            />
          </dd>
        </div>
      ))}
    </dl>
  )
}
