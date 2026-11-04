import { VisuallyHidden } from '@orange/ui'

const posts = ['Lançamento do Orange 0.1', 'Como testamos acessibilidade', 'Tokens na prática']

export default function Context() {
  return (
    <ul style={{ display: 'grid', gap: 12, margin: 0, padding: 0, listStyle: 'none' }}>
      {posts.map((title) => (
        <li key={title} style={{ display: 'flex', gap: 16, alignItems: 'baseline' }}>
          <span style={{ minWidth: 260 }}>{title}</span>
          <a href={`#${title}`}>
            Ler mais
            <VisuallyHidden> sobre {title}</VisuallyHidden>
          </a>
        </li>
      ))}
    </ul>
  )
}
