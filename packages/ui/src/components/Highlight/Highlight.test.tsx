import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { expectNoA11yViolations } from '../../test/axe'
import { Highlight } from './Highlight'

const marks = (container: HTMLElement) => Array.from(container.querySelectorAll('mark')).map((m) => m.textContent)

describe('Highlight', () => {
  it('envolve as ocorrências em <mark> preservando o texto completo', () => {
    const { container } = render(<Highlight query="pagamento">Pagamento aprovado — confira o pagamento</Highlight>)
    expect(marks(container)).toEqual(['Pagamento', 'pagamento'])
    expect(container.textContent).toBe('Pagamento aprovado — confira o pagamento')
    expect(container.querySelector('mark')).toHaveClass('or-highlight__mark')
  })

  it('ignora acentos e maiúsculas nos dois sentidos', () => {
    const { container, rerender } = render(<Highlight query="sao paulo">Filial São Paulo</Highlight>)
    expect(marks(container)).toEqual(['São Paulo'])
    rerender(<Highlight query="Ação">Acao rápida e ação</Highlight>)
    expect(marks(container)).toEqual(['Acao', 'ação'])
  })

  it('aceita vários termos e destaca a ocorrência mais longa', () => {
    const { container } = render(<Highlight query={['nota', 'nota fiscal', 'xml']}>Baixe a nota fiscal em XML</Highlight>)
    expect(marks(container)).toEqual(['nota fiscal', 'XML'])
  })

  it('escapa caracteres especiais de regex', () => {
    const { container } = render(<Highlight query="(R$ 9.90)">Plano básico (R$ 9.90) por mês</Highlight>)
    expect(marks(container)).toEqual(['(R$ 9.90)'])
  })

  it('não destaca nada com termo vazio', () => {
    const { container } = render(<Highlight query={['', '   ']}>Sem destaque</Highlight>)
    expect(container.querySelector('mark')).toBeNull()
    expect(screen.getByText('Sem destaque')).toHaveClass('or-highlight')
  })

  it('caseSensitive e accentSensitive restringem a busca', () => {
    const { container, rerender } = render(
      <Highlight query="Rio" caseSensitive>
        Rio de Janeiro e rio Tietê
      </Highlight>,
    )
    expect(marks(container)).toEqual(['Rio'])
    rerender(
      <Highlight query="tiete" accentSensitive>
        Rio Tietê e tiete
      </Highlight>,
    )
    expect(marks(container)).toEqual(['tiete'])
  })

  it('mapeia corretamente texto em NFD com acentos combinantes', () => {
    const decomposed = 'Pac\u0327oca e cafe\u0301'
    const { container } = render(<Highlight query={['paçoca', 'café']}>{decomposed}</Highlight>)
    expect(marks(container)).toEqual(['Pac\u0327oca', 'cafe\u0301'])
  })

  it('une ocorrências sobrepostas ou adjacentes', () => {
    const { container } = render(<Highlight query={['ab', 'bc']}>xabcx</Highlight>)
    expect(marks(container)).toEqual(['abc'])
    const adjacent = render(<Highlight query={['ab', 'cd']}>abcd</Highlight>)
    expect(marks(adjacent.container)).toEqual(['abcd'])
  })

  it('permite trocar o elemento com `as`', () => {
    render(
      <Highlight as="p" query="x">
        x
      </Highlight>,
    )
    expect(screen.getByText('x').closest('p')).toHaveClass('or-highlight')
  })

  it('não possui violações de acessibilidade', async () => {
    const { container } = render(
      <ul>
        <li>
          <Highlight query="relatório">Relatório mensal de vendas</Highlight>
        </li>
        <li>
          <Highlight query={['ana', 'souza']}>Ana Souza — Financeiro</Highlight>
        </li>
      </ul>,
    )
    await expectNoA11yViolations(container)
  })
})
