import { Button, DateTimePicker, Form, FormActions, Text } from '@orangesys/ui'
import { useState } from 'react'

export default function FormSubmit() {
  const [enviado, setEnviado] = useState<string | null>(null)

  return (
    <Form
      aria-label="Agendar manutenção"
      validate={(values) => ({
        inicio: values.inicio ? undefined : 'Informe a data e a hora de início da manutenção.',
      })}
      onSubmit={(values) => setEnviado(String(values.inicio))}
      style={{ width: '100%', maxWidth: 520 }}
    >
      {({ errors }) => (
        <>
          <DateTimePicker
            name="inicio"
            label="Início da manutenção"
            description="O sistema de pedidos fica fora do ar por até 2 horas."
            required
            error={errors.inicio}
          />
          <FormActions>
            <Button type="submit">Agendar manutenção</Button>
          </FormActions>
          {enviado && (
            <Text size="sm" tone="muted" aria-live="polite">
              Enviado no FormData: inicio = {enviado}
            </Text>
          )}
        </>
      )}
    </Form>
  )
}
