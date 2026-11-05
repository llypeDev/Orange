import { SkipLink } from '@orangesys/ui'
import type { ReactNode } from 'react'

// Coloque o SkipLink como o PRIMEIRO elemento focável do layout e dê ao
// <main> o id correspondente.
export function AppLayout({ header, children }: { header: ReactNode; children: ReactNode }) {
  return (
    <>
      <SkipLink />
      {header}
      <main id="main">{children}</main>
    </>
  )
}

export default function AppShell() {
  return (
    <p style={{ margin: 0, color: 'var(--or-color-text-muted)' }}>
      Esta própria documentação usa um link de atalho: recarregue a página e pressione Tab.
    </p>
  )
}
