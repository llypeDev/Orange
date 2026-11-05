import { render, screen } from '@testing-library/react'
import { createRef } from 'react'
import { describe, expect, it } from 'vitest'
import { expectNoA11yViolations } from '../../test/axe'
import { Container } from './Container'

describe('Container', () => {
  it('renderiza um <div> com o tamanho padrão xl', () => {
    render(<Container data-testid="container">Conteúdo</Container>)
    const container = screen.getByTestId('container')
    expect(container.tagName).toBe('DIV')
    expect(container).toHaveClass('or-container', 'or-container--xl')
  })

  it.each(['sm', 'md', 'lg', 'xl', 'full'] as const)('aplica o tamanho %s', (size) => {
    render(<Container data-testid="container" size={size} />)
    expect(screen.getByTestId('container')).toHaveClass(`or-container--${size}`)
  })

  it('com as="main" vira o landmark principal', () => {
    render(
      <Container as="main" size="md">
        <h1>Configurações</h1>
      </Container>,
    )
    expect(screen.getByRole('main').tagName).toBe('MAIN')
  })

  it('com as="section" e aria-labelledby vira uma região nomeada', () => {
    render(
      <Container as="section" aria-labelledby="titulo">
        <h2 id="titulo">Planos</h2>
      </Container>,
    )
    expect(screen.getByRole('region', { name: 'Planos' }).tagName).toBe('SECTION')
  })

  it('repassa ref, className e atributos', () => {
    const ref = createRef<HTMLElement>()
    render(<Container ref={ref} as="article" className="pagina" id="artigo" />)
    expect(ref.current?.tagName).toBe('ARTICLE')
    expect(ref.current).toHaveClass('or-container', 'pagina')
    expect(ref.current).toHaveAttribute('id', 'artigo')
  })

  it('não possui violações de acessibilidade', async () => {
    const { container } = render(
      <div>
        <Container as="header" size="full">
          <p>Loja Orange</p>
        </Container>
        <Container as="main" size="lg">
          <h1>Pedidos</h1>
          <p>Acompanhe envios e devoluções.</p>
        </Container>
      </div>,
    )
    await expectNoA11yViolations(container)
  })
})
