import {
  Icon,
  IconButton,
  ToggleButton,
  ToggleButtonGroup,
  Toolbar,
  ToolbarSeparator,
} from '@orange/ui'

export default function Vertical() {
  return (
    <Toolbar aria-label="Ferramentas do quadro" orientation="vertical">
      <ToggleButtonGroup type="single" aria-label="Ferramenta ativa" defaultValue="select">
        <ToggleButton
          value="select"
          iconOnly
          aria-label="Selecionar"
          startIcon={<Icon name="arrow-up-right" />}
        />
        <ToggleButton value="text" iconOnly aria-label="Texto" startIcon={<Icon name="type" />} />
        <ToggleButton
          value="shape"
          iconOnly
          aria-label="Retângulo"
          startIcon={<Icon name="square" />}
        />
        <ToggleButton
          value="note"
          iconOnly
          aria-label="Nota adesiva"
          startIcon={<Icon name="file" />}
        />
      </ToggleButtonGroup>
      <ToolbarSeparator />
      <IconButton icon="image" label="Inserir imagem" />
      <IconButton icon="trash" label="Excluir seleção" />
    </Toolbar>
  )
}
