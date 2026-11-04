import { TableOfContents } from '@orange/ui'
import { useRef } from 'react'

export default function Auto() {
  const articleRef = useRef<HTMLElement>(null)
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 32, width: '100%' }}>
      <article
        ref={articleRef}
        tabIndex={0}
        aria-label="Política de trocas"
        style={{ flex: '1 1 320px', height: 300, overflow: 'auto', paddingRight: 16 }}
      >
        {/* Títulos sem id recebem um gerado a partir do texto. */}
        <h4>Prazo para trocas</h4>
        <p style={{ minHeight: 140, color: 'var(--or-color-text-muted)' }}>Até 30 dias após o recebimento.</p>
        <h4>Produtos com defeito</h4>
        <p style={{ minHeight: 140, color: 'var(--or-color-text-muted)' }}>Coletamos o produto sem custo.</p>
        <h5>Eletrônicos</h5>
        <p style={{ minHeight: 140, color: 'var(--or-color-text-muted)' }}>Garantia do fabricante de 12 meses.</p>
        <h4>Reembolso</h4>
        <p style={{ minHeight: 140, color: 'var(--or-color-text-muted)' }}>Estorno em até 2 faturas.</p>
      </article>
      <TableOfContents
        container={articleRef}
        headingSelector="h4, h5"
        root={articleRef}
        rootMargin="0px 0px -70% 0px"
        title="Neste artigo"
        style={{ flex: '0 0 200px' }}
      />
    </div>
  )
}
