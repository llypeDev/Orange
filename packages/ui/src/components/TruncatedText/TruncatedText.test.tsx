import { render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { expectNoA11yViolations } from '../../test/axe'
import { TruncatedText } from './TruncatedText'

const longText =
  'Relatório consolidado de vendas do terceiro trimestre com comparativo regional e projeções para o próximo ano'

function mockSize(sizes: { scrollWidth?: number; clientWidth?: number; scrollHeight?: number; clientHeight?: number }) {
  for (const [key, value] of Object.entries(sizes)) {
    vi.spyOn(HTMLElement.prototype, key as 'scrollWidth', 'get').mockReturnValue(value)
  }
}

describe('TruncatedText', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('renderiza o texto completo no DOM (acessível) em um span de uma linha', () => {
    render(<TruncatedText>{longText}</TruncatedText>)
    const el = screen.getByText(longText)
    expect(el.tagName).toBe('SPAN')
    expect(el).toHaveClass('or-truncated-text', 'or-truncated-text--single')
    expect(el).not.toHaveAttribute('title')
    expect(el).not.toHaveAttribute('data-truncated')
  })

  it('várias linhas usam line-clamp com a variável --_lines', () => {
    render(
      <TruncatedText as="p" lines={3}>
        {longText}
      </TruncatedText>,
    )
    const el = screen.getByText(longText)
    expect(el.tagName).toBe('P')
    expect(el).toHaveClass('or-truncated-text--multi')
    expect(el.style.getPropertyValue('--_lines')).toBe('3')
  })

  it('detecta o corte, expõe data-truncated e mostra o title quando showTitle', () => {
    mockSize({ scrollWidth: 600, clientWidth: 200 })
    const onTruncatedChange = vi.fn()
    render(
      <TruncatedText showTitle onTruncatedChange={onTruncatedChange}>
        {longText}
      </TruncatedText>,
    )
    const el = screen.getByText(longText)
    expect(el).toHaveAttribute('data-truncated', 'true')
    expect(el).toHaveAttribute('title', longText)
    expect(onTruncatedChange).toHaveBeenCalledWith(true)
  })

  it('detecta o corte em várias linhas pela altura', () => {
    mockSize({ scrollHeight: 120, clientHeight: 40 })
    render(
      <TruncatedText lines={2} showTitle>
        <strong>Importante:</strong> {longText}
      </TruncatedText>,
    )
    const el = screen.getByText('Importante:').parentElement!
    expect(el).toHaveAttribute('title', `Importante: ${longText}`)
  })

  it('não adiciona title quando o texto cabe; title explícito tem prioridade', () => {
    mockSize({ scrollWidth: 100, clientWidth: 200 })
    const { rerender } = render(<TruncatedText showTitle>Curto</TruncatedText>)
    expect(screen.getByText('Curto')).not.toHaveAttribute('title')
    rerender(
      <TruncatedText showTitle title="Texto da dica">
        Curto
      </TruncatedText>,
    )
    expect(screen.getByText('Curto')).toHaveAttribute('title', 'Texto da dica')
  })

  it('não possui violações de acessibilidade', async () => {
    const { container } = render(
      <div>
        <TruncatedText showTitle>{longText}</TruncatedText>
        <TruncatedText as="p" lines={2}>
          {longText}
        </TruncatedText>
      </div>,
    )
    await expectNoA11yViolations(container)
  })
})
