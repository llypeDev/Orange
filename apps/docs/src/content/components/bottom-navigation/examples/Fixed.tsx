import { BottomNavigation, Icon } from '@orange/ui'
import type { ReactNode } from 'react'

// Em produção, use fixed e reserve espaço no fim da página para a barra.
export function MobileLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <main id="main" style={{ paddingBottom: 'calc(56px + env(safe-area-inset-bottom))' }}>
        {children}
      </main>
      <BottomNavigation
        fixed
        defaultValue="inicio"
        items={[
          { value: 'inicio', href: '/', label: 'Início', icon: <Icon name="home" /> },
          { value: 'explorar', href: '/explorar', label: 'Explorar', icon: <Icon name="globe" /> },
          { value: 'salvos', href: '/salvos', label: 'Salvos', icon: <Icon name="heart" /> },
          { value: 'conta', href: '/conta', label: 'Conta', icon: <Icon name="user" /> },
        ]}
      />
    </>
  )
}

export default function Fixed() {
  return (
    <p style={{ margin: 0, color: 'var(--or-color-text-muted)' }}>
      Com <code>fixed</code>, a barra fica presa ao rodapé da janela e respeita a área segura do iPhone.
    </p>
  )
}
