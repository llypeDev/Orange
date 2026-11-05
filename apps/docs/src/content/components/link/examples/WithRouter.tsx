import { Link } from '@orangesys/ui'
import { forwardRef, type AnchorHTMLAttributes } from 'react'

// Em um app real, importe o link do seu roteador:
// import { Link as RouterLink } from 'react-router-dom'
const RouterLink = forwardRef<HTMLAnchorElement, AnchorHTMLAttributes<HTMLAnchorElement> & { to: string }>(
  function RouterLink({ to, ...props }, ref) {
    return <a ref={ref} href={`#${to}`} {...props} />
  },
)

export default function WithRouter() {
  return (
    <p style={{ margin: 0 }}>
      Altere seus dados em{' '}
      <Link as={RouterLink} to="/conta/perfil">
        Minha conta
      </Link>{' '}
      ou{' '}
      <Link as={RouterLink} to="/conta/seguranca" variant="standalone">
        revise a segurança
      </Link>
    </p>
  )
}
