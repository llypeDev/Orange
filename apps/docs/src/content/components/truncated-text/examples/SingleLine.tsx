import { TruncatedText } from '@orangesys/ui'

const arquivos = [
  'Proposta comercial — Implantação do módulo de conciliação para as filiais do interior.pdf',
  'Contrato de prestação de serviços 2026.pdf',
  'Planilha de custos consolidada do terceiro trimestre com projeções revisadas.xlsx',
]

export default function SingleLine() {
  return (
    <ul style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr)', gap: 8, margin: 0, padding: 0, listStyle: 'none', width: 280, maxWidth: '100%' }}>
      {arquivos.map((nome) => (
        <li key={nome} style={{ padding: '8px 12px', border: '1px solid var(--or-color-border)' }}>
          <TruncatedText showTitle>{nome}</TruncatedText>
        </li>
      ))}
    </ul>
  )
}
