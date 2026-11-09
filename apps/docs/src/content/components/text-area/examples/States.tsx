import { Stack, TextArea } from '@orangesys/ui'

export default function States() {
  return (
    <Stack gap={5} style={{ width: '100%', maxWidth: 480 }}>
      <TextArea label="Motivo do cancelamento" required error="Conte o motivo para continuarmos com o cancelamento." />
      <TextArea label="Termos do contrato" readOnly rows={2} defaultValue="Vigência de 12 meses a partir da assinatura, renovável automaticamente." />
      <TextArea label="Comentário do revisor" disabled rows={2} defaultValue="Edição bloqueada durante a revisão." />
    </Stack>
  )
}
