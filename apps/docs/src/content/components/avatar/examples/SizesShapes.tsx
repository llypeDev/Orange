import { Avatar, Stack } from '@orangesys/ui'
import rafael from './photos/rafael.svg'

const sizes = ['xs', 'sm', 'md', 'lg', 'xl'] as const

export default function SizesShapes() {
  return (
    <Stack gap={5}>
      <Stack gap={4} direction="horizontal" align="end">
        {sizes.map((size) => (
          <Avatar key={size} size={size} name="Diego Almeida" />
        ))}
      </Stack>
      <Stack gap={4} direction="horizontal" align="end">
        {sizes.map((size) => (
          <Avatar key={size} size={size} shape="circle" src={rafael} name="Rafael Costa" />
        ))}
      </Stack>
    </Stack>
  )
}
