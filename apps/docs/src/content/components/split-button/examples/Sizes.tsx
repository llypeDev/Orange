import { SplitButton, Stack, type SplitButtonAction } from '@orangesys/ui'

const actions: SplitButtonAction[] = [
  { label: 'Duplicar', icon: 'copy', onSelect: () => {} },
  { label: 'Salvar como modelo', icon: 'layers', onSelect: () => {} },
]

export default function Sizes() {
  return (
    <Stack gap={4} direction="horizontal" align="end" wrap>
      <SplitButton size="lg" actions={actions}>
        Salvar
      </SplitButton>
      <SplitButton size="md" variant="secondary" actions={actions}>
        Salvar
      </SplitButton>
      <SplitButton size="sm" variant="outline" actions={actions}>
        Salvar
      </SplitButton>
    </Stack>
  )
}
