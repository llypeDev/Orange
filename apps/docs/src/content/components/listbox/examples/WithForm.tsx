import {
  Button,
  CodeBlock,
  Form,
  FormActions,
  Listbox,
  ListboxOption,
  type FormErrors,
  type FormValues,
} from '@orange/ui'
import { useState } from 'react'

function validate(values: FormValues): FormErrors {
  return {
    entrega: values.entrega ? undefined : 'Escolha como quer receber o pedido.',
  }
}

export default function WithForm() {
  const [enviado, setEnviado] = useState<FormValues | null>(null)

  return (
    <div style={{ display: 'grid', gap: 16, width: '100%', maxWidth: 460 }}>
      <Form aria-label="Preferências de entrega" validate={validate} onSubmit={setEnviado}>
        {({ errors }) => (
          <>
            <Listbox name="entrega" label="Tipo de entrega" required error={errors.entrega}>
              <ListboxOption value="economica" description="5 a 8 dias úteis · grátis acima de R$ 150">
                Econômica
              </ListboxOption>
              <ListboxOption value="expressa" description="1 a 2 dias úteis · R$ 24,90">
                Expressa
              </ListboxOption>
              <ListboxOption value="retirada" description="Pronto em 2 horas numa loja parceira · grátis">
                Retirar na loja
              </ListboxOption>
            </Listbox>
            <Listbox
              name="avisos"
              label="Avisos do pedido"
              optional
              selectionMode="multiple"
              defaultValue={['email', 'app']}
            >
              <ListboxOption value="email">E-mail</ListboxOption>
              <ListboxOption value="app">Notificação no aplicativo</ListboxOption>
              <ListboxOption value="sms">SMS</ListboxOption>
            </Listbox>
            <FormActions>
              <Button type="submit">Salvar preferências</Button>
            </FormActions>
          </>
        )}
      </Form>
      {enviado && <CodeBlock title="Valores enviados" language="json" code={JSON.stringify(enviado, null, 2)} />}
    </div>
  )
}
