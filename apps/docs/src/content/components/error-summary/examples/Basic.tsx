import { ErrorSummary, Stack, TextField } from '@orangesys/ui'

export default function Basic() {
  return (
    <Stack gap={6} style={{ width: '100%', maxWidth: 520 }}>
      <ErrorSummary
        autoFocus={false}
        errors={[
          { id: 'basico-nome', message: 'Informe seu nome completo.' },
          { id: 'basico-email', message: 'Informe um e-mail no formato nome@empresa.com.' },
        ]}
      />
      <TextField id="basico-nome" label="Nome completo" error="Informe seu nome completo." />
      <TextField id="basico-email" label="E-mail" type="email" defaultValue="ana@" error="Informe um e-mail no formato nome@empresa.com." />
    </Stack>
  )
}
