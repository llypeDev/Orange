import { HoverCard } from '@orange/ui'

export default function LinkPreview() {
  return (
    <p style={{ margin: 0, maxWidth: 560 }}>
      Antes de publicar, confira o guia{' '}
      <HoverCard
        arrow
        placement="top"
        openDelay={400}
        trigger={<a href="#guia-acessibilidade">Acessibilidade em formulários</a>}
      >
        <div style={{ display: 'grid', gap: 6 }}>
          <span className="or-eyebrow">Guia · 6 min de leitura</span>
          <strong style={{ fontFamily: 'var(--or-font-display)', fontSize: 16, lineHeight: 1.25 }}>
            Acessibilidade em formulários
          </strong>
          <span style={{ color: 'var(--or-color-text-muted)' }}>
            Rótulos, mensagens de erro e ordem de foco: o checklist que usamos em todo formulário do
            produto.
          </span>
        </div>
      </HoverCard>{' '}
      e o checklist de revisão.
    </p>
  )
}
