import { Button, EmptyState } from '@orange/ui'
import { useState } from 'react'

export default function NoResults() {
  const [query, setQuery] = useState('boleto vencido março')

  if (!query) {
    return (
      <p style={{ margin: 0, color: 'var(--or-color-text-muted)' }}>Busca limpa — 248 faturas.</p>
    )
  }

  return (
    <EmptyState
      icon="search"
      headingLevel={4}
      title={`Nenhum resultado para “${query}”`}
      description="Confira a grafia ou use termos mais gerais, como o nome do cliente ou o número da fatura."
      action={
        <Button variant="outline" onClick={() => setQuery('')}>
          Limpar busca
        </Button>
      }
    />
  )
}
