import { Button, NavigationMenu, Stack, Text } from '@orangesys/ui'
import { useState } from 'react'

export default function Controlled() {
  const [openItem, setOpenItem] = useState<string | null>(null)
  return (
    <Stack gap={4}>
      <Stack direction="horizontal" gap={3} align="center" wrap>
        <Button size="sm" variant="outline" onClick={() => setOpenItem('ajuda')}>
          Abrir “Ajuda”
        </Button>
        <Text size="sm" tone="muted">
          Painel aberto: {openItem ?? 'nenhum'}
        </Text>
      </Stack>
      <NavigationMenu
        aria-label="Navegação da central de ajuda"
        openItem={openItem}
        onOpenItemChange={setOpenItem}
        items={[
          {
            id: 'ajuda',
            label: 'Ajuda',
            items: [
              { label: 'Primeiros passos', href: '/ajuda/primeiros-passos' },
              { label: 'Pagamentos e repasses', href: '/ajuda/pagamentos' },
              { label: 'Falar com o suporte', href: '/ajuda/suporte' },
            ],
          },
          {
            id: 'comunidade',
            label: 'Comunidade',
            items: [
              { label: 'Fórum', href: '/comunidade/forum' },
              { label: 'Eventos', href: '/comunidade/eventos' },
            ],
          },
        ]}
      />
    </Stack>
  )
}
