import { Button, useToast } from '@orangesys/ui'

export default function Update() {
  const { toast } = useToast()

  const exportReport = () => {
    const id = toast({
      title: 'Gerando relatório…',
      description: 'Vendas de outubro, 1.284 linhas.',
      duration: Infinity,
      dismissible: false,
    })
    // mesmo id: o toast é atualizado (e anunciado de novo) em vez de empilhar
    setTimeout(() => {
      toast({
        id,
        title: 'Relatório pronto',
        description: 'vendas-outubro.xlsx foi baixado.',
        tone: 'success',
      })
    }, 2000)
  }

  return <Button onClick={exportReport}>Exportar relatório</Button>
}
