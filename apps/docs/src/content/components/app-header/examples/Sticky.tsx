import { AppHeader, Button } from '@orangesys/ui'

export default function Sticky() {
  return (
    <div
      tabIndex={0}
      role="region"
      aria-label="Prévia com rolagem"
      style={{ width: '100%', height: 300, overflow: 'auto', border: '1px solid var(--or-color-border)' }}
    >
      <AppHeader
        sticky
        collapseBelow="sm"
        navLabel="Navegação da documentação"
        brand={<a href="#docs">Orange Docs</a>}
        items={[
          { label: 'Guias', href: '#guias' },
          { label: 'API', href: '#api' },
          { label: 'Changelog', href: '#changelog' },
        ]}
        currentHref="#guias"
        actions={<Button size="sm">Começar</Button>}
      />
      <div style={{ padding: 24, display: 'grid', gap: 16 }}>
        {Array.from({ length: 8 }, (_, i) => (
          <p key={i} style={{ margin: 0, color: 'var(--or-color-text-muted)' }}>
            Role esta área: com sticky, o cabeçalho continua visível no topo enquanto o conteúdo passa por baixo.
          </p>
        ))}
      </div>
    </div>
  )
}
