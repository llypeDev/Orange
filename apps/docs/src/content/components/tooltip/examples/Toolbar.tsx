import { Button, Icon, Stack, Tooltip, type IconName } from '@orangesys/ui'

const acoes: { icon: IconName; label: string; dica: string }[] = [
  { icon: 'edit', label: 'Editar', dica: 'Editar documento' },
  { icon: 'copy', label: 'Duplicar', dica: 'Duplicar documento' },
  { icon: 'download', label: 'Baixar', dica: 'Baixar como PDF' },
  { icon: 'trash', label: 'Excluir', dica: 'Mover para a lixeira' },
]

export default function Toolbar() {
  return (
    <Stack role="toolbar" aria-label="Ações do documento" gap={1} direction="horizontal">
      {acoes.map(({ icon, label, dica }) => (
        <Tooltip key={icon} content={dica}>
          <Button variant="ghost" iconOnly aria-label={label} startIcon={<Icon name={icon} />} />
        </Tooltip>
      ))}
    </Stack>
  )
}
