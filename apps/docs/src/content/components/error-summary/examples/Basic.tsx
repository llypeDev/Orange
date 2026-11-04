import { ErrorSummary, TextField } from '@orange/ui'

export default function Basic() {
  return (
    <div style={{ display: 'grid', gap: 24, width: '100%', maxWidth: 520 }}>
      <ErrorSummary
        autoFocus={false}
        errors={[
          { id: 'basico-nome', message: 'Informe seu nome completo.' },
          { id: 'basico-email', message: 'Informe um e-mail no formato nome@empresa.com.' },
        ]}
      />
      <TextField id="basico-nome" label="Nome completo" error="Informe seu nome completo." />
      <TextField id="basico-email" label="E-mail" type="email" defaultValue="ana@" error="Informe um e-mail no formato nome@empresa.com." />
    </div>
  )
}
