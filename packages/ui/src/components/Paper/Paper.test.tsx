import { act, render, screen } from '@testing-library/react'
import { createRef } from 'react'
import { describe, expect, it } from 'vitest'
import { OrangeProvider } from '../../providers'
import { expectNoA11yViolations } from '../../test/axe'
import { Paper } from './Paper'

describe('Paper', () => {
  it('renderiza um <div> com as classes padrão', () => {
    render(<Paper data-testid="paper">Conteúdo</Paper>)
    const paper = screen.getByTestId('paper')
    expect(paper.tagName).toBe('DIV')
    expect(paper).toHaveClass(
      'or-paper',
      'or-paper--padding-6',
      'or-paper--border-default',
      'or-paper--flat',
      'or-paper--tone-default',
    )
    expect(paper).not.toHaveAttribute('data-theme')
  })

  it('é polimórfico via `as` e mantém a semântica do elemento', () => {
    render(
      <Paper as="section" aria-labelledby="titulo">
        <h2 id="titulo">Plano atual</h2>
      </Paper>,
    )
    const region = screen.getByRole('region', { name: 'Plano atual' })
    expect(region.tagName).toBe('SECTION')
  })

  it('aplica padding, borda, elevação e tom', () => {
    render(
      <Paper data-testid="paper" padding={10} border="accent-left" elevation="raised" tone="subtle">
        x
      </Paper>,
    )
    expect(screen.getByTestId('paper')).toHaveClass(
      'or-paper--padding-10',
      'or-paper--border-accent-left',
      'or-paper--raised',
      'or-paper--tone-subtle',
    )
  })

  it('tom inverse aplica o tema oposto ao do contexto', () => {
    const { rerender } = render(
      <OrangeProvider theme="dark" themeTarget="scoped">
        <Paper tone="inverse" data-testid="paper">
          x
        </Paper>
      </OrangeProvider>,
    )
    expect(screen.getByTestId('paper')).toHaveAttribute('data-theme', 'light')
    rerender(
      <OrangeProvider theme="light" themeTarget="scoped">
        <Paper tone="inverse" data-testid="paper">
          x
        </Paper>
      </OrangeProvider>,
    )
    expect(screen.getByTestId('paper')).toHaveAttribute('data-theme', 'dark')
  })

  it('remove o tema invertido quando o tom deixa de ser inverse', () => {
    const { rerender } = render(
      <Paper tone="inverse" data-testid="paper">
        x
      </Paper>,
    )
    expect(screen.getByTestId('paper')).toHaveAttribute('data-theme')
    rerender(
      <Paper tone="default" data-testid="paper">
        x
      </Paper>,
    )
    expect(screen.getByTestId('paper')).not.toHaveAttribute('data-theme')
  })

  it('reage à troca de data-theme em um ancestral', async () => {
    render(
      <div data-testid="scope">
        <Paper tone="inverse" data-testid="paper">
          x
        </Paper>
      </div>,
    )
    const scope = screen.getByTestId('scope')
    const original = window.getComputedStyle
    // jsdom não calcula color-scheme: simula o valor herdado do escopo
    window.getComputedStyle = ((el: Element) =>
      ({ colorScheme: (el as HTMLElement).dataset.theme ?? '' }) as CSSStyleDeclaration) as typeof window.getComputedStyle
    await act(async () => {
      scope.setAttribute('data-theme', 'light')
      await Promise.resolve()
    })
    expect(screen.getByTestId('paper')).toHaveAttribute('data-theme', 'dark')
    window.getComputedStyle = original
  })

  it('repassa a ref para o elemento raiz', () => {
    const ref = createRef<HTMLElement>()
    render(<Paper ref={ref} as="article" />)
    expect(ref.current?.tagName).toBe('ARTICLE')
  })

  it('não possui violações de acessibilidade', async () => {
    const { container } = render(
      <div>
        <Paper as="section" aria-label="Resumo da fatura" border="accent-top">
          <p>Total do mês: R$ 1.240,00</p>
        </Paper>
        <Paper tone="inverse" elevation="overlay">
          <p>Plano Pro</p>
        </Paper>
      </div>,
    )
    await expectNoA11yViolations(container)
  })
})
