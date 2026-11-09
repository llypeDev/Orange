import {
  Button,
  CodeBlock,
  Form,
  FormActions,
  Picker, Stack,
  TextField,
  type FormErrors,
  type FormValues,
} from '@orangesys/ui'
import { useState } from 'react'

const modelos = [
  {
    value: 'kanban',
    label: 'Kanban',
    icon: 'layout',
    description: 'Colunas por etapa, ideal para fluxo contínuo',
  },
  {
    value: 'sprints',
    label: 'Sprints',
    icon: 'refresh',
    description: 'Ciclos de duas semanas com planejamento e revisão',
  },
  {
    value: 'lista',
    label: 'Lista simples',
    icon: 'list',
    description: 'Tarefas em uma lista única, sem etapas',
  },
]

const regioes = [
  {
    label: 'América do Sul',
    options: [{ value: 'sa-east-1', label: 'São Paulo' }],
  },
  {
    label: 'América do Norte',
    options: [
      { value: 'us-east-1', label: 'Virgínia' },
      { value: 'us-west-2', label: 'Oregon' },
    ],
  },
  {
    label: 'Europa',
    options: [{ value: 'eu-central-1', label: 'Frankfurt' }],
  },
]

function validate(values: FormValues): FormErrors {
  return {
    nome: values.nome ? undefined : 'Dê um nome ao projeto.',
    modelo: values.modelo ? undefined : 'Escolha como a equipe vai organizar as tarefas.',
    regiao: values.regiao ? undefined : 'Escolha onde os dados ficam hospedados.',
  }
}

export default function WithForm() {
  const [enviado, setEnviado] = useState<FormValues | null>(null)

  return (
    <Stack gap={4} style={{ width: '100%', maxWidth: 420 }}>
      <Form aria-label="Novo projeto" validate={validate} onSubmit={setEnviado}>
        {({ errors }) => (
          <>
            <TextField name="nome" label="Nome do projeto" required error={errors.nome} />
            <Picker
              name="modelo"
              label="Modelo de trabalho"
              options={modelos}
              required
              error={errors.modelo}
            />
            <Picker
              name="regiao"
              label="Região dos dados"
              placeholder="Escolha uma região"
              options={regioes}
              required
              error={errors.regiao}
            />
            <FormActions>
              <Button type="submit">Criar projeto</Button>
              <Button type="reset" variant="outline">
                Limpar
              </Button>
            </FormActions>
          </>
        )}
      </Form>
      {enviado && (
        <CodeBlock
          title="Valores enviados"
          language="json"
          code={JSON.stringify(enviado, null, 2)}
        />
      )}
    </Stack>
  )
}
