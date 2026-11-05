import { Link } from '@orangesys/ui'

export default function External() {
  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <p style={{ margin: 0 }}>
        O padrão segue as{' '}
        <Link href="https://www.w3.org/WAI/ARIA/apg/" external>
          práticas de autoria WAI-ARIA
        </Link>
        .
      </p>
      <Link href="https://github.com/llypeDev/Orange" variant="standalone" external>
        Ver código no GitHub
      </Link>
    </div>
  )
}
