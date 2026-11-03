import { Button, Toast } from '@orange/ui'

export default function Visual() {
  return (
    <div style={{ display: 'grid', gap: 12, width: '100%', maxWidth: 416 }}>
      <Toast title="Link copiado" onClose={() => {}} />
      <Toast
        tone="success"
        title="Pedido enviado"
        description="O cliente receberá o código de rastreio por e-mail."
        onClose={() => {}}
      />
      <Toast
        tone="danger"
        title="Falha ao salvar"
        description="Verifique sua conexão e tente novamente."
        onClose={() => {}}
      />
      <Toast
        title="3 conversas arquivadas"
        action={
          <Button size="sm" variant="outline">
            Desfazer
          </Button>
        }
        onClose={() => {}}
      />
    </div>
  )
}
