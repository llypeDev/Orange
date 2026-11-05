import { DescriptionList, Heading, Paper } from '@orangesys/ui'

export default function Summary() {
  return (
    <Paper as="section" aria-labelledby="assinatura-titulo" style={{ width: '100%', maxWidth: 440 }}>
      <p className="or-eyebrow" style={{ margin: 0 }}>
        Assinatura
      </p>
      <Heading level={3} size="xl" id="assinatura-titulo" style={{ margin: '6px 0 16px' }}>
        Plano Pro anual
      </Heading>
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
