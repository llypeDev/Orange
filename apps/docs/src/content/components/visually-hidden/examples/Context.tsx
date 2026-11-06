import { VisuallyHidden } from '@orangesys/ui'

const posts = ['Lançamento do Orange 0.1', 'Como testamos acessibilidade', 'Tokens na prática']

export default function Context() {
  return (
    <ul
      style={{ display: 'grid', gap: 12, width: '100%', margin: 0, padding: 0, listStyle: 'none' }}
    >
      {posts.map((title) => (
        <li
          key={title}
          style={{ display: 'flex', flexWrap: 'wrap', gap: '4px 16px', alignItems: 'baseline' }}
        >
          <span style={{ minWidth: 'min(260px, 100%)' }}>{title}</span>
          <a href={`#${title}`}>
            Ler mais
            <VisuallyHidden> sobre {title}</VisuallyHidden>
          </a>
        </li>
      ))}
    </ul>
  )
}
