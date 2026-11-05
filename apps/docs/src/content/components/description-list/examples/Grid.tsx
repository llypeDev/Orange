import { DescriptionList } from '@orangesys/ui'

export default function Grid() {
  return (
    <DescriptionList
      layout="grid"
      columns={3}
      aria-label="Indicadores do suporte em outubro"
      style={{ width: '100%' }}
      items={[
        { term: 'Chamados abertos', description: '1.284' },
        { term: 'Tempo de 1ª resposta', description: '1h 12min' },
        { term: 'Satisfação', description: '94%' },
        { term: 'Resolvidos no 1º contato', description: '71%' },
        { term: 'Reabertos', description: '3,2%' },
        { term: 'Fila atual', description: '18 chamados' },
      ]}
    />
  )
}
