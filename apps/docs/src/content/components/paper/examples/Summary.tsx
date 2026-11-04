import { DescriptionList, Paper } from '@orange/ui'

export default function Summary() {
  return (
    <Paper as="section" aria-labelledby="assinatura-titulo" style={{ width: '100%', maxWidth: 440 }}>
      <p className="or-eyebrow" style={{ margin: 0 }}>
        Assinatura
      </p>
      <h3 id="assinatura-titulo" style={{ margin: '6px 0 16px', fontSize: 22 }}>
        Plano Pro anual
      </h3>
      <DescriptionList
        size="sm"
        termWidth="9rem"
        items={[
          { term: 'Usuários', description: '24 de 30 licenças' },
          { term: 'Renovação', description: '12 de março de 2027' },
          { term: 'Armazenamento', description: '412 GB de 1 TB' },
        ]}
      />
    </Paper>
  )
}
