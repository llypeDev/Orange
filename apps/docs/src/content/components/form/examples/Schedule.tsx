import {
  Button,
  DatePicker,
  Form,
  FormActions,
  Select,
  TextArea,
  useForm,
  useToast,
  type FormErrors,
  type FormValues,
} from '@orangesys/ui'

const today = new Date()
const isWeekend = (date: Date) => date.getDay() === 0 || date.getDay() === 6

function validate(values: FormValues): FormErrors {
  return {
    produto: values.produto ? undefined : 'Escolha o produto da demonstração.',
    data: values.data ? undefined : 'Escolha uma data em dia útil.',
  }
}

/** Campos em um componente próprio: os erros chegam por useForm(). */
function DemoFields() {
  const { getError } = useForm()
  return (
    <>
      <Select
        name="produto"
        label="Produto"
        placeholder="Selecione um produto"
        error={getError('produto')}
        options={[
          { value: 'financeiro', label: 'Gestão financeira' },
          { value: 'estoque', label: 'Controle de estoque' },
          { value: 'fiscal', label: 'Emissão de notas fiscais' },
        ]}
      />
      <DatePicker
        name="data"
        label="Data da demonstração"
        description="De segunda a sexta."
        min={today}
        isDateDisabled={isWeekend}
        error={getError('data')}
      />
      <TextArea name="observacoes" label="O que você quer ver?" optional rows={3} />
    </>
  )
}

// O ToastProvider fica uma vez na raiz da aplicação.
export default function Schedule() {
  const { toast } = useToast()
  const formatDate = (iso: string) => new Date(`${iso}T12:00:00`).toLocaleDateString('pt-BR')

  return (
    <Form
      aria-label="Agendar demonstração"
      validate={validate}
      onSubmit={(values) => {
        toast({
          title: 'Demonstração agendada',
          description: `Dia ${formatDate(String(values.data))}. O convite chega no seu e-mail.`,
          tone: 'success',
        })
      }}
      style={{ width: '100%', maxWidth: 520 }}
    >
      <DemoFields />
      <FormActions>
        <Button type="submit">Agendar demonstração</Button>
      </FormActions>
    </Form>
  )
}
