import {
  Button,
  Fieldset,
  Form,
  FormActions,
  RadioGroup,
  Select,
  TextField,
  useToast,
  type FormErrors,
  type FormValues,
} from '@orange/ui'

const text = (value: FormValues[string]) => String(value ?? '').trim()

const estados = [
  { value: 'BA', label: 'Bahia' },
  { value: 'MG', label: 'Minas Gerais' },
  { value: 'PE', label: 'Pernambuco' },
  { value: 'PR', label: 'Paraná' },
  { value: 'RJ', label: 'Rio de Janeiro' },
  { value: 'RS', label: 'Rio Grande do Sul' },
  { value: 'SP', label: 'São Paulo' },
]

function validate(values: FormValues): FormErrors {
  const cep = text(values.cep)
  return {
    cep: !cep ? 'Informe o CEP.' : /^\d{5}-?\d{3}$/.test(cep) ? undefined : 'O CEP tem 8 números, como 00000-000.',
    rua: text(values.rua) ? undefined : 'Informe a rua ou avenida.',
    numero: text(values.numero) ? undefined : 'Informe o número (ou "s/n").',
    cidade: text(values.cidade) ? undefined : 'Informe a cidade.',
    estado: values.estado ? undefined : 'Escolha o estado.',
    janela: values.janela ? undefined : 'Escolha um período para a entrega.',
  }
}

export default function Delivery() {
  const { toast } = useToast()

  return (
    <Form
      aria-label="Endereço de entrega"
      validate={validate}
      onSubmit={() => {
        toast({ title: 'Endereço confirmado', tone: 'success' })
      }}
      style={{ width: '100%', maxWidth: 560 }}
    >
      {({ errors }) => (
        <>
          <Fieldset legend="Endereço de entrega" description="Enviaremos o pedido para este endereço.">
            <TextField
              name="cep"
              label="CEP"
              inputMode="numeric"
              autoComplete="postal-code"
              style={{ maxWidth: 200 }}
              error={errors.cep}
            />
            <TextField name="rua" label="Rua" autoComplete="address-line1" error={errors.rua} />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 16 }}>
              <TextField name="numero" label="Número" error={errors.numero} />
              <TextField name="complemento" label="Complemento" optional autoComplete="address-line2" />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16 }}>
              <TextField name="cidade" label="Cidade" autoComplete="address-level2" error={errors.cidade} />
              <Select
                name="estado"
                label="Estado"
                placeholder="Selecione"
                autoComplete="address-level1"
                options={estados}
                error={errors.estado}
              />
            </div>
          </Fieldset>
          <RadioGroup
            name="janela"
            label="Período de entrega"
            orientation="horizontal"
            error={errors.janela}
            options={[
              { value: 'manha', label: 'Manhã (8h–12h)' },
              { value: 'tarde', label: 'Tarde (13h–18h)' },
            ]}
          />
          <FormActions align="between">
            <Button type="button" variant="outline">
              Voltar ao carrinho
            </Button>
            <Button type="submit">Continuar para o pagamento</Button>
          </FormActions>
        </>
      )}
    </Form>
  )
}
