import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { forwardRef, type AnchorHTMLAttributes } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { OrangeProvider } from '../../providers'
import { expectNoA11yViolations } from '../../test/axe'
import { Link } from './Link'

describe('Link', () => {
  it('renderiza um <a> com a variante padrão', () => {
    render(<Link href="/precos">Ver preços</Link>)
    const link = screen.getByRole('link', { name: 'Ver preços' })
    expect(link).toHaveAttribute('href', '/precos')
    expect(link).toHaveClass('or-link', 'or-link--default')
    expect(link).not.toHaveAttribute('target')
  })

  it('aplica as variantes subtle e standalone (com seta decorativa)', () => {
    render(
      <>
        <Link href="/a" variant="subtle">
          Termos
        </Link>
        <Link href="/b" variant="standalone">
          Ler o guia
        </Link>
      </>,
    )
    expect(screen.getByRole('link', { name: 'Termos' })).toHaveClass('or-link--subtle')
    const standalone = screen.getByRole('link', { name: 'Ler o guia' })
    expect(standalone).toHaveClass('or-link--standalone')
    expect(standalone.querySelector('[data-icon="arrow-right"]')).toHaveAttribute('aria-hidden', 'true')
  })

  it('link externo abre em nova aba com rel seguro e aviso para leitores de tela', () => {
    render(
      <Link href="https://www.w3.org/WAI/" external>
        Guia WAI
      </Link>,
    )
    const link = screen.getByRole('link', { name: 'Guia WAI (abre em nova aba)' })
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', 'noopener noreferrer')
    expect(link.querySelector('[data-icon="arrow-up-right"]')).toBeInTheDocument()
  })

  it('usa as mensagens do idioma configurado', () => {
    render(
      <OrangeProvider locale="en-US" themeTarget="scoped">
        <Link href="https://example.com" external>
          Docs
        </Link>
      </OrangeProvider>,
    )
    expect(screen.getByRole('link', { name: 'Docs (opens in a new tab)' })).toBeInTheDocument()
  })

  it('é polimórfico via `as` e repassa props e ref ao componente do roteador', async () => {
    const user = userEvent.setup()
    const navigate = vi.fn()
    const RouterLink = forwardRef<HTMLAnchorElement, AnchorHTMLAttributes<HTMLAnchorElement> & { to: string }>(
      function RouterLink({ to, onClick, ...props }, ref) {
        return (
          <a
            ref={ref}
            href={to}
            onClick={(e) => {
              e.preventDefault()
              onClick?.(e)
              navigate(to)
            }}
            {...props}
          />
        )
      },
    )
    const ref = { current: null as HTMLAnchorElement | null }
    render(
      <Link as={RouterLink} to="/conta" ref={ref}>
        Minha conta
      </Link>,
    )
    const link = screen.getByRole('link', { name: 'Minha conta' })
    expect(ref.current).toBe(link)
    expect(link).toHaveClass('or-link')
    await user.click(link)
    expect(navigate).toHaveBeenCalledWith('/conta')
  })

  it('recebe foco pelo teclado e ativa com Enter', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn((e: React.MouseEvent) => e.preventDefault())
    render(
      <Link href="/ajuda" onClick={onClick}>
        Ajuda
      </Link>,
    )
    await user.tab()
    expect(screen.getByRole('link')).toHaveFocus()
    await user.keyboard('{Enter}')
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('não possui violações de acessibilidade', async () => {
    const { container } = render(
      <p>
        Leia a <Link href="/privacidade">política de privacidade</Link>,{' '}
        <Link href="/termos" variant="subtle">
          termos de uso
        </Link>{' '}
        e{' '}
        <Link href="https://www.w3.org" external>
          diretrizes W3C
        </Link>
        . <Link href="/guia" variant="standalone">Ver guia completo</Link>
      </p>,
    )
    await expectNoA11yViolations(container)
  })
})
