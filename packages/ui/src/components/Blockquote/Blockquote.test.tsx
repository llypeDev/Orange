import { render, screen } from '@testing-library/react'
import { createRef } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { expectNoA11yViolations } from '../../test/axe'
import { Blockquote } from './Blockquote'

describe('Blockquote', () => {
  it('sem fonte, renderiza só o <blockquote> (sem figure)', () => {
    const { container } = render(
      <Blockquote cite="https://exemplo.com.br/relatorio-2026">
        O prazo médio de resposta caiu de 9 para 4 horas.
      </Blockquote>,
    )
    expect(container.querySelector('figure')).toBeNull()
    expect(container.querySelector('figcaption')).toBeNull()
    const quote = container.firstElementChild!
    expect(quote.tagName).toBe('BLOCKQUOTE')
    expect(quote).toHaveClass('or-blockquote', 'or-blockquote__quote', 'or-blockquote--md')
    expect(quote).toHaveAttribute('cite', 'https://exemplo.com.br/relatorio-2026')
    expect(quote).toHaveTextContent('O prazo médio de resposta caiu de 9 para 4 horas.')
  })

  it('com fonte, usa <figure> com <blockquote cite> e <figcaption>', () => {
    const { container } = render(
      <Blockquote
        cite="https://exemplo.com.br/relatorio-2026"
        source={
          <>
            Ana Lima, <cite>Relatório de Atendimento 2026</cite>
          </>
        }
      >
        <p>Automatizar a triagem liberou a equipe para os casos difíceis.</p>
      </Blockquote>,
    )
    const figure = screen.getByRole('figure')
    expect(figure).toHaveClass('or-blockquote', 'or-blockquote--md')
    expect(figure).not.toHaveClass('or-blockquote__quote')

    const quote = figure.querySelector('blockquote')!
    expect(quote).toHaveClass('or-blockquote__quote')
    expect(quote).toHaveAttribute('cite', 'https://exemplo.com.br/relatorio-2026')
    expect(quote.querySelector('p')).toHaveTextContent('Automatizar a triagem')

    const caption = figure.querySelector('figcaption')!
    expect(caption).toHaveClass('or-blockquote__source')
    expect(caption.querySelector('cite')).toHaveTextContent('Relatório de Atendimento 2026')
    // O travessão é decorativo (CSS), não entra no texto.
    expect(caption.textContent).toBe('Ana Lima, Relatório de Atendimento 2026')
    expect(container.querySelectorAll('blockquote')).toHaveLength(1)
  })

  it('não cria figure com source vazio, null ou false', () => {
    const { container, rerender } = render(<Blockquote source="">Texto</Blockquote>)
    expect(container.querySelector('figure')).toBeNull()
    rerender(<Blockquote source={null}>Texto</Blockquote>)
    expect(container.querySelector('figure')).toBeNull()
    rerender(<Blockquote source={false}>Texto</Blockquote>)
    expect(container.querySelector('figure')).toBeNull()
  })

  it('sem cite, não escreve o atributo', () => {
    const { container } = render(<Blockquote source="Equipe de Produto">Texto</Blockquote>)
    expect(container.querySelector('blockquote')).not.toHaveAttribute('cite')
  })

  it('aplica o tamanho', () => {
    const { container, rerender } = render(<Blockquote size="sm">Texto</Blockquote>)
    expect(container.firstElementChild).toHaveClass('or-blockquote--sm')
    rerender(
      <Blockquote size="lg" source="Fonte">
        Texto
      </Blockquote>,
    )
    expect(container.firstElementChild).toHaveClass('or-blockquote--lg')
  })

  it('repassa ref, className e atributos para a raiz (blockquote ou figure)', () => {
    const ref = createRef<HTMLElement>()
    const { rerender } = render(
      <Blockquote ref={ref} className="extra" data-testid="raiz" id="citacao">
        Texto
      </Blockquote>,
    )
    expect(ref.current).toBe(screen.getByTestId('raiz'))
    expect(ref.current?.tagName).toBe('BLOCKQUOTE')
    expect(ref.current).toHaveClass('extra', 'or-blockquote')
    expect(ref.current).toHaveAttribute('id', 'citacao')

    rerender(
      <Blockquote ref={ref} className="extra" data-testid="raiz" source="Fonte">
        Texto
      </Blockquote>,
    )
    expect(ref.current).toBe(screen.getByTestId('raiz'))
    expect(ref.current?.tagName).toBe('FIGURE')
    expect(ref.current).toHaveClass('extra', 'or-blockquote')
  })

  it('as="div" é texto em destaque: sem <blockquote> e sem cite (com aviso)', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const { container } = render(
      <Blockquote as="div" cite="https://exemplo.com.br">
        A emissão de notas fica indisponível no domingo, das 2h às 6h.
      </Blockquote>,
    )
    expect(container.querySelector('blockquote')).toBeNull()
    const inset = container.firstElementChild!
    expect(inset.tagName).toBe('DIV')
    expect(inset).toHaveClass('or-blockquote', 'or-blockquote__quote')
    expect(inset).not.toHaveAttribute('cite')
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('Blockquote: `cite` só vale'))
  })

  it('não possui violações de acessibilidade', async () => {
    const { container } = render(
      <div>
        <Blockquote cite="https://exemplo.com.br/relatorio-2026">
          O prazo médio de resposta caiu de 9 para 4 horas.
        </Blockquote>
        <Blockquote
          size="lg"
          source={
            <>
              Ana Lima, <cite>Relatório de Atendimento 2026</cite>
            </>
          }
        >
          <p>Automatizar a triagem liberou a equipe para os casos difíceis.</p>
          <p>Hoje o primeiro contato acontece no mesmo dia.</p>
        </Blockquote>
        <Blockquote as="div" size="sm">
          Pedidos feitos depois das 18h são processados no próximo dia útil.
        </Blockquote>
      </div>,
    )
    await expectNoA11yViolations(container)
  })
})
