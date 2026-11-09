import { Spinner, Stack } from '@orangesys/ui'

export default function Sizes() {
  return (
    <Stack gap={8} direction="horizontal" align="center">
      <Spinner size="sm" />
      <Spinner size="md" />
      <Spinner size="lg" />
    </Stack>
  )
}
