import { Button, useToast } from '@orangesys/ui'

export default function Progress() {
  const { toast } = useToast()

  return (
    <Button
      variant="outline"
      onClick={() =>
        toast({
          title: 'Rascunho salvo',
          description: 'Proposta comercial — Café Central.',
          tone: 'success',
          duration: 6000,
          // barra de tempo restante só neste toast (ou showProgress no provider para todos)
          showProgress: true,
        })
      }
    >
      Salvar rascunho
    </Button>
  )
}
