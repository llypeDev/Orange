import { VisuallyHidden } from '@orange/ui'

export default function Focusable() {
  return (
    <div style={{ display: 'grid', gap: 8 }}>
      <p style={{ margin: 0, color: 'var(--or-color-text-muted)' }}>
        Pressione Tab dentro desta prévia para revelar o link.
      </p>
      <VisuallyHidden
        as="a"
        focusable
        href="#conteudo"
        style={{ padding: '8px 12px', background: 'var(--or-color-accent)', color: 'var(--or-color-text-on-accent)' }}
      >
        Pular para o conteúdo
      </VisuallyHidden>
    </div>
  )
}
