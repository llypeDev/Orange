import { Button, Icon, Tooltip, type IconName } from '@orangesys/ui'

const acoes: { icon: IconName; label: string; dica: string }[] = [
  { icon: 'edit', label: 'Editar', dica: 'Editar documento' },
  { icon: 'copy', label: 'Duplicar', dica: 'Duplicar documento' },
  { icon: 'download', label: 'Baixar', dica: 'Baixar como PDF' },
  { icon: 'trash', label: 'Excluir', dica: 'Mover para a lixeira' },
]

export default function Toolbar() {
  return (
    <div role="toolbar" aria-label="Ações do documento" style={{ display: 'flex', gap: 4 }}>
      {acoes.map(({ icon, label, dica }) => (
        <Tooltip key={icon} content={dica}>
          <Button variant="ghost" iconOnly aria-label={label} startIcon={<Icon name={icon} />} />
        </Tooltip>
      ))}
    </div>
  )
}
