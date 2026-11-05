import { InlineEdit } from '@orangesys/ui'

export default function WithButtons() {
  return (
    <InlineEdit
      label="E-mail de cobrança"
      showLabel
      showButtons
      saveOnBlur={false}
      defaultValue="financeiro@orange.dev"
      inputProps={{ type: 'email', autoComplete: 'email' }}
      validate={(valor) =>
        /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(valor)
          ? null
          : 'Informe um e-mail no formato nome@empresa.com.'
      }
    />
  )
}
