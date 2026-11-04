import { Alert, Button } from '@orange/ui'

export default function WithActions() {
  return (
    <div style={{ width: '100%' }}>
      <Alert
        tone="warning"
        title="Seu plano vence em 3 dias"
        action={
          <>
            <Button size="sm">Atualizar pagamento</Button>
            <Button size="sm" variant="ghost">
              Lembrar amanhã
            </Button>
          </>
        }
      >
        Atualize o cartão de crédito para manter os 12 usuários do workspace ativos.
      </Alert>
    </div>
  )
}
