import { AppHeader, Button, Icon } from '@orange/ui'
import type { ReactNode } from 'react'

// No layout raiz: o cabeçalho sobe ao rolar para baixo (depois de 120px) e
// volta ao rolar para cima. Com foco dentro dele ou com o menu aberto, fica.
export function AppLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <AppHeader
        hideOnScroll
        brand={<a href="/">Orange</a>}
        items={[
          { label: 'Produto', href: '/produto' },
          { label: 'Preços', href: '/precos' },
          { label: 'Blog', href: '/blog' },
        ]}
        currentHref="/blog"
        actions={<Button size="sm" endIcon={<Icon name="arrow-right" />}>Teste grátis</Button>}
      />
      <main id="main">{children}</main>
    </>
  )
}

export default function HideOnScroll() {
  return (
    <p style={{ margin: 0, color: 'var(--or-color-text-muted)' }}>
      hideOnScroll observa a rolagem da janela, por isso o efeito aparece no layout real (veja a story “Hide On Scroll” no
      Storybook).
    </p>
  )
}
