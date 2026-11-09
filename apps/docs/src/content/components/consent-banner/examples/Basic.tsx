import { Button, ConsentBanner, Stack, type ConsentCategory } from '@orangesys/ui'
import { useState } from 'react'

const categories: ConsentCategory[] = [
  {
    id: 'necessarios',
    label: 'Necessários',
    description: 'Mantêm o site funcionando: login, segurança, carrinho e esta escolha.',
    required: true,
  },
  {
    id: 'desempenho',
    label: 'Desempenho e analytics',
    description: 'Contam visitas e medem o carregamento das páginas, em dados agregados.',
  },
  {
    id: 'funcionalidade',
    label: 'Funcionalidade',
    description: 'Lembram a região de entrega e os produtos vistos recentemente.',
  },
  {
    id: 'publicidade',
    label: 'Publicidade',
    description: 'Permitem que parceiros mostrem anúncios de acordo com os seus interesses.',
  },
]

const sourceLabels = {
  'accept-all': 'Aceitou todos',
  reject: 'Rejeitou os opcionais',
  custom: 'Personalizou',
}

export default function Basic() {
  const [open, setOpen] = useState(true)
  const [result, setResult] = useState('')

  return (
    <Stack gap={3} style={{ width: '100%' }}>
      <ConsentBanner
        placement="inline"
        open={open}
        onOpenChange={setOpen}
        categories={categories}
        policyHref="#politica-de-cookies"
        onDecision={(consent, source) => {
          const accepted = categories.filter((category) => consent[category.id])
          setResult(`${sourceLabels[source]}: ${accepted.map((c) => c.label).join(', ')}.`)
        }}
      />
      {!open && (
        <Stack gap={3} direction="horizontal" align="center" wrap>
          <span>{result}</span>
          <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
            Mostrar de novo
          </Button>
        </Stack>
      )}
    </Stack>
  )
}
