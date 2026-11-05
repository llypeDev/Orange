import { Link } from '@orangesys/ui'

const posts = [
  { title: 'Como reduzimos o tempo de checkout em 38%', href: '#checkout' },
  { title: 'Guia de migração para a API v3', href: '#api-v3' },
  { title: 'Novidades de outubro', href: '#outubro' },
]

export default function Standalone() {
  return (
    <div style={{ display: 'grid', gap: 16, width: '100%', maxWidth: 520 }}>
      <p className="or-eyebrow" style={{ margin: 0 }}>
        Do blog
      </p>
      <ul style={{ display: 'grid', gap: 12, margin: 0, padding: 0, listStyle: 'none' }}>
        {posts.map((post) => (
          <li key={post.href}>
            <Link href={post.href} variant="standalone">
              {post.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
