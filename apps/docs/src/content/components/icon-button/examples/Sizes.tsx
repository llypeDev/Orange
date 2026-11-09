import { IconButton, Stack } from '@orangesys/ui'

export default function Sizes() {
  return (
    <Stack gap={4} direction="horizontal" align="center">
      <IconButton icon="search" label="Buscar" variant="outline" size="lg" />
      <IconButton icon="search" label="Buscar" variant="outline" size="md" />
      <IconButton icon="search" label="Buscar" variant="outline" size="sm" />
    </Stack>
  )
}
