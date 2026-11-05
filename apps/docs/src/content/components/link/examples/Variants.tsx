import { Link } from '@orangesys/ui'

export default function Variants() {
  return (
    <div style={{ display: 'grid', gap: 20, maxWidth: 560 }}>
      <p style={{ margin: 0 }}>
        Ao continuar, você concorda com a <Link href="#privacidade">política de privacidade</Link> e confirma que leu
        as <Link href="#regras">regras da comunidade</Link>.
      </p>
      <p style={{ margin: 0, fontSize: 13, color: 'var(--or-color-text-subtle)' }}>
        © 2026 Orange Labs ·{' '}
        <Link href="#termos" variant="subtle">
          Termos
        </Link>{' '}
        ·{' '}
        <Link href="#cookies" variant="subtle">
          Cookies
        </Link>
      </p>
      <Link href="#planos" variant="standalone">
        Comparar todos os planos
      </Link>
    </div>
  )
}
