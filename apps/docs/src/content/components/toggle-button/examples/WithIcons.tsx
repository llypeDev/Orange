import { Icon, ToggleButton } from '@orange/ui'

export default function WithIcons() {
  return (
    <>
      <ToggleButton startIcon={<Icon name="bell" />}>Seguir discussão</ToggleButton>
      <ToggleButton
        iconOnly
        variant="ghost"
        aria-label="Favoritar"
        defaultPressed
        startIcon={<Icon name="star" />}
      />
      <ToggleButton iconOnly aria-label="Curtir comentário" startIcon={<Icon name="heart" />} />
    </>
  )
}
