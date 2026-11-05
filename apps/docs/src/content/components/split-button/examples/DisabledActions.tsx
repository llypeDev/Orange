import { SplitButton } from '@orangesys/ui'
import { useState } from 'react'

export default function DisabledActions() {
  const [merged, setMerged] = useState<string | null>(null)

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 16 }}>
      <SplitButton
        placement="bottom-start"
        onClick={() => setMerged('merge commit')}
        actions={[
          { label: 'Squash e mesclar', icon: 'layers', onSelect: () => setMerged('squash') },
          // Desabilitado pela política do repositório: continua visível e focável.
          {
            label: 'Rebase e mesclar',
            icon: 'refresh',
            onSelect: () => setMerged('rebase'),
            disabled: true,
          },
        ]}
      >
        Mesclar pull request
      </SplitButton>
      <SplitButton disabled actions={[{ label: 'Implantar em homologação', onSelect: () => {} }]}>
        Implantar
      </SplitButton>
      {merged && (
        <span
          role="status"
          style={{ fontSize: 'var(--or-text-sm)', color: 'var(--or-color-success-text)' }}
        >
          Mesclado com {merged}.
        </span>
      )}
    </div>
  )
}
