import { Avatar, AvatarGroup, Stack } from '@orangesys/ui'

const team = ['Ana Souza', 'Bruno Lima', 'Carla Dias', 'Diego Alves', 'Elisa Prado']

export default function SizesShapes() {
  return (
    <Stack gap={5}>
      <AvatarGroup label="Equipe de design" size="sm" max={3}>
        {team.map((name) => (
          <Avatar key={name} name={name} />
        ))}
      </AvatarGroup>
      <AvatarGroup label="Equipe de design" size="lg" shape="circle" max={3}>
        {team.map((name) => (
          <Avatar key={name} name={name} />
        ))}
      </AvatarGroup>
    </Stack>
  )
}
