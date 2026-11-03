import { Button, useToast } from '@orange/ui'

// O ToastProvider fica uma vez na raiz da aplicação (veja "Configuração").
export default function Basic() {
  const { toast } = useToast()

  return (
    <>
      <Button onClick={() => toast({ title: 'Alterações salvas', tone: 'success' })}>Salvar</Button>
      <Button
        variant="outline"
        onClick={() =>
          toast({ title: 'Link copiado', description: 'Cole onde quiser compartilhar.' })
        }
      >
        Copiar link
      </Button>
      <Button
        variant="outline"
        onClick={() =>
          toast({
            title: 'Não foi possível enviar',
            description: 'O arquivo excede o limite de 25 MB.',
            tone: 'danger',
          })
        }
      >
        Enviar anexo
      </Button>
    </>
  )
}
