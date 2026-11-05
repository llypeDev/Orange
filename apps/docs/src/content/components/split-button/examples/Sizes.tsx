import { SplitButton, type SplitButtonAction } from '@orangesys/ui'

const actions: SplitButtonAction[] = [
  { label: 'Duplicar', icon: 'copy', onSelect: () => {} },
  { label: 'Salvar como modelo', icon: 'layers', onSelect: () => {} },
]

export default function Sizes() {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', gap: 16 }}>
      <SplitButton size="lg" actions={actions}>
        Salvar
      </SplitButton>
      <SplitButton size="md" variant="secondary" actions={actions}>
        Salvar
      </SplitButton>
      <SplitButton size="sm" variant="outline" actions={actions}>
        Salvar
      </SplitButton>
    </div>
  )
}
