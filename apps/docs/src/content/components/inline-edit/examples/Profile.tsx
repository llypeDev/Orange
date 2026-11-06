import { InlineEdit } from '@orangesys/ui'

const campos = [
  { label: 'Nome completo', valor: 'Ana Beatriz Costa' },
  { label: 'Cargo', valor: 'Designer de produto' },
  { label: 'Telefone comercial', valor: '' },
  { label: 'Cidade', valor: 'Recife, PE' },
]

export default function Profile() {
  return (
    <dl style={{ display: 'grid', gap: 4, margin: 0, width: '100%', maxWidth: 560 }}>
      {campos.map((campo) => (
        // Rótulo e valor lado a lado; sem largura para os dois (celular), o valor desce.
        <div
          key={campo.label}
          style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', columnGap: 24 }}
        >
          <dt className="or-eyebrow" style={{ flex: '0 0 144px' }}>
            {campo.label}
          </dt>
          <dd style={{ flex: '1 1 200px', minWidth: 0, margin: 0 }}>
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
