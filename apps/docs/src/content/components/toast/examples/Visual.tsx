import { Button, Stack, Toast } from '@orangesys/ui'

export default function Visual() {
  return (
    <Stack gap={3} style={{ width: '100%', maxWidth: 416 }}>
      <Toast title="Link copiado" onDismiss={() => {}} />
      <Toast
        tone="success"
        title="Pedido enviado"
        description="O cliente receberá o código de rastreio por e-mail."
        onDismiss={() => {}}
      />
      <Toast
        tone="danger"
        title="Falha ao salvar"
        description="Verifique sua conexão e tente novamente."
        onDismiss={() => {}}
      />
      <Toast
        title="3 conversas arquivadas"
        action={
          <Button size="sm" variant="outline">
            Desfazer
          </Button>
        }
        onDismiss={() => {}}
      />
    </Stack>
  )
}
