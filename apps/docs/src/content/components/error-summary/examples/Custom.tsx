import { ErrorSummary } from '@orange/ui'

export default function Custom() {
  return (
    <div style={{ width: '100%', maxWidth: 520 }}>
      <ErrorSummary
        autoFocus={false}
        headingLevel={3}
        title="Não foi possível emitir a nota fiscal"
        description={<p>Corrija os dados abaixo e tente novamente. Nada foi cobrado.</p>}
        errors={[
          { id: 'nf-cnpj', message: 'O CNPJ do destinatário está incompleto.' },
          { id: 'nf-valor', message: 'O valor total precisa ser maior que R$ 0,00.' },
        ]}
      />
    </div>
  )
}
