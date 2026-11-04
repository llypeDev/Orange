import { Button, Icon, IconButton } from '@orange/ui'

export default function Comparison() {
  return (
    <>
      {/* IconButton: label obrigatório no tipo, ícone por nome, ghost por padrão. */}
      <IconButton icon="close" label="Fechar painel" />

      {/* Equivalente com Button: aria-label não é exigido pelo TypeScript. */}
      <Button
        variant="ghost"
        iconOnly
        aria-label="Fechar painel"
        startIcon={<Icon name="close" />}
      />
    </>
  )
}
