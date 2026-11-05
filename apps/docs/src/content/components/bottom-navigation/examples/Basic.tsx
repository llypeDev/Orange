import { BottomNavigation, Icon } from '@orangesys/ui'
import { useState } from 'react'

const titles: Record<string, string> = {
  inicio: 'Restaurantes perto de você',
  buscar: 'Buscar pratos e lojas',
  pedidos: 'Seus pedidos',
  conta: 'Minha conta',
}

export default function Basic() {
  const [tab, setTab] = useState('inicio')
  return (
    <div style={{ width: 360, maxWidth: '100%', border: '1px solid var(--or-color-border-strong)', background: 'var(--or-color-surface)' }}>
      <div style={{ height: 220, padding: 16 }}>
        <strong>{titles[tab]}</strong>
      </div>
      <BottomNavigation
        aria-label="Navegação do app"
        value={tab}
        onChange={setTab}
        items={[
          { value: 'inicio', label: 'Início', icon: <Icon name="home" /> },
          { value: 'buscar', label: 'Buscar', icon: <Icon name="search" /> },
          { value: 'pedidos', label: 'Pedidos', icon: <Icon name="inbox" /> },
          { value: 'conta', label: 'Conta', icon: <Icon name="user" /> },
        ]}
      />
    </div>
  )
}
