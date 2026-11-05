import { Avatar, AvatarGroup } from '@orangesys/ui'

const reviewers = ['Mariana Lopes', 'Rafael Costa', 'Beatriz Nunes', 'Diego Almeida', 'Lívia Martins', 'Thiago Rocha']

export default function Basic() {
  return (
    <AvatarGroup label="Revisores do documento" max={4}>
      {reviewers.map((name) => (
        <Avatar key={name} name={name} />
      ))}
    </AvatarGroup>
  )
}
