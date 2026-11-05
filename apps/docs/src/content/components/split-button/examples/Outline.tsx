import { Icon, SplitButton } from '@orangesys/ui'
import { useState } from 'react'

export default function Outline() {
  const [format, setFormat] = useState<string | null>(null)

  return (
    <div style={{ display: 'grid', gap: 12, justifyItems: 'start' }}>
      <SplitButton
        variant="outline"
        startIcon={<Icon name="download" />}
        onClick={() => setFormat('CSV')}
        actions={[
          { label: 'Exportar como XLSX', icon: 'file', onSelect: () => setFormat('XLSX') },
          { label: 'Exportar como PDF', icon: 'file', onSelect: () => setFormat('PDF') },
          { label: 'Enviar por e-mail', icon: 'mail', onSelect: () => setFormat('e-mail') },
        ]}
      >
        Exportar CSV
      </SplitButton>
      <p
        role="status"
        style={{ margin: 0, fontSize: 'var(--or-text-sm)', color: 'var(--or-color-text-muted)' }}
      >
        {format
          ? `Relatório de vendas de outubro exportado (${format}).`
          : 'Nenhuma exportação ainda.'}
      </p>
    </div>
  )
}
