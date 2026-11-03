import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { OrangeProvider } from '../../providers'
import { expectNoA11yViolations } from '../../test/axe'
import { SkipLink } from './SkipLink'

function Page({ children }: { children?: React.ReactNode }) {
  return (
    <>
      {children ?? <SkipLink />}
      <header>
        <a href="/">Início</a>
        <a href="/precos">Preços</a>
      </header>
      <main id="main">
        <h1>Painel</h1>
      </main>
    </>
  )
}

describe('SkipLink', () => {
  it('renderiza o link com texto e destino padrão', () => {
    render(<Page />)
    const link = screen.getByRole('link', { name: 'Pular para o conteúdo principal' })
    expect(link).toHaveAttribute('href', '#main')
    expect(link).toHaveClass('or-skip-link')
  })

  it('é o primeiro elemento a receber foco com Tab', async () => {
    const user = userEvent.setup()
    render(<Page />)
    await user.tab()
    expect(screen.getByRole('link', { name: 'Pular para o conteúdo principal' })).toHaveFocus()
  })

  it('move o foco para o alvo ao ativar com Enter e limpa o tabindex temporário', async () => {
    const user = userEvent.setup()
    render(<Page />)
    await user.tab()
    await user.keyboard('{Enter}')
    const main = screen.getByRole('main')
    expect(main).toHaveFocus()
    expect(main).toHaveAttribute('tabindex', '-1')
    await user.tab()
    expect(main).not.toHaveAttribute('tabindex')
  })

  it('aceita destino e rótulo customizados e repassa onClick', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(
      <Page>
        <SkipLink href="#busca" onClick={onClick}>
          Pular para a busca
        </SkipLink>
        <input id="busca" aria-label="Buscar produtos" />
      </Page>,
    )
    await user.click(screen.getByRole('link', { name: 'Pular para a busca' }))
    expect(onClick).toHaveBeenCalled()
    const input = screen.getByRole('textbox', { name: 'Buscar produtos' })
    expect(input).toHaveFocus()
    expect(input).not.toHaveAttribute('tabindex')
  })

  it('traduz o rótulo padrão', () => {
    render(
      <OrangeProvider locale="en-US" themeTarget="scoped">
        <SkipLink />
      </OrangeProvider>,
    )
    expect(screen.getByRole('link', { name: 'Skip to main content' })).toBeInTheDocument()
  })

  it('não possui violações de acessibilidade', async () => {
    const { container } = render(<Page />)
    await expectNoA11yViolations(container)
  })
})
